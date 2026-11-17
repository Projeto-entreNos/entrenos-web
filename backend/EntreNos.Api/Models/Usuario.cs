using System;
using System.Collections.Generic;

namespace EntreNos.Api.Models;

public partial class Usuario
{
    public int Id { get; set; }

    public string Nome { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? SenhaHash { get; set; }

    public string Perfil { get; set; } = null!;

    public int? EmpresaId { get; set; }

    public string Status { get; set; } = null!;

    public string? TokenConvite { get; set; }

    public DateTime? ConviteEnviadoEm { get; set; }

    public DateTime? AtivadoEm { get; set; }

    public DateTime? TermosAceitosEm { get; set; }

    public DateTime? RemovidoEm { get; set; }

    public DateTime CriadoEm { get; set; }

    public virtual Empresa? Empresa { get; set; }

    public virtual ICollection<Solicitaco> Solicitacos { get; set; } = new List<Solicitaco>();
}
