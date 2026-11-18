namespace EntreNos.Api.Dtos;

public class ConvitesRequisicao
{
    public List<ConviteItem>? Convites { get; set; }
}

public class ConviteItem
{
    public string? Email { get; set; }
    public string? Nome { get; set; }
}
