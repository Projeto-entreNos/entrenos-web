import Selo from '../../components/Selo/Selo';
import Tabela from '../../components/Tabela/Tabela';
import { formatarData } from '../../utils/datas';

const TIPO_DO_SELO = {
  Ativo: 'sucesso',
  Convidado: 'neutro',
  'Convite expirado': 'erro',
};

// Reenviar é convidar de novo: só com contrato Ativo (podeReenviar)
export default function TabelaColaboradores({ linhas, podeReenviar, reenviandoId, aoReenviar, aoRemover }) {
  const colunas = [
    { chave: 'nome', titulo: 'Nome', renderizar: (linha) => linha.nome || '-' },
    { chave: 'email', titulo: 'E-mail', renderizar: (linha) => <span className="empresa__email">{linha.email}</span> },
    {
      chave: 'status',
      titulo: 'Status',
      renderizar: (linha) => <Selo tipo={TIPO_DO_SELO[linha.status]}>{linha.status}</Selo>,
    },
    { chave: 'data', titulo: 'Data do convite', renderizar: (linha) => formatarData(linha.conviteEnviadoEm) },
    {
      chave: 'acoes',
      titulo: 'Ações',
      renderizar: (linha) => {
        const quem = linha.nome || linha.email;

        if (linha.status === 'Ativo') {
          return (
            <div className="empresa__acoes">
              <button
                type="button"
                className="empresa__acao empresa__acao--perigo"
                onClick={() => aoRemover(linha)}
                aria-label={`Remover acesso de ${quem}`}
              >
                Remover acesso
              </button>
            </div>
          );
        }

        const reenviando = reenviandoId === linha.id;
        return (
          <div className="empresa__acoes">
            <button
              type="button"
              className="empresa__acao"
              onClick={() => aoReenviar(linha)}
              disabled={!podeReenviar || reenviando}
              aria-label={`Reenviar convite para ${quem}`}
            >
              {reenviando ? 'Reenviando...' : 'Reenviar convite'}
            </button>
            <button
              type="button"
              className="empresa__acao empresa__acao--perigo"
              onClick={() => aoRemover(linha)}
              aria-label={`Remover ${quem}`}
            >
              Remover
            </button>
          </div>
        );
      },
    },
  ];

  return <Tabela legenda="Colaboradores da empresa" colunas={colunas} linhas={linhas} />;
}
