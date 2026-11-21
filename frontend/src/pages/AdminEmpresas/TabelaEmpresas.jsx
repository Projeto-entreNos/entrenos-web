import Selo from '../../components/Selo/Selo';
import Tabela from '../../components/Tabela/Tabela';
import { formatarVigencia } from './formatar';

const TIPO_DO_SELO = {
  'Proposta enviada': 'neutro',
  'Aguardando pagamento': 'aviso',
  Ativo: 'sucesso',
  Encerrado: 'erro',
};

// "Confirmar pagamento" só aparece quando o contrato está "Aguardando pagamento"
export default function TabelaEmpresas({ linhas, aoEditar, aoConfirmarPagamento }) {
  const colunas = [
    { chave: 'nome', titulo: 'Empresa' },
    { chave: 'cnpj', titulo: 'CNPJ', renderizar: (linha) => <span className="admin-empresas__cnpj">{linha.cnpj}</span> },
    { chave: 'responsavel', titulo: 'Responsável', renderizar: (linha) => linha.responsavel || '-' },
    { chave: 'pacote', titulo: 'Pacote', renderizar: (linha) => linha.pacote.nome },
    {
      chave: 'contrato',
      titulo: 'Contrato',
      renderizar: (linha) => <Selo tipo={TIPO_DO_SELO[linha.statusContrato]}>{linha.statusContrato}</Selo>,
    },
    { chave: 'vagas', titulo: 'Vagas', renderizar: (linha) => `${linha.vagasOcupadas}/${linha.vagasContratadas}` },
    { chave: 'vigencia', titulo: 'Vigência', renderizar: (linha) => formatarVigencia(linha.vigenciaInicio, linha.vigenciaFim) },
    {
      chave: 'acoes',
      titulo: 'Ações',
      renderizar: (linha) => (
        <div className="admin-empresas__acoes">
          <button
            type="button"
            className="admin-empresas__acao"
            onClick={() => aoEditar(linha)}
            aria-label={`Editar ${linha.nome}`}
          >
            Editar
          </button>
          {linha.statusContrato === 'Aguardando pagamento' && (
            <button
              type="button"
              className="admin-empresas__acao"
              onClick={() => aoConfirmarPagamento(linha)}
              aria-label={`Confirmar pagamento de ${linha.nome}`}
            >
              Confirmar pagamento
            </button>
          )}
        </div>
      ),
    },
  ];

  return <Tabela legenda="Empresas parceiras" colunas={colunas} linhas={linhas} />;
}
