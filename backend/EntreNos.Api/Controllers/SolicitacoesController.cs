using EntreNos.Api.Auth;
using EntreNos.Api.Dtos;
using EntreNos.Api.Models;
using EntreNos.Api.Services;
using EntreNos.Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EntreNos.Api.Controllers;

[ApiController]
[Route("api")]
[Authorize(Roles = "colaborador")]
public class SolicitacoesController : ControllerBase
{
    private readonly EntreNosContext _db;
    private readonly SolicitacoesService _solicitacoes;

    public SolicitacoesController(EntreNosContext db, SolicitacoesService solicitacoes)
    {
        _db = db;
        _solicitacoes = solicitacoes;
    }

    // LGPD: a lista nunca traz a mensagem, que é só da universidade
    [HttpGet("usuarios/{usuarioId}/solicitacoes")]
    public async Task<IActionResult> ListarMinhas(int usuarioId)
    {
        if (usuarioId != User.ObterUsuarioId())
        {
            return Forbid();
        }

        var solicitacoes = await _db.Solicitacoes
            .AsNoTracking()
            .Include(s => s.Servico)
            .ThenInclude(servico => servico.Universidade)
            .Where(s => s.UsuarioId == usuarioId)
            .OrderByDescending(s => s.CriadaEm)
            .ThenByDescending(s => s.Id)
            .ToListAsync();

        // Formato: [{ id, status, criadaEm, atualizadaEm, atendidaEm: "AAAA-MM-DD"|null,
        //   servico: { id, nome }, universidade: { id, nome } }]
        var resposta = solicitacoes.Select(s => new
        {
            id = s.Id,
            status = s.Status,
            criadaEm = Datas.FormatarDia(s.CriadaEm),
            atualizadaEm = Datas.FormatarDia(s.AtualizadaEm),
            atendidaEm = Datas.FormatarDia(s.AtendidaEm),
            servico = new { id = s.Servico.Id, nome = s.Servico.Nome },
            universidade = new { id = s.Servico.Universidade.Id, nome = s.Servico.Universidade.Nome },
        });

        return Ok(resposta);
    }

    [HttpGet("usuarios/{usuarioId}/atendimentos-do-mes")]
    public async Task<IActionResult> AtendimentosDoMes(int usuarioId)
    {
        if (usuarioId != User.ObterUsuarioId())
        {
            return Forbid();
        }

        var usados = await _solicitacoes.ContarAtendimentosDoMes(usuarioId);

        // Formato: { usados: 2 }
        return Ok(new { usados });
    }

    // Sem solicitação aberta, a resposta é vazia (204), que o front lê como null
    [HttpGet("usuarios/{usuarioId}/solicitacao-aberta")]
    public async Task<IActionResult> SolicitacaoAberta(int usuarioId, [FromQuery] int servicoId)
    {
        if (usuarioId != User.ObterUsuarioId())
        {
            return Forbid();
        }

        var aberta = await _solicitacoes.BuscarAberta(usuarioId, servicoId);
        if (aberta == null)
        {
            return NoContent();
        }

        // Formato: { id, status: "Enviada"|"Em contato", criadaEm: "AAAA-MM-DD" }
        return Ok(new
        {
            id = aberta.Id,
            status = aberta.Status,
            criadaEm = Datas.FormatarDia(aberta.CriadaEm),
        });
    }

    // O usuário vem do token, nunca do corpo do pedido
    [HttpPost("solicitacoes")]
    public async Task<IActionResult> Criar(SolicitacaoRequisicao dados)
    {
        var resultado = await _solicitacoes.Criar(User.ObterUsuarioId(), dados);
        return StatusCode(resultado.Status, resultado.Corpo);
    }

    [HttpPatch("solicitacoes/{id}/cancelar")]
    public async Task<IActionResult> Cancelar(int id)
    {
        var resultado = await _solicitacoes.Cancelar(User.ObterUsuarioId(), id);
        return StatusCode(resultado.Status, resultado.Corpo);
    }
}
