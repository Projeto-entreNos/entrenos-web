using System;
using System.Collections.Generic;

namespace EntreNos.Api.Models;

public partial class Empresa
{
    public int Id { get; set; }

    public string Nome { get; set; } = null!;

    public string Cnpj { get; set; } = null!;

    public string Responsavel { get; set; } = null!;

    public string EmailResponsavel { get; set; } = null!;

    public string DominioEmail { get; set; } = null!;

    public int PacoteId { get; set; }

    public int VagasContratadas { get; set; }

    public string StatusContrato { get; set; } = null!;

    public DateOnly VigenciaInicio { get; set; }

    public DateOnly VigenciaFim { get; set; }

    public DateTime CriadaEm { get; set; }

    public virtual Pacote Pacote { get; set; } = null!;

    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
