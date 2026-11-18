using System.Text.RegularExpressions;

namespace EntreNos.Api.Utils;

public static class Validacao
{
    // Mesmo formato conferido no front (algo@algo.algo)
    public static bool EmailValido(string? email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return false;
        }
        return Regex.IsMatch(email.Trim(), @"^[^\s@]+@[^\s@]+\.[^\s@]+$");
    }

    // Mesmas regras da tela de ativação: 8 caracteres ou mais, com pelo menos uma letra e um número
    public static bool SenhaValida(string? senha)
    {
        if (senha == null || senha.Length < 8)
        {
            return false;
        }
        return Regex.IsMatch(senha, @"[a-zA-ZÀ-ÿ]") && Regex.IsMatch(senha, @"[0-9]");
    }
}
