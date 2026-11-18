using System;
using System.Collections.Generic;

namespace EntreNos.Api.Models;

public partial class Universidade
{
    public int Id { get; set; }

    public string Nome { get; set; } = null!;

    public string EmailContato { get; set; } = null!;

    public virtual ICollection<Servico> Servicos { get; set; } = new List<Servico>();
}
