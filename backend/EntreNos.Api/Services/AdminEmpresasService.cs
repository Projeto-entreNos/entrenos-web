using EntreNos.Api.Dtos;
using EntreNos.Api.Models;
using EntreNos.Api.Utils;
using Microsoft.EntityFrameworkCore;

namespace EntreNos.Api.Services;

public class AdminEmpresasService
{
    public static readonly string[] StatusContrato = { "Proposta enviada", "Aguardando pagamento", "Ativo", "Encerrado" };

    private readonly EntreNosContext _db;
    private readonly ColaboradoresService _colaboradores;

    public AdminEmpresasService(EntreNosContext db, ColaboradoresService colaboradores)
    {
        _db = db;
        _colaboradores = colaboradores;
    }

    // Formato: { id, nome, cnpj, responsavel, emailResponsavel, statusContrato, pacote: { id, nome },
    //   vagasContratadas, vagasOcupadas, vigenciaInicio, vigenciaFim }
    public static object ParaResposta(Empresa empresa, int vagasOcupadas)
    {
        return new
        {
            id = empresa.Id,
            nome = empresa.Nome,
            cnpj = empresa.Cnpj,
            responsavel = empresa.Responsavel,
            emailResponsavel = empresa.EmailResponsavel,
            statusContrato = empresa.StatusContrato,
            pacote = new { id = empresa.Pacote.Codigo, nome = empresa.Pacote.Nome },
            vagasContratadas = empresa.VagasContratadas,
            vagasOcupadas,
            vigenciaInicio = Datas.FormatarDia(empresa.VigenciaInicio),
            vigenciaFim = Datas.FormatarDia(empresa.VigenciaFim),
        };
    }

    public async Task<List<object>> Listar()
    {
        var empresas = await _db.Empresas
            .AsNoTracking()
            .Include(e => e.Pacote)
            .OrderBy(e => e.Id)
            .ToListAsync();

        var resposta = new List<object>();
        foreach (var empresa in empresas)
        {
            resposta.Add(ParaResposta(empresa, await _colaboradores.ContarVagasOcupadas(empresa.Id)));
        }
        return resposta;
    }

    public async Task<Resultado> Criar(EmpresaRequisicao dados)
    {
        var erro = Validar(dados);
        if (erro != null)
        {
            return Resultado.Erro(400, erro);
        }

        var cnpj = FormatarCnpj(dados.Cnpj!);
        if (await _db.Empresas.AnyAsync(e => e.Cnpj == cnpj))
        {
            return Resultado.Erro(409, "Já existe uma empresa com este CNPJ.");
        }

        var pacote = await _db.Pacotes.FirstOrDefaultAsync(p => p.Codigo == dados.PacoteId);
        if (pacote == null)
        {
            return Resultado.Erro(400, "Pacote não encontrado.");
        }

        var email = dados.EmailResponsavel!.Trim().ToLower();
        var empresa = new Empresa
        {
            Cnpj = cnpj,
            // O domínio é usado no aviso de e-mail de fora da empresa, na tela de convites
            DominioEmail = email.Split('@')[1],
            CriadaEm = DateTime.UtcNow,
        };
        CopiarCampos(dados, empresa, pacote);

        _db.Empresas.Add(empresa);
        await _db.SaveChangesAsync();

        return Resultado.Sucesso(201, ParaResposta(empresa, 0));
    }

    public async Task<Resultado> Editar(int id, EmpresaRequisicao dados)
    {
        var empresa = await _db.Empresas.Include(e => e.Pacote).FirstOrDefaultAsync(e => e.Id == id);
        if (empresa == null)
        {
            return Resultado.Erro(404, "Empresa não encontrada.");
        }

        var erro = Validar(dados);
        if (erro != null)
        {
            return Resultado.Erro(400, erro);
        }

        var cnpj = FormatarCnpj(dados.Cnpj!);
        if (await _db.Empresas.AnyAsync(e => e.Cnpj == cnpj && e.Id != id))
        {
            return Resultado.Erro(409, "Já existe uma empresa com este CNPJ.");
        }

        var pacote = await _db.Pacotes.FirstOrDefaultAsync(p => p.Codigo == dados.PacoteId);
        if (pacote == null)
        {
            return Resultado.Erro(400, "Pacote não encontrado.");
        }

        // Não dá para contratar menos vagas do que as já ocupadas
        var ocupadas = await _colaboradores.ContarVagasOcupadas(id);
        if (dados.VagasContratadas < ocupadas)
        {
            var texto = ocupadas == 1 ? "vaga ocupada" : "vagas ocupadas";
            return Resultado.Erro(409, $"A empresa já tem {ocupadas} {texto}. Informe pelo menos {ocupadas}.");
        }

        empresa.Cnpj = cnpj;
        CopiarCampos(dados, empresa, pacote);
        await _db.SaveChangesAsync();

        return Resultado.Sucesso(200, ParaResposta(empresa, ocupadas));
    }

