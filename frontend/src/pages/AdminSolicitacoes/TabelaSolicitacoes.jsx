import Selo from '../../components/Selo/Selo';
import Tabela from '../../components/Tabela/Tabela';
import { formatarData } from '../../utils/datas';
import { TIPO_DO_SELO } from './status';

export default function TabelaSolicitacoes({ linhas, aoVerDetalhes }) {
  const colunas = [
    { chave: 'data', titulo: 'Data', renderizar: (linha) => formatarData(linha.criadaEm) },
    { chave: 'colaborador', titulo: 'Colaborador', renderizar: (linha) => linha.colaborador.nome },
    { chave: 'empresa', titulo: 'Empresa', renderizar: (linha) => linha.empresa.nome },
    { chave: 'servico', titulo: 'Serviço', renderizar: (linha) => linha.servico.nome },
    { chave: 'universidade', titulo: 'Universidade', renderizar: (linha) => linha.universidade.nome },
    {
      chave: 'status',
      titulo: 'Status',
      renderizar: (linha) => <Selo tipo={TIPO_DO_SELO[linha.status]}>{linha.status}</Selo>,
    },
    {
      chave: 'acoes',
      titulo: 'Ações',
      renderizar: (linha) => (
        <button
          type="button"
          className="admin-solicitacoes__acao"
          onClick={() => aoVerDetalhes(linha)}
          aria-label={`Ver detalhes da solicitação de ${linha.colaborador.nome} (${linha.servico.nome})`}
        >
          Ver detalhes
        </button>
      ),
    },
  ];

  return <Tabela legenda="Solicitações dos colaboradores" colunas={colunas} linhas={linhas} />;
}
