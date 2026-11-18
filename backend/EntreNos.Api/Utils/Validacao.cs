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
}
