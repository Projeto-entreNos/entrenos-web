namespace EntreNos.Api.Dtos;

public class PropostaRequisicao
{
    public string? Nome { get; set; }
    public string? Empresa { get; set; }
    public string? Email { get; set; }
    public int? NumeroColaboradores { get; set; }
    public string? Mensagem { get; set; }
    public bool AceitouPrivacidade { get; set; }
}
