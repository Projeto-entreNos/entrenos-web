using EntreNos.Api.Dtos;
using EntreNos.Api.Models;
using EntreNos.Api.Utils;
using Microsoft.EntityFrameworkCore;

namespace EntreNos.Api.Services;

public class SolicitacoesService
{
    private const int LimiteMensagem = 300;

    private static readonly string[] StatusAbertos = { "Enviada", "Em contato" };

    private readonly EntreNosContext _db;
    private readonly IEnvioEmail _email;

    public SolicitacoesService(EntreNosContext db, IEnvioEmail email)
    {
        _db = db;
        _email = email;
    }

    // Contam as solicitações criadas no mês atual (horário de Brasília), menos as canceladas.
    // O limite renova no dia 1º.
    public async Task<int> ContarAtendimentosDoMes(int usuarioId)
    {
        var inicioDoMes = Datas.InicioDoMesEmUtc();
        return await _db.Solicitacoes.CountAsync(s =>
            s.UsuarioId == usuarioId &&
            s.CriadaEm >= inicioDoMes &&
            s.Status != "Cancelada");
    }

    public async Task<Solicitacao?> BuscarAberta(int usuarioId, int servicoId)
    {
        return await _db.Solicitacoes
            .AsNoTracking()
            .FirstOrDefaultAsync(s =>
                s.UsuarioId == usuarioId &&
                s.ServicoId == servicoId &&
                StatusAbertos.Contains(s.Status));
    }

    public async Task<Resultado> Criar(int usuarioId, SolicitacaoRequisicao dados)
    {
        if (dados.ServicoId == null)
        {
            return Resultado.Erro(400, "Escolha um serviço.");
        }

        var mensagem = dados.Mensagem?.Trim() ?? "";
        if (mensagem.Length > LimiteMensagem)
        {
            return Resultado.Erro(400, $"A mensagem pode ter no máximo {LimiteMensagem} caracteres.");
        }

        var usuario = await _db.Usuarios
            .Include(u => u.Empresa)
            .ThenInclude(e => e!.Pacote)
            .FirstOrDefaultAsync(u => u.Id == usuarioId);

        // O token pode continuar válido por algumas horas depois que a empresa remove a pessoa
        if (usuario == null || usuario.RemovidoEm != null || usuario.Empresa == null)
        {
            return Resultado.Erro(403, "Você não tem permissão para acessar isto.");
        }

        var empresa = usuario.Empresa;
        if (empresa.StatusContrato != "Ativo")
        {
            return Resultado.Erro(409, "O contrato da sua empresa não está ativo. Fale com o RH.");
        }

        // Só serviços Ativos e do pacote da empresa podem ser solicitados
        var servico = await _db.Servicos
            .Include(s => s.Universidade)
            .FirstOrDefaultAsync(s => s.Id == dados.ServicoId && s.Pacotes.Any(p => p.Id == empresa.PacoteId));
        if (servico == null || servico.Status != "Ativo")
        {
            return Resultado.Erro(409, "Este serviço não está disponível para solicitação.");
        }

        if (await BuscarAberta(usuarioId, servico.Id) != null)
        {
            return Resultado.Erro(409, "Você já tem uma solicitação em aberto para este serviço.");
        }

        var usados = await ContarAtendimentosDoMes(usuarioId);
        if (usados >= empresa.Pacote.LimiteAtendimentosMes)
        {
            return Resultado.Erro(409, "Você atingiu o limite de atendimentos deste mês.");
        }

        var agora = DateTime.UtcNow;
        var solicitacao = new Solicitacao
        {
            UsuarioId = usuarioId,
            ServicoId = servico.Id,
            Mensagem = mensagem == "" ? null : mensagem,
            Status = "Enviada",
            CriadaEm = agora,
            AtualizadaEm = agora,
        };
        _db.Solicitacoes.Add(solicitacao);

        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            // O índice UX_Solicitacoes_AbertaPorServico barra dois pedidos abertos enviados ao mesmo tempo
            return Resultado.Erro(409, "Você já tem uma solicitação em aberto para este serviço.");
        }

        // LGPD: a mensagem do colaborador vai só para a universidade, neste e-mail
        await _email.Enviar(
            servico.Universidade.EmailContato,
            $"EntreNós: nova solicitação de {servico.Nome}",
            MontarEmailUniversidade(usuario, empresa, servico, mensagem));

        // Formato: { id, status: "Enviada", criadaEm: "AAAA-MM-DD" }
        return Resultado.Sucesso(201, new
        {
            id = solicitacao.Id,
            status = solicitacao.Status,
            criadaEm = Datas.FormatarDia(solicitacao.CriadaEm),
        });
    }

    // Só o próprio colaborador cancela, e só enquanto está "Enviada"
    public async Task<Resultado> Cancelar(int usuarioId, int solicitacaoId)
    {
        var solicitacao = await _db.Solicitacoes
            .FirstOrDefaultAsync(s => s.Id == solicitacaoId && s.UsuarioId == usuarioId);

        // Pedido de outra pessoa responde igual a pedido inexistente
        if (solicitacao == null)
        {
            return Resultado.Erro(404, "Solicitação não encontrada.");
        }

        if (solicitacao.Status != "Enviada")
        {
            return Resultado.Erro(409, "Esta solicitação não pode mais ser cancelada.");
        }

        solicitacao.Status = "Cancelada";
        solicitacao.AtualizadaEm = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        // Formato: { id, status: "Cancelada", atualizadaEm: "AAAA-MM-DD" }
        return Resultado.Sucesso(200, new
        {
            id = solicitacao.Id,
            status = solicitacao.Status,
            atualizadaEm = Datas.FormatarDia(solicitacao.AtualizadaEm),
        });
    }

    private static string MontarEmailUniversidade(Usuario usuario, Empresa empresa, Servico servico, string mensagem)
    {
        var textoMensagem = mensagem == "" ? "(o colaborador não escreveu mensagem)" : mensagem;
        return
            $"Serviço: {servico.Nome}\n" +
            $"Colaborador: {usuario.Nome}\n" +
            $"E-mail: {usuario.Email}\n" +
            $"Empresa: {empresa.Nome}\n\n" +
            $"Mensagem:\n{textoMensagem}\n\n" +
            "Entre em contato com o colaborador pelo e-mail acima.";
    }
}
