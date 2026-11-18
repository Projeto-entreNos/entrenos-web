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
public class AdminServicosController : ControllerBase
{
    private readonly EntreNosContext _db;
    private readonly AdminServicosService _servicos;

    public AdminServicosController(EntreNosContext db, AdminServicosService servicos)
    {
        _db = db;
        _servicos = servicos;
    }

    // Todos os serviços do catálogo, em todos os status
    [HttpGet("servicos")]
    public async Task<IActionResult> Listar()
    {
        return Ok(await _servicos.Listar());
    }

    [HttpPost("servicos")]
    public async Task<IActionResult> Criar(ServicoRequisicao dados)
    {
        var resultado = await _servicos.Criar(dados);
        return StatusCode(resultado.Status, resultado.Corpo);
    }

    [HttpPut("servicos/{id}")]
    public async Task<IActionResult> Editar(int id, ServicoRequisicao dados)
    {
        var resultado = await _servicos.Editar(id, dados);
        return StatusCode(resultado.Status, resultado.Corpo);
    }

    // As universidades são cadastradas pela equipe direto no banco
    // Formato: [ { id, nome } ]
    [HttpGet("universidades")]
    public async Task<IActionResult> Universidades()
    {
        var universidades = await _db.Universidades
            .AsNoTracking()
            .OrderBy(u => u.Nome)
            .Select(u => new { id = u.Id, nome = u.Nome })
            .ToListAsync();

        return Ok(universidades);
    }
}
