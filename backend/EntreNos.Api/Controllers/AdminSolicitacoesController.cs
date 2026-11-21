using EntreNos.Api.Dtos;
using EntreNos.Api.Models;
using EntreNos.Api.Services;
using EntreNos.Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EntreNos.Api.Controllers;

[ApiController]
[Route("api/admin/solicitacoes")]
[Authorize(Roles = "admin")]
public class AdminSolicitacoesController : ControllerBase
{
    private readonly EntreNosContext _db;
    private readonly SolicitacoesService _solicitacoes;

    public AdminSolicitacoesController(EntreNosContext db, SolicitacoesService solicitacoes)
    {
        _db = db;
        _solicitacoes = solicitacoes;
    }

    // LGPD: o texto da mensagem nem sai do banco; a consulta só pergunta se ela existe (temMensagem).
    [HttpGet]
    public async Task<IActionResult> Listar([FromQuery] string? status)
    {
        var consulta = _db.Solicitacoes.AsNoTracking();
        if (!string.IsNullOrEmpty(status))
        {
            consulta = consulta.Where(s => s.Status == status);
        }

        var solicitacoes = await consulta
            .OrderByDescending(s => s.CriadaEm)
            .ThenByDescending(s => s.Id)
            .Select(s => new
            {
                s.Id,
                s.Status,
                s.CriadaEm,
                s.AtualizadaEm,
                s.AtendidaEm,
                TemMensagem = s.Mensagem != null && s.Mensagem != "",
                ColaboradorNome = s.Usuario.Nome,
                ColaboradorEmail = s.Usuario.Email,
                EmpresaId = s.Usuario.Empresa!.Id,
                EmpresaNome = s.Usuario.Empresa.Nome,
                ServicoNome = s.Servico.Nome,
                UniversidadeId = s.Servico.Universidade.Id,
                UniversidadeNome = s.Servico.Universidade.Nome,
                UniversidadeEmail = s.Servico.Universidade.EmailContato,
            })
            .ToListAsync();

        // Formato: [ { id, status, criadaEm, atualizadaEm, atendidaEm, temMensagem,
        //   colaborador: { nome, email }, empresa: { id, nome }, servico: { nome },
        //   universidade: { id, nome, email } } ]
        var resposta = solicitacoes.Select(s => new
        {
            id = s.Id,
            status = s.Status,
            criadaEm = Datas.FormatarDia(s.CriadaEm),
            atualizadaEm = Datas.FormatarDia(s.AtualizadaEm),
            atendidaEm = Datas.FormatarDia(s.AtendidaEm),
            temMensagem = s.TemMensagem,
            colaborador = new { nome = s.ColaboradorNome, email = s.ColaboradorEmail },
            empresa = new { id = s.EmpresaId, nome = s.EmpresaNome },
            servico = new { nome = s.ServicoNome },
            universidade = new { id = s.UniversidadeId, nome = s.UniversidadeNome, email = s.UniversidadeEmail },
        });

        return Ok(resposta);
    }

    [HttpPost("{id}/status")]
    public async Task<IActionResult> AlterarStatus(int id, StatusSolicitacaoRequisicao dados)
    {
        var resultado = await _solicitacoes.AlterarStatus(id, dados.Status);
        return StatusCode(resultado.Status, resultado.Corpo);
    }
}
