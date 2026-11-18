using EntreNos.Api.Auth;
using EntreNos.Api.Services;
using EntreNos.Api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
builder.Services.AddDbContext<EntreNosContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("EntreNos")));

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

builder.Services.AddCors(opt => opt.AddPolicy("front", p =>
    p.WithOrigins("http://localhost:5173")
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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("front");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
