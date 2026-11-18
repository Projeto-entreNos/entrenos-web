using EntreNos.Api.Auth;
using EntreNos.Api.Models;
using EntreNos.Api.Services;
using EntreNos.Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EntreNos.Api.Controllers;

[ApiController]
[Route("api")]
public class ServicosController : ControllerBase
{
    private const string ObservacoesPadrao = "As vagas dependem da disponibilidade da universidade.";

    private readonly EntreNosContext _db;

    public ServicosController(EntreNosContext db)
    {
        _db = db;
    }

    // Todos os status entram na lista: a tela mostra os selos "Sem vagas" e "Pausado"
    [HttpGet("empresas/{empresaId}/servicos")]
    [Authorize(Roles = "colaborador")]
    public async Task<IActionResult> ListarDoPacote(int empresaId)
    {
        if (empresaId != User.ObterEmpresaId())
        {
            return Forbid();
        }

        var empresa = await _db.Empresas.AsNoTracking().FirstOrDefaultAsync(e => e.Id == empresaId);
        if (empresa == null)
        {
            return NotFound(new { mensagem = "Não encontramos a sua empresa." });
        }

        var servicos = await _db.Servicos
            .AsNoTracking()
            .Include(s => s.Categoria)
            .Include(s => s.Universidade)
            .Where(s => s.Pacotes.Any(p => p.Id == empresa.PacoteId))
            .OrderBy(s => s.Id)
            .ToListAsync();

        // Formato: [{ id, nome, categoria, descricaoCurta, modalidade, local, status,
        //   previsaoRetorno, novo, universidade: { id, nome } }]
        var resposta = servicos.Select(s => new
        {
            id = s.Id,
            nome = s.Nome,
            categoria = s.Categoria.Nome,
            descricaoCurta = s.DescricaoCurta,
            modalidade = s.Modalidade,
            local = s.Local ?? "",
            status = s.Status,
            previsaoRetorno = Datas.FormatarDia(s.PrevisaoRetorno),
            novo = RegrasServico.ServicoNovo(s),
            universidade = new { id = s.Universidade.Id, nome = s.Universidade.Nome },
        });

        return Ok(resposta);
    }

    // Serviço fora do pacote da empresa responde igual a serviço inexistente
    [HttpGet("empresas/{empresaId}/servicos/{id:int}")]
    [Authorize(Roles = "colaborador")]
    public async Task<IActionResult> Detalhe(int empresaId, int id)
    {
        if (empresaId != User.ObterEmpresaId())
        {
            return Forbid();
        }

        var empresa = await _db.Empresas.AsNoTracking().FirstOrDefaultAsync(e => e.Id == empresaId);
        if (empresa == null)
        {
            return NotFound(new { mensagem = "Não encontramos a sua empresa." });
        }

        var servico = await _db.Servicos
            .AsNoTracking()
            .Include(s => s.Categoria)
            .Include(s => s.Universidade)
            .FirstOrDefaultAsync(s => s.Id == id && s.Pacotes.Any(p => p.Id == empresa.PacoteId));

        if (servico == null)
        {
            return NotFound(new { mensagem = "Serviço não encontrado." });
        }

        // Formato: { id, nome, categoria, descricaoCurta, descricaoCompleta, modalidade, local, observacoes,
        //   status, previsaoRetorno, novo, universidade: { id, nome } }
        return Ok(new
        {
            id = servico.Id,
            nome = servico.Nome,
            categoria = servico.Categoria.Nome,
            descricaoCurta = servico.DescricaoCurta,
            descricaoCompleta = servico.DescricaoCompleta,
            modalidade = servico.Modalidade,
            local = servico.Local ?? "",
            observacoes = ObservacoesPadrao,
            status = servico.Status,
            previsaoRetorno = Datas.FormatarDia(servico.PrevisaoRetorno),
            novo = RegrasServico.ServicoNovo(servico),
            universidade = new { id = servico.Universidade.Id, nome = servico.Universidade.Nome },
        });
    }

    // Ordem da landing page. Usada no filtro de Benefícios e no formulário do Admin Serviços.
    [HttpGet("servicos/categorias")]
    [Authorize]
    public async Task<IActionResult> Categorias()
    {
        var nomes = await _db.Categorias
            .OrderBy(c => c.Ordem)
            .Select(c => c.Nome)
            .ToListAsync();

        // Formato: ["Apoio contábil e financeiro", "Consultoria em gestão e negócios", ...]
        return Ok(nomes);
    }
}
