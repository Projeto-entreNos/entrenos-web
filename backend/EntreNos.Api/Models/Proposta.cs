using System;
using System.Collections.Generic;

namespace EntreNos.Api.Models;

public partial class Proposta
{
    public int Id { get; set; }

    public string Nome { get; set; } = null!;

    public string Empresa { get; set; } = null!;

    public string Email { get; set; } = null!;

    public int NumeroColaboradores { get; set; }

    public string? Mensagem { get; set; }

    public bool AceitePrivacidade { get; set; }

    public DateTime CriadaEm { get; set; }
}
