using EntreNos.Api.Dtos;
using EntreNos.Api.Models;
using EntreNos.Api.Utils;
using Microsoft.EntityFrameworkCore;

namespace EntreNos.Api.Services;

public class AdminServicosService
{
    private static readonly string[] StatusServico = { "Ativo", "Sem vagas", "Pausado" };
    private static readonly string[] Modalidades = { "Presencial", "Online", "Híbrido" };

    private readonly EntreNosContext _db;

    public AdminServicosService(EntreNosContext db)
    {
        _db = db;
    }

    // Formato: { id, nome, categoria, universidade: { id, nome }, modalidade, local, descricaoCurta,
    //   descricaoCompleta, pacotes: ["essencial", "completo"], status, previsaoRetorno, novo }
    public static object ParaResposta(Servico servico)
    {
        return new
        {
            id = servico.Id,
            nome = servico.Nome,
            categoria = servico.Categoria.Nome,
            universidade = new { id = servico.Universidade.Id, nome = servico.Universidade.Nome },
            modalidade = servico.Modalidade ?? "",
            local = servico.Local ?? "",
            descricaoCurta = servico.DescricaoCurta ?? "",
            descricaoCompleta = servico.DescricaoCompleta ?? "",
            pacotes = servico.Pacotes.OrderBy(p => p.Id).Select(p => p.Codigo),
            status = servico.Status,
            previsaoRetorno = Datas.FormatarDia(servico.PrevisaoRetorno),
            novo = RegrasServico.ServicoNovo(servico),
        };
    }

    public async Task<List<object>> Listar()
    {
        var servicos = await _db.Servicos
            .AsNoTracking()
            .Include(s => s.Categoria)
            .Include(s => s.Universidade)
            .Include(s => s.Pacotes)
            .OrderBy(s => s.Id)
            .ToListAsync();

        return servicos.Select(ParaResposta).ToList();
    }

    public async Task<Resultado> Criar(ServicoRequisicao dados)
    {
        var servico = new Servico { CriadoEm = DateTime.UtcNow };
        var erro = await CopiarCampos(dados, servico);
        if (erro != null)
        {
            return Resultado.Erro(400, erro);
        }

        _db.Servicos.Add(servico);
        await _db.SaveChangesAsync();

        return Resultado.Sucesso(201, ParaResposta(servico));
    }

    public async Task<Resultado> Editar(int id, ServicoRequisicao dados)
    {
        var servico = await _db.Servicos
            .Include(s => s.Pacotes)
            .FirstOrDefaultAsync(s => s.Id == id);
        if (servico == null)
        {
            return Resultado.Erro(404, "Serviço não encontrado.");
        }

        var erro = await CopiarCampos(dados, servico);
        if (erro != null)
        {
            return Resultado.Erro(400, erro);
        }

        await _db.SaveChangesAsync();

        return Resultado.Sucesso(200, ParaResposta(servico));
    }

    // Devolve o texto do primeiro erro, ou null
    private async Task<string?> CopiarCampos(ServicoRequisicao dados, Servico servico)
    {
        if (string.IsNullOrWhiteSpace(dados.Nome) || dados.Nome.Trim().Length > 120)
        {
            return "Informe o nome do serviço, com até 120 caracteres.";
        }

        var universidade = await _db.Universidades.FirstOrDefaultAsync(u => u.Id == dados.UniversidadeId);
        if (universidade == null)
        {
            return "Selecione a universidade.";
        }

        var categoria = await _db.Categorias.FirstOrDefaultAsync(c => c.Nome == dados.Categoria);
        if (categoria == null)
        {
            return "Selecione a categoria.";
        }

        var codigos = dados.Pacotes ?? new List<string>();
        var pacotes = await _db.Pacotes.Where(p => codigos.Contains(p.Codigo)).ToListAsync();
        if (codigos.Count == 0 || pacotes.Count != codigos.Distinct().Count())
        {
            return "Marque pelo menos um pacote.";
        }

        if (dados.Status == null || !StatusServico.Contains(dados.Status))
        {
            return "Status inválido.";
        }

        var modalidade = string.IsNullOrWhiteSpace(dados.Modalidade) ? null : dados.Modalidade;
        if (modalidade != null && !Modalidades.Contains(modalidade))
        {
            return "Modalidade inválida.";
        }

        var descricaoCurta = TextoOuNull(dados.DescricaoCurta);
        var descricaoCompleta = TextoOuNull(dados.DescricaoCompleta);
        var local = TextoOuNull(dados.Local);
        if (descricaoCurta?.Length > 200)
        {
            return "A descrição curta pode ter até 200 caracteres.";
        }
        if (descricaoCompleta?.Length > 1000)
        {
            return "A descrição completa pode ter até 1000 caracteres.";
        }
        if (local?.Length > 60)
        {
            return "O local pode ter até 60 caracteres.";
        }

        servico.Nome = dados.Nome.Trim();
        servico.Universidade = universidade;
        servico.UniversidadeId = universidade.Id;
        servico.Categoria = categoria;
        servico.CategoriaId = categoria.Id;
        servico.DescricaoCurta = descricaoCurta;
        servico.DescricaoCompleta = descricaoCompleta;
        servico.Modalidade = modalidade;
        servico.Local = local;
        servico.Status = dados.Status;

        // A previsão de retorno só existe em serviço Pausado e vale pelo mês: é gravada como dia 1
        if (dados.Status == "Pausado" && dados.PrevisaoRetorno != null)
        {
            var previsao = dados.PrevisaoRetorno.Value;
            servico.PrevisaoRetorno = new DateOnly(previsao.Year, previsao.Month, 1);
        }
        else
        {
            servico.PrevisaoRetorno = null;
        }

        servico.Pacotes.Clear();
        foreach (var pacote in pacotes)
        {
            servico.Pacotes.Add(pacote);
        }

        return null;
    }

    private static string? TextoOuNull(string? texto)
    {
        if (string.IsNullOrWhiteSpace(texto))
        {
            return null;
        }
        return texto.Trim();
    }
}
