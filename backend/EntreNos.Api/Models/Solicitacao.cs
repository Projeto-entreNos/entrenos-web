using System;
using System.Collections.Generic;

namespace EntreNos.Api.Models;

public partial class Solicitacao
{
    public int Id { get; set; }

    public int UsuarioId { get; set; }

    public int ServicoId { get; set; }

    public string? Mensagem { get; set; }

    public string Status { get; set; } = null!;

    public DateTime CriadaEm { get; set; }

    public DateTime AtualizadaEm { get; set; }

    public DateTime? AtendidaEm { get; set; }

    public virtual Servico Servico { get; set; } = null!;

    public virtual Usuario Usuario { get; set; } = null!;
}
