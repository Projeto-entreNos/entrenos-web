using EntreNos.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EntreNos.Api.Controllers;

[ApiController]
[Route("api/pacotes")]
public class PacotesController : ControllerBase
{
    private readonly EntreNosContext _db;

    public PacotesController(EntreNosContext db)
    {
        _db = db;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> Listar()
    {
        // 1. Busca do banco (a coluna Beneficios vem como um texto só)
        var pacotes = await _db.Pacotes
            .AsNoTracking()
            .OrderBy(p => p.PrecoPorColaborador)
            .ToListAsync();

        // 2. Monta a resposta na memória, separando os benefícios por linha
        var resposta = pacotes.Select(p => new
        {
            id = p.Codigo,
            nome = p.Nome,
            descricao = p.Descricao,
            precoPorColaborador = p.PrecoPorColaborador,
            limiteAtendimentosMes = p.LimiteAtendimentosMes,
            beneficios = p.Beneficios
                .Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .ToList()
        });

        return Ok(resposta);
    }
}