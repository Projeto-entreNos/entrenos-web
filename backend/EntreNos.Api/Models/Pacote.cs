using System;
using System.Collections.Generic;

namespace EntreNos.Api.Models;

public partial class Pacote
{
    public int Id { get; set; }

    public string Codigo { get; set; } = null!;

    public string Nome { get; set; } = null!;

    public string Descricao { get; set; } = null!;

    public string Beneficios { get; set; } = null!;

    public decimal PrecoPorColaborador { get; set; }

    public int LimiteAtendimentosMes { get; set; }

    public virtual ICollection<Empresa> Empresas { get; set; } = new List<Empresa>();

    public virtual ICollection<Servico> Servicos { get; set; } = new List<Servico>();
}
