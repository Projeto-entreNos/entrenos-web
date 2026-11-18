using System.Security.Claims;

namespace EntreNos.Api.Auth;

// Lê os dados de quem está logado, que vêm dentro do token
public static class ClaimsExtensions
{
    public static int ObterUsuarioId(this ClaimsPrincipal usuario)
    {
        return int.Parse(usuario.FindFirstValue(GeradorToken.ClaimUsuarioId)!);
    }

    // O admin não tem empresa: nesse caso devolve null
    public static int? ObterEmpresaId(this ClaimsPrincipal usuario)
    {
        var valor = usuario.FindFirstValue(GeradorToken.ClaimEmpresaId);
        if (string.IsNullOrEmpty(valor))
        {
            return null;
        }
        return int.Parse(valor);
    }

    public static string ObterPerfil(this ClaimsPrincipal usuario)
    {
        return usuario.FindFirstValue(GeradorToken.ClaimPerfil)!;
    }
}
