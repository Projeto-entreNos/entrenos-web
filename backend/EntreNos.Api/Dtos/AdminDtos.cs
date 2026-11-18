namespace EntreNos.Api.Dtos;

public class EmpresaRequisicao
{
    public string? Nome { get; set; }
    public string? Cnpj { get; set; }
    public string? Responsavel { get; set; }
    public string? EmailResponsavel { get; set; }
    public string? PacoteId { get; set; }
    public int? VagasContratadas { get; set; }
    public DateOnly? VigenciaInicio { get; set; }
    public DateOnly? VigenciaFim { get; set; }
    public string? StatusContrato { get; set; }
}

public class StatusContratoRequisicao
{
    public string? StatusContrato { get; set; }
}

public class ServicoRequisicao
{
    public string? Nome { get; set; }
    public int? UniversidadeId { get; set; }
    public string? Categoria { get; set; }
    public string? DescricaoCurta { get; set; }
    public string? DescricaoCompleta { get; set; }
    public string? Modalidade { get; set; }
    public string? Local { get; set; }
    public List<string>? Pacotes { get; set; }
    public string? Status { get; set; }
    public DateOnly? PrevisaoRetorno { get; set; }
}

public class StatusSolicitacaoRequisicao
{
    public string? Status { get; set; }
}
