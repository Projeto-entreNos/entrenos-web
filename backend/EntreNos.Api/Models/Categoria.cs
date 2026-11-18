using System;
using System.Collections.Generic;

namespace EntreNos.Api.Models;

public partial class Categoria
{
    public int Id { get; set; }

    public string Nome { get; set; } = null!;

    public int Ordem { get; set; }

    public virtual ICollection<Servico> Servicos { get; set; } = new List<Servico>();
}
