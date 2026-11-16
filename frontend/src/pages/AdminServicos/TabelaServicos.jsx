import Selo from '../../components/Selo/Selo';
import Tabela from '../../components/Tabela/Tabela';

const TIPO_DO_SELO = {
  Ativo: 'sucesso',
  'Sem vagas': 'aviso',
  Pausado: 'neutro',
};

// ["essencial", "completo"] -> "Essencial e Completo"
function nomesDosPacotes(ids, pacotes) {
  const nomes = pacotes.filter((pacote) => ids.includes(pacote.id)).map((pacote) => pacote.nome);
  return nomes.join(' e ') || '-';
}

export default function TabelaServicos({ linhas, pacotes, aoEditar }) {
  const colunas = [
    { chave: 'nome', titulo: 'Serviço', renderizar: (linha) => <span className="admin-servicos__nome">{linha.nome}</span> },
    { chave: 'categoria', titulo: 'Categoria' },
    { chave: 'universidade', titulo: 'Universidade', renderizar: (linha) => linha.universidade.nome },
    { chave: 'pacotes', titulo: 'Pacotes', renderizar: (linha) => nomesDosPacotes(linha.pacotes, pacotes) },
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
          className="admin-servicos__acao"
          onClick={() => aoEditar(linha)}
          aria-label={`Editar ${linha.nome}`}
        >
          Editar
        </button>
      ),
    },
  ];

  return <Tabela legenda="Serviços do catálogo" colunas={colunas} linhas={linhas} />;
}
