using System.Security.Claims;
using System.Text;
using EntreNos.Api.Models;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace EntreNos.Api.Auth;

public class GeradorToken
{
    public const string ClaimUsuarioId = "sub";
    public const string ClaimPerfil = "role";
    public const string ClaimEmpresaId = "empresaId";

    public static readonly TimeSpan Validade = TimeSpan.FromHours(8);

    private readonly SymmetricSecurityKey _chave;

    public GeradorToken(string chave)
    {
        _chave = CriarChave(chave);
    }

    public static SymmetricSecurityKey CriarChave(string chave)
    {
        return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(chave));
    }

    public string Gerar(Usuario usuario)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimUsuarioId, usuario.Id.ToString()),
            new Claim(ClaimPerfil, usuario.Perfil),
        };
        if (usuario.EmpresaId != null)
        {
            claims.Add(new Claim(ClaimEmpresaId, usuario.EmpresaId.Value.ToString()));
        }

        var descricao = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.Add(Validade),
            SigningCredentials = new SigningCredentials(_chave, SecurityAlgorithms.HmacSha256),
        };

        return new JsonWebTokenHandler().CreateToken(descricao);
    }
}
