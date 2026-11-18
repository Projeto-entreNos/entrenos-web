using EntreNos.Api.Dtos;
using EntreNos.Api.Models;
using EntreNos.Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EntreNos.Api.Controllers;

[ApiController]
[Route("api/propostas")]
public class PropostasController : ControllerBase
{
    private readonly EntreNosContext _db;

    public PropostasController(EntreNosContext db)
    {
        _db = db;
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Enviar(PropostaRequisicao dados)
    {
        var erros = Validar(dados);
        if (erros.Count > 0)
        {
            // Formato: { mensagem, erros: { campo: "texto do erro" } }
            return BadRequest(new { mensagem = "Confira os campos destacados.", erros });
        }

        var mensagem = dados.Mensagem?.Trim();
        var proposta = new Proposta
        {
            Nome = dados.Nome!.Trim(),
            Empresa = dados.Empresa!.Trim(),
            Email = dados.Email!.Trim().ToLower(),
            NumeroColaboradores = dados.NumeroColaboradores!.Value,
            Mensagem = string.IsNullOrEmpty(mensagem) ? null : mensagem,
            AceitePrivacidade = true,
        };
        _db.Propostas.Add(proposta);
        await _db.SaveChangesAsync();

        // Formato (201): { id, mensagem }
        return StatusCode(201, new
        {
            id = proposta.Id,
            mensagem = "Recebemos o seu pedido. Nosso time entra em contato.",
        });
    }

    // Os limites de tamanho são os das colunas da tabela Propostas
    private static Dictionary<string, string> Validar(PropostaRequisicao dados)
    {
        var erros = new Dictionary<string, string>();

        if (string.IsNullOrWhiteSpace(dados.Nome))
        {
            erros["nome"] = "Informe seu nome.";
        }
        else if (dados.Nome.Trim().Length > 120)
        {
            erros["nome"] = "Use até 120 caracteres.";
        }

        if (string.IsNullOrWhiteSpace(dados.Empresa))
        {
            erros["empresa"] = "Informe o nome da empresa.";
        }
        else if (dados.Empresa.Trim().Length > 150)
        {
            erros["empresa"] = "Use até 150 caracteres.";
        }

        if (string.IsNullOrWhiteSpace(dados.Email))
        {
            erros["email"] = "Informe seu e-mail.";
        }
        else if (!Validacao.EmailValido(dados.Email) || dados.Email.Trim().Length > 254)
        {
            erros["email"] = "Digite um e-mail válido, como voce@empresa.com.br.";
        }

        if (dados.NumeroColaboradores == null)
        {
            erros["numeroColaboradores"] = "Informe quantos colaboradores.";
        }
        else if (dados.NumeroColaboradores < 1)
        {
            erros["numeroColaboradores"] = "Use um número inteiro, a partir de 1.";
        }

        if (dados.Mensagem != null && dados.Mensagem.Trim().Length > 1000)
        {
            erros["mensagem"] = "Use até 1000 caracteres.";
        }

        if (!dados.AceitouPrivacidade)
        {
            erros["aceitouPrivacidade"] = "Aceite a Política de Privacidade para continuar.";
        }

        return erros;
    }
}
