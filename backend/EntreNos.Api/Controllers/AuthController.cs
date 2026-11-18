using EntreNos.Api.Auth;
using EntreNos.Api.Dtos;
using EntreNos.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EntreNos.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private const string MensagemLoginInvalido = "E-mail ou senha incorretos.";

    private readonly EntreNosContext _db;
    private readonly GeradorToken _geradorToken;
    private readonly IPasswordHasher<Usuario> _hasher;

    public AuthController(EntreNosContext db, GeradorToken geradorToken, IPasswordHasher<Usuario> hasher)
    {
        _db = db;
        _geradorToken = geradorToken;
        _hasher = hasher;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login(LoginRequisicao dados)
    {
        if (string.IsNullOrWhiteSpace(dados.Email) || string.IsNullOrEmpty(dados.Senha))
        {
            return Unauthorized(new { mensagem = MensagemLoginInvalido });
        }

        var email = dados.Email.Trim().ToLower();
        var usuario = await _db.Usuarios
            .FirstOrDefaultAsync(u => u.Email == email && u.RemovidoEm == null);

        // Convidado ainda não ativou a conta, então não tem senha.
        // A resposta é sempre a mesma, para não revelar quais e-mails têm conta.
        if (usuario == null || usuario.Status != "Ativo" || usuario.SenhaHash == null)
        {
            return Unauthorized(new { mensagem = MensagemLoginInvalido });
        }

        var resultado = _hasher.VerifyHashedPassword(usuario, usuario.SenhaHash, dados.Senha);
        if (resultado == PasswordVerificationResult.Failed)
        {
            return Unauthorized(new { mensagem = MensagemLoginInvalido });
        }

        // Formato: { token, usuario: { id, nome, email, perfil, empresaId } }
        return Ok(new
        {
            token = _geradorToken.Gerar(usuario),
            usuario = new
            {
                id = usuario.Id,
                nome = usuario.Nome,
                email = usuario.Email,
                perfil = usuario.Perfil,
                empresaId = usuario.EmpresaId,
            },
        });
    }

    [HttpGet("eu")]
    [Authorize]
    public IActionResult Eu()
    {
        return Ok(new
        {
            id = User.ObterUsuarioId(),
            perfil = User.ObterPerfil(),
            empresaId = User.ObterEmpresaId(),
        });
    }
}
