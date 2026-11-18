using EntreNos.Api.Auth;
using EntreNos.Api.Dtos;
using EntreNos.Api.Models;
using EntreNos.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EntreNos.Api.Controllers;

[ApiController]
[Route("api")]
[Authorize(Roles = "empresa")]
public class ColaboradoresController : ControllerBase
{
    private readonly EntreNosContext _db;
    private readonly ColaboradoresService _colaboradores;

    public ColaboradoresController(EntreNosContext db, ColaboradoresService colaboradores)
    {
        _db = db;
        _colaboradores = colaboradores;
    }

    // Do convite mais recente para o mais antigo, sem os removidos
    [HttpGet("empresas/{empresaId}/colaboradores")]
    public async Task<IActionResult> Listar(int empresaId)
    {
        if (empresaId != User.ObterEmpresaId())
        {
            return Forbid();
        }

        var colaboradores = await _db.Usuarios
            .AsNoTracking()
            .Where(u => u.EmpresaId == empresaId && u.Perfil == "colaborador" && u.RemovidoEm == null)
            .OrderByDescending(u => u.ConviteEnviadoEm)
            .ThenByDescending(u => u.Id)
            .ToListAsync();

        // Formato: [ { id, nome, email, status, conviteEnviadoEm } ]
        return Ok(colaboradores.Select(ColaboradoresService.ParaResposta));
    }

    [HttpPost("empresas/{empresaId}/convites")]
    public async Task<IActionResult> Convidar(int empresaId, ConvitesRequisicao dados)
    {
        if (empresaId != User.ObterEmpresaId())
        {
            return Forbid();
        }

        var resultado = await _colaboradores.Convidar(empresaId, dados);
        return StatusCode(resultado.Status, resultado.Corpo);
    }

    // Colaborador de outra empresa responde igual a colaborador inexistente (404)
    [HttpPost("colaboradores/{id}/reenviar-convite")]
    public async Task<IActionResult> ReenviarConvite(int id)
    {
        var resultado = await _colaboradores.ReenviarConvite(User.ObterEmpresaId()!.Value, id);
        return StatusCode(resultado.Status, resultado.Corpo);
    }

    [HttpDelete("colaboradores/{id}")]
    public async Task<IActionResult> Remover(int id)
    {
        var resultado = await _colaboradores.Remover(User.ObterEmpresaId()!.Value, id);
        return StatusCode(resultado.Status, resultado.Corpo);
    }
}
