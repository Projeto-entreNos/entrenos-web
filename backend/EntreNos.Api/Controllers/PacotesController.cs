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
        // A coluna Beneficios vem do banco como um texto só, com um benefício por linha
        var pacotes = await _db.Pacotes
            .AsNoTracking()
            .OrderBy(p => p.PrecoPorColaborador)
            .ToListAsync();

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