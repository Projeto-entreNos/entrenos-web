using EntreNos.Api.Auth;
using EntreNos.Api.Services;
using EntreNos.Api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// A chave fica nos User Secrets (na máquina) ou nas configurações do Azure, nunca no repositório
var chaveJwt = builder.Configuration["Jwt:Chave"];
if (string.IsNullOrEmpty(chaveJwt) || Encoding.UTF8.GetByteCount(chaveJwt) < 32)
{
    Console.Error.WriteLine("A API não pode iniciar: falta a chave do JWT (Jwt:Chave), com pelo menos 32 caracteres.");
    Console.Error.WriteLine("Na pasta backend/EntreNos.Api, rode: dotnet user-secrets set \"Jwt:Chave\" \"<texto aleatório com 32 caracteres ou mais>\"");
    Environment.Exit(1);
}

builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(o =>
    {
        // Erros sem corpo (como NotFound()) ficam vazios e recebem a mensagem do UseStatusCodePages
        o.SuppressMapClientErrors = true;
        o.InvalidModelStateResponseFactory = ctx =>
            new BadRequestObjectResult(new { mensagem = "Confira os dados enviados." });
    });

builder.Services.AddScoped<IEnvioEmail, EnvioEmailLog>();
builder.Services.AddScoped<SolicitacoesService>();
builder.Services.AddScoped<ColaboradoresService>();
builder.Services.AddScoped<AdminEmpresasService>();
builder.Services.AddScoped<AdminServicosService>();

// O Azure SQL gratuito pausa quando fica parado e leva até 1 minuto para acordar:
// a conexão espera até 60 segundos e, se falhar, o EF Core tenta de novo.
var conexaoBanco = new SqlConnectionStringBuilder(builder.Configuration.GetConnectionString("EntreNos"))
{
    ConnectTimeout = 60,
};
builder.Services.AddDbContext<EntreNosContext>(opt =>
    opt.UseSqlServer(conexaoBanco.ConnectionString, sql =>
        sql.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null)));

builder.Services.AddSingleton(new GeradorToken(chaveJwt));
builder.Services.AddScoped<IPasswordHasher<Usuario>, PasswordHasher<Usuario>>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.MapInboundClaims = false;
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = GeradorToken.CriarChave(chaveJwt),
            NameClaimType = GeradorToken.ClaimUsuarioId,
            RoleClaimType = GeradorToken.ClaimPerfil,
            ClockSkew = TimeSpan.Zero,
        };

        // O token vale 8 horas, mas quem foi removido pela empresa perde o acesso na hora:
        // a cada pedido, a API confere no banco se o usuário continua ativo (senão, 401)
        opt.Events = new JwtBearerEvents
        {
            OnTokenValidated = async contexto =>
            {
                var db = contexto.HttpContext.RequestServices.GetRequiredService<EntreNosContext>();
                var usuarioId = contexto.Principal!.ObterUsuarioId();
                var ativo = await db.Usuarios.AnyAsync(u =>
                    u.Id == usuarioId && u.RemovidoEm == null && u.Status == "Ativo");
                if (!ativo)
                {
                    contexto.Fail("Usuário removido ou inativo.");
                }
            },
        };
    });
builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(opt =>
{
    opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Cole aqui só o token devolvido pelo POST /api/auth/login.",
    });
    opt.AddSecurityRequirement(documento => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", documento)] = new List<string>(),
    });
});

// Só o front do EntreNós pode chamar a API pelo navegador. Na máquina, ele roda em outro endereço
// (UrlFront) e precisa do CORS; no Azure, sai do wwwroot, no mesmo endereço da API.
var urlFront = builder.Configuration["UrlFront"] ?? "http://localhost:5173";
builder.Services.AddCors(opt => opt.AddPolicy("front", p =>
    p.WithOrigins(urlFront)
     .AllowAnyHeader()
     .AllowAnyMethod()));

var app = builder.Build();

app.UseExceptionHandler(erro => erro.Run(async ctx =>
{
    ctx.Response.StatusCode = 500;
    ctx.Response.ContentType = "application/json";
    await ctx.Response.WriteAsJsonAsync(new { mensagem = "Erro interno. Tente novamente." });
}));

// Só entra quando a resposta de erro saiu sem corpo
app.UseStatusCodePages(async contexto =>
{
    var resposta = contexto.HttpContext.Response;
    string? mensagem = resposta.StatusCode switch
    {
        401 => "Faça login para continuar.",
        403 => "Você não tem permissão para acessar isto.",
        404 => "Endereço não encontrado.",
        405 => "Método não permitido.",
        _ => null,
    };
    if (mensagem != null)
    {
        resposta.ContentType = "application/json";
        await resposta.WriteAsJsonAsync(new { mensagem });
    }
});

// O Swagger só existe em desenvolvimento
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}

app.UseHttpsRedirection();

// Build do React, copiado para wwwroot na publicação
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("front");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Endereço /api que não existe: 404 com { mensagem } (preenchida pelo UseStatusCodePages)
app.MapFallback("/api/{**caminho}", () => Results.NotFound());

// Os outros endereços são rotas do React (ex.: /beneficios ao recarregar a página)
app.MapFallbackToFile("index.html");

app.Run();
