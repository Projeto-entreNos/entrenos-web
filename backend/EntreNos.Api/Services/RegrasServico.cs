using EntreNos.Api.Models;
using EntreNos.Api.Utils;

namespace EntreNos.Api.Services;

public static class RegrasServico
{
    // O selo "Novo" aparece nos 30 dias depois do cadastro do serviço (dias contados em Brasília)
    private const int DiasSeloNovo = 30;

    public static bool ServicoNovo(Servico servico)
    {
        var diaDoCadastro = Datas.DiaEmBrasilia(servico.CriadoEm);
        return diaDoCadastro.AddDays(DiasSeloNovo) >= Datas.HojeEmBrasilia();
    }
}