    // O contrato e o pagamento acontecem fora do sistema: o admin só registra o resultado
    public async Task<Resultado> AlterarStatus(int id, string? statusContrato)
    {
        var empresa = await _db.Empresas.FirstOrDefaultAsync(e => e.Id == id);
        if (empresa == null)
        {
            return Resultado.Erro(404, "Empresa não encontrada.");
        }
        if (statusContrato == null || !StatusContrato.Contains(statusContrato))
        {
            return Resultado.Erro(400, "Status do contrato inválido.");
        }

        empresa.StatusContrato = statusContrato;
        await _db.SaveChangesAsync();

        // Formato: { id, statusContrato }
        return Resultado.Sucesso(200, new { id = empresa.Id, statusContrato = empresa.StatusContrato });
    }

    private static void CopiarCampos(EmpresaRequisicao dados, Empresa empresa, Pacote pacote)
    {
        empresa.Nome = dados.Nome!.Trim();
        empresa.Responsavel = dados.Responsavel!.Trim();
        empresa.EmailResponsavel = dados.EmailResponsavel!.Trim().ToLower();
        empresa.Pacote = pacote;
        empresa.PacoteId = pacote.Id;
        empresa.VagasContratadas = dados.VagasContratadas!.Value;
        empresa.VigenciaInicio = dados.VigenciaInicio!.Value;
        empresa.VigenciaFim = dados.VigenciaFim!.Value;
        empresa.StatusContrato = dados.StatusContrato!;
    }

    // Devolve o texto do primeiro erro, ou null se estiver tudo certo
    private static string? Validar(EmpresaRequisicao dados)
    {
        if (string.IsNullOrWhiteSpace(dados.Nome) || dados.Nome.Trim().Length > 150)
        {
            return "Informe o nome da empresa, com até 150 caracteres.";
        }
        if (SomenteNumeros(dados.Cnpj).Length != 14)
        {
            return "Informe o CNPJ com 14 números.";
        }
        if (string.IsNullOrWhiteSpace(dados.Responsavel) || dados.Responsavel.Trim().Length > 120)
        {
            return "Informe o nome do responsável, com até 120 caracteres.";
        }
        if (!Validacao.EmailValido(dados.EmailResponsavel) || dados.EmailResponsavel!.Trim().Length > 254)
        {
            return "Digite um e-mail válido, como voce@empresa.com.br.";
        }
        if (string.IsNullOrWhiteSpace(dados.PacoteId))
        {
            return "Selecione o pacote.";
        }
        if (dados.VagasContratadas == null || dados.VagasContratadas < 1)
        {
            return "Informe as vagas contratadas, a partir de 1.";
        }
        if (dados.VigenciaInicio == null || dados.VigenciaFim == null)
        {
            return "Informe o início e o fim da vigência.";
        }
        if (dados.VigenciaFim <= dados.VigenciaInicio)
        {
            return "O fim da vigência precisa ser depois do início.";
        }
        if (dados.StatusContrato == null || !StatusContrato.Contains(dados.StatusContrato))
        {
            return "Status do contrato inválido.";
        }
        return null;
    }

    private static string SomenteNumeros(string? texto)
    {
        return new string((texto ?? "").Where(char.IsDigit).ToArray());
    }

    // Guarda sempre no formato 00.000.000/0000-00, para a conferência de CNPJ repetido funcionar
    private static string FormatarCnpj(string cnpj)
    {
        var n = SomenteNumeros(cnpj);
        return $"{n.Substring(0, 2)}.{n.Substring(2, 3)}.{n.Substring(5, 3)}/{n.Substring(8, 4)}-{n.Substring(12, 2)}";
    }
}
