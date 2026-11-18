namespace EntreNos.Api.Dtos;

public class LoginRequisicao
{
    public string? Email { get; set; }
    public string? Senha { get; set; }
}

public class AtivarContaRequisicao
{
    public string? Token { get; set; }
    public string? Senha { get; set; }
    public bool AceitouTermos { get; set; }
}

public class RecuperarSenhaRequisicao
{
    public string? Email { get; set; }
}
