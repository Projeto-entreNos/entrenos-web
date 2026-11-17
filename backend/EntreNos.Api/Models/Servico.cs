using System;
using System.Collections.Generic;

namespace EntreNos.Api.Models;

public partial class Servico
{
    public int Id { get; set; }

    public string Nome { get; set; } = null!;

    public int UniversidadeId { get; set; }

    public int CategoriaId { get; set; }

    public string? DescricaoCurta { get; set; }

    public string? DescricaoCompleta { get; set; }

    public string? Modalidade { get; set; }

    public string? Local { get; set; }

    public string Status { get; set; } = null!;

    public DateOnly? PrevisaoRetorno { get; set; }

    public DateTime CriadoEm { get; set; }

    public virtual Categoria Categoria { get; set; } = null!;

    public virtual ICollection<Solicitaco> Solicitacos { get; set; } = new List<Solicitaco>();

    public virtual Universidade Universidade { get; set; } = null!;

    public virtual ICollection<Pacote> Pacotes { get; set; } = new List<Pacote>();
}
