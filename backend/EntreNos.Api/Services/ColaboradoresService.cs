using System.Security.Cryptography;
using EntreNos.Api.Dtos;
using EntreNos.Api.Models;
using EntreNos.Api.Utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EntreNos.Api.Services;

public class ColaboradoresService
{
    private const int DiasValidadeConvite = 7;

    private static readonly string[] StatusAbertos = { "Enviada", "Em contato" };

    private readonly EntreNosContext _db;
    private readonly IEnvioEmail _email;
    private readonly IPasswordHasher<Usuario> _hasher;
    private readonly string _urlFront;

    public ColaboradoresService(EntreNosContext db, IEnvioEmail email, IPasswordHasher<Usuario> hasher, IConfiguration config)
    {
        _db = db;
        _email = email;
        _hasher = hasher;
        _urlFront = config["UrlFront"] ?? "";
    }

    // "Convite expirado" não fica no banco: é um Convidado cujo convite foi enviado há mais de 7 dias
    // (dias contados no horário de Brasília)
    public static string StatusDoColaborador(Usuario usuario)
    {
        if (usuario.Status == "Ativo")
        {
            return "Ativo";
        }
        if (usuario.ConviteEnviadoEm == null)
        {
            return "Convite expirado";
        }

        var vencimento = Datas.DiaEmBrasilia(usuario.ConviteEnviadoEm.Value).AddDays(DiasValidadeConvite);
        if (vencimento < Datas.HojeEmBrasilia())
        {
            return "Convite expirado";
        }
        return "Convidado";
    }

    // Formato: { id, nome, email, status: "Convidado"|"Ativo"|"Convite expirado", conviteEnviadoEm: "AAAA-MM-DD" }
    public static object ParaResposta(Usuario usuario)
    {
        return new
        {
            id = usuario.Id,
            nome = usuario.Nome,
            email = usuario.Email,
            status = StatusDoColaborador(usuario),
            conviteEnviadoEm = Datas.FormatarDia(usuario.ConviteEnviadoEm),
        };
    }

    // Cada colaborador não removido ocupa uma vaga, qualquer que seja o status
    public async Task<int> ContarVagasOcupadas(int empresaId)
    {
        return await _db.Usuarios.CountAsync(u =>
            u.EmpresaId == empresaId &&
            u.Perfil == "colaborador" &&
            u.RemovidoEm == null);
    }

    public async Task<Resultado> Convidar(int empresaId, ConvitesRequisicao dados)
    {
        var empresa = await _db.Empresas.FirstOrDefaultAsync(e => e.Id == empresaId);
        if (empresa == null)
        {
            return Resultado.Erro(404, "Não encontramos a sua empresa.");
        }
        if (empresa.StatusContrato != "Ativo")
        {
            return Resultado.Erro(409, "Os convites só ficam liberados com o contrato ativo.");
        }
        if (dados.Convites == null || dados.Convites.Count == 0)
        {
            return Resultado.Erro(400, "Informe pelo menos um e-mail.");
        }

        var emailsDaLista = dados.Convites
            .Select(c => (c.Email ?? "").Trim().ToLower())
            .ToList();

        // O e-mail não pode se repetir entre os usuários não removidos, de qualquer empresa
        var jaCadastrados = await _db.Usuarios
            .Where(u => u.RemovidoEm == null && emailsDaLista.Contains(u.Email))
            .Select(u => new { u.Email, u.EmpresaId })
            .ToListAsync();

        var novos = new List<Usuario>();
        var ignorados = new List<object>();
        var agora = DateTime.UtcNow;

        foreach (var convite in dados.Convites)
        {
            var email = (convite.Email ?? "").Trim().ToLower();
            var nome = (convite.Nome ?? "").Trim();
            var cadastrado = jaCadastrados.FirstOrDefault(u => u.Email == email);

            if (!Validacao.EmailValido(email) || email.Length > 254)
            {
                ignorados.Add(new { email, motivo = "E-mail inválido." });
            }
            else if (novos.Any(n => n.Email == email) || (cadastrado != null && cadastrado.EmpresaId == empresaId))
            {
                ignorados.Add(new { email, motivo = "Este e-mail já está na empresa." });
            }
            else if (cadastrado != null)
            {
                // Não revela à empresa que a pessoa tem conta em outra empresa
                ignorados.Add(new { email, motivo = "Este e-mail não pode ser convidado." });
            }
            else if (nome.Length > 120)
            {
                ignorados.Add(new { email, motivo = "Use um nome com até 120 caracteres." });
            }
            else
            {
                novos.Add(new Usuario
                {
                    Nome = nome,
                    Email = email,
                    Perfil = "colaborador",
                    EmpresaId = empresaId,
                    Status = "Convidado",
                    TokenConvite = GerarTokenConvite(),
                    ConviteEnviadoEm = agora,
                    CriadoEm = agora,
                });
            }
        }

        var ocupadas = await ContarVagasOcupadas(empresaId);
        if (ocupadas + novos.Count > empresa.VagasContratadas)
        {
            return Resultado.Erro(409, "Vagas insuficientes.");
        }

        _db.Usuarios.AddRange(novos);
        await _db.SaveChangesAsync();

        foreach (var novo in novos)
        {
            await EnviarConvite(novo, empresa);
        }

        // Formato: { convidados: [ { id, nome, email, status, conviteEnviadoEm } ], ignorados: [ { email, motivo } ] }
        return Resultado.Sucesso(200, new
        {
            convidados = novos.Select(ParaResposta),
            ignorados,
        });
    }

