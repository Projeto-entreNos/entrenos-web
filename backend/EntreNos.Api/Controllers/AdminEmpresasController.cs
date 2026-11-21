using EntreNos.Api.Dtos;
using EntreNos.Api.Models;
using EntreNos.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EntreNos.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "admin")]
public class AdminEmpresasController : ControllerBase
{
    private readonly EntreNosContext _db;
    private readonly AdminEmpresasService _empresas;

    public AdminEmpresasController(EntreNosContext db, AdminEmpresasService empresas)
    {
        _db = db;
        _empresas = empresas;
    }

    [HttpGet("empresas")]
    public async Task<IActionResult> Listar()
    {
        return Ok(await _empresas.Listar());
    }

    [HttpPost("empresas")]
    public async Task<IActionResult> Criar(EmpresaRequisicao dados)
    {
        var resultado = await _empresas.Criar(dados);
        return StatusCode(resultado.Status, resultado.Corpo);
    }

    [HttpPut("empresas/{id}")]
    public async Task<IActionResult> Editar(int id, EmpresaRequisicao dados)
    {
        var resultado = await _empresas.Editar(id, dados);
        return StatusCode(resultado.Status, resultado.Corpo);
    }

    [HttpPost("empresas/{id}/status")]
    public async Task<IActionResult> AlterarStatus(int id, StatusContratoRequisicao dados)
    {
        var resultado = await _empresas.AlterarStatus(id, dados.StatusContrato);
        return StatusCode(resultado.Status, resultado.Corpo);
    }

    // Formato: [ { id: "essencial", nome: "Essencial", precoPorColaborador: 29 } ]
    [HttpGet("pacotes")]
    public async Task<IActionResult> Pacotes()
    {
        var pacotes = await _db.Pacotes
            .AsNoTracking()
            .OrderBy(p => p.PrecoPorColaborador)
            .Select(p => new { id = p.Codigo, nome = p.Nome, precoPorColaborador = p.PrecoPorColaborador })
            .ToListAsync();

        return Ok(pacotes);
    }
}
