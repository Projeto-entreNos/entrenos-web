using EntreNos.Api.Auth;
using EntreNos.Api.Models;
using EntreNos.Api.Services;
using EntreNos.Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EntreNos.Api.Controllers;

[ApiController]
[Route("api/empresas")]
public class EmpresasController : ControllerBase
{
    private readonly EntreNosContext _db;
    private readonly ColaboradoresService _colaboradores;

    public EmpresasController(EntreNosContext db, ColaboradoresService colaboradores)
    {
        _db = db;
        _colaboradores = colaboradores;
    }

    // O colaborador também vê a própria empresa (contrato e pacote)
    [HttpGet("{empresaId}")]
    [Authorize(Roles = "empresa,colaborador")]
    public async Task<IActionResult> Buscar(int empresaId)
    {
        if (empresaId != User.ObterEmpresaId())
        {
            return Forbid();
        }

        var empresa = await _db.Empresas
            .AsNoTracking()
            .Include(e => e.Pacote)
            .FirstOrDefaultAsync(e => e.Id == empresaId);
        if (empresa == null)
        {
            return NotFound(new { mensagem = "Não encontramos a sua empresa." });
        }

        // Formato: { id, nome, dominio, statusContrato,
        //   pacote: { id, nome, precoPorColaborador, limiteAtendimentosMes },
        //   vagasContratadas, vagasOcupadas, vigenciaInicio, vigenciaFim }
        // O id do pacote é o código ("essencial", "completo"), como no GET /api/pacotes
        return Ok(new
        {
            id = empresa.Id,
            nome = empresa.Nome,
            dominio = empresa.DominioEmail,
            statusContrato = empresa.StatusContrato,
            pacote = new
            {
                id = empresa.Pacote.Codigo,
                nome = empresa.Pacote.Nome,
                precoPorColaborador = empresa.Pacote.PrecoPorColaborador,
                limiteAtendimentosMes = empresa.Pacote.LimiteAtendimentosMes,
            },
            vagasContratadas = empresa.VagasContratadas,
            vagasOcupadas = await _colaboradores.ContarVagasOcupadas(empresaId),
            vigenciaInicio = Datas.FormatarDia(empresa.VigenciaInicio),
            vigenciaFim = Datas.FormatarDia(empresa.VigenciaFim),
        });
    }
}