    // Novo token e nova data: o convite vale mais 7 dias e o link antigo deixa de funcionar
    public async Task<Resultado> ReenviarConvite(int empresaId, int colaboradorId)
    {
        var colaborador = await BuscarColaboradorDaEmpresa(empresaId, colaboradorId);
        if (colaborador == null)
        {
            return Resultado.Erro(404, "Colaborador não encontrado.");
        }
        if (colaborador.Status == "Ativo")
        {
            return Resultado.Erro(409, "Esta pessoa já ativou a conta.");
        }
        if (colaborador.Empresa!.StatusContrato != "Ativo")
        {
            return Resultado.Erro(409, "Os convites só ficam liberados com o contrato ativo.");
        }

        colaborador.TokenConvite = GerarTokenConvite();
        colaborador.ConviteEnviadoEm = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        await EnviarConvite(colaborador, colaborador.Empresa);

        return Resultado.Sucesso(200, ParaResposta(colaborador));
    }

    // Remover libera a vaga e cancela as solicitações em aberto da pessoa.
    // A linha continua no banco (RemovidoEm preenchido) para manter o histórico.
    public async Task<Resultado> Remover(int empresaId, int colaboradorId)
    {
        var colaborador = await BuscarColaboradorDaEmpresa(empresaId, colaboradorId);
        if (colaborador == null)
        {
            return Resultado.Erro(404, "Colaborador não encontrado.");
        }

        var agora = DateTime.UtcNow;
        colaborador.RemovidoEm = agora;
        colaborador.TokenConvite = null;

        var abertas = await _db.Solicitacoes
            .Where(s => s.UsuarioId == colaborador.Id && StatusAbertos.Contains(s.Status))
            .ToListAsync();
        foreach (var solicitacao in abertas)
        {
            solicitacao.Status = "Cancelada";
            solicitacao.AtualizadaEm = agora;
        }

        await _db.SaveChangesAsync();

        // Formato: { vagasOcupadas: 6, solicitacoesCanceladas: 1 }
        return Resultado.Sucesso(200, new
        {
            vagasOcupadas = await ContarVagasOcupadas(empresaId),
            solicitacoesCanceladas = abertas.Count,
        });
    }

    // Token inexistente, já usado ou vencido: todos respondem do mesmo jeito
    public async Task<object> BuscarConvite(string token)
    {
        var colaborador = await BuscarPeloToken(token);
        if (colaborador == null || StatusDoColaborador(colaborador) != "Convidado")
        {
            return new { nome = (string?)null, email = (string?)null, empresa = (string?)null, status = "Convite expirado" };
        }

        // Formato: { nome, email, empresa: "Nome da empresa", status: "Convidado" }
        return new
        {
            nome = colaborador.Nome,
            email = colaborador.Email,
            empresa = colaborador.Empresa!.Nome,
            status = "Convidado",
        };
    }

    // A ativação registra o aceite dos termos (LGPD) e apaga o token: o link só vale uma vez
    public async Task<Resultado> AtivarConta(AtivarContaRequisicao dados)
    {
        if (!dados.AceitouTermos)
        {
            return Resultado.Erro(400, "Aceite os termos para continuar.");
        }
        if (!Validacao.SenhaValida(dados.Senha))
        {
            return Resultado.Erro(400, "A senha precisa ter pelo menos 8 caracteres, com letras e números.");
        }

        var colaborador = await BuscarPeloToken(dados.Token);
        if (colaborador == null || StatusDoColaborador(colaborador) != "Convidado")
        {
            return Resultado.Erro(410, "Este convite expirou.");
        }

        var agora = DateTime.UtcNow;
        colaborador.SenhaHash = _hasher.HashPassword(colaborador, dados.Senha!);
        colaborador.Status = "Ativo";
        colaborador.AtivadoEm = agora;
        colaborador.TermosAceitosEm = agora;
        colaborador.TokenConvite = null;
        await _db.SaveChangesAsync();

        return Resultado.Sucesso(200, new { mensagem = "Conta ativada." });
    }

    private async Task<Usuario?> BuscarColaboradorDaEmpresa(int empresaId, int colaboradorId)
    {
        return await _db.Usuarios
            .Include(u => u.Empresa)
            .FirstOrDefaultAsync(u =>
                u.Id == colaboradorId &&
                u.EmpresaId == empresaId &&
                u.Perfil == "colaborador" &&
                u.RemovidoEm == null);
    }

    private async Task<Usuario?> BuscarPeloToken(string? token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return null;
        }
        return await _db.Usuarios
            .Include(u => u.Empresa)
            .FirstOrDefaultAsync(u => u.TokenConvite == token && u.RemovidoEm == null);
    }

    // 32 bytes aleatórios em hexadecimal: impossível de adivinhar
    private static string GerarTokenConvite()
    {
        return Convert.ToHexString(RandomNumberGenerator.GetBytes(32)).ToLower();
    }

    private async Task EnviarConvite(Usuario colaborador, Empresa empresa)
    {
        var saudacao = colaborador.Nome == "" ? "Olá!" : $"Olá, {colaborador.Nome}!";
        var link = $"{_urlFront}/ativar/{colaborador.TokenConvite}";
        var corpo =
            $"{saudacao}\n\n" +
            $"A {empresa.Nome} oferece os serviços do EntreNós como benefício para você.\n" +
            $"Ative sua conta em até {DiasValidadeConvite} dias pelo link:\n{link}";

        await _email.Enviar(colaborador.Email, "Seu convite para o EntreNós", corpo);
    }
}
