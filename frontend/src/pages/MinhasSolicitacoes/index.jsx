import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import Esqueleto from '../../components/Carregando/Esqueleto';
import EstadoVazio from '../../components/EstadoVazio/EstadoVazio';
import Selo from '../../components/Selo/Selo';
import Tabela from '../../components/Tabela/Tabela';
import { useAuth } from '../../context/AuthContext';
import { cancelarSolicitacao, listarMinhasSolicitacoes } from '../../services/solicitacoes';
import { formatarData } from './formatarData';
import ModalCancelar from './ModalCancelar';
import './MinhasSolicitacoes.css';

const TIPO_DO_SELO = {
  Enviada: 'neutro',
  'Em contato': 'aviso',
  Atendida: 'sucesso',
  Cancelada: 'erro',
};

const titulo = <h1 className="minhas-solicitacoes__titulo">Minhas solicitações</h1>;

export default function MinhasSolicitacoes() {
  const { usuario } = useAuth();

  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0); // muda para carregar de novo
  const [paraCancelar, setParaCancelar] = useState(null); // solicitação aberta no modal
  const [cancelada, setCancelada] = useState(null); // nome do serviço cancelado (mensagem de sucesso)
  const refSucesso = useRef(null);

  useEffect(() => {
    // Evita atualizar a tela se a pessoa saiu dela antes da resposta chegar
    let ativo = true;

    listarMinhasSolicitacoes(usuario.id)
      .then((resposta) => {
        if (!ativo) return;
        setLista(resposta);
        setErro('');
      })
      .catch((falha) => {
        if (ativo) setErro(falha.message);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [usuario.id, tentativa]);

  // O botão "Cancelar" some depois do cancelamento, então o foco vai para a mensagem de sucesso
  useEffect(() => {
    if (cancelada && !paraCancelar) refSucesso.current?.focus();
  }, [cancelada, paraCancelar]);

  function tentarDeNovo() {
    setCarregando(true);
    setErro('');
    setTentativa((valor) => valor + 1);
  }

  // Se falhar, o erro sobe para o modal, que mostra o aviso e continua aberto
  async function confirmarCancelamento() {
    const resposta = await cancelarSolicitacao(paraCancelar.id, usuario.id);
    setLista((atual) =>
      atual.map((item) => (item.id === resposta.id ? { ...item, ...resposta } : item))
    );
    setCancelada(paraCancelar.servico.nome);
    setParaCancelar(null);
  }

  if (carregando) {
    return (
      <div className="minhas-solicitacoes">
        {titulo}
        <p className="somente-leitor-tela" role="status">
          Carregando suas solicitações...
        </p>
        <div className="minhas-solicitacoes__esqueleto">
          <Esqueleto tipo="linha" />
          <Esqueleto tipo="linha" />
          <Esqueleto tipo="linha" />
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="minhas-solicitacoes">
        {titulo}
        <Aviso tipo="erro" titulo="Não foi possível carregar suas solicitações">
          {erro} Tente de novo em alguns instantes.
        </Aviso>
        <div>
          <Botao variante="secundario" onClick={tentarDeNovo}>
            Tentar de novo
          </Botao>
        </div>
      </div>
    );
  }

  if (lista.length === 0) {
    return (
      <div className="minhas-solicitacoes">
        {titulo}
        <EstadoVazio
          titulo="Você ainda não fez nenhuma solicitação"
          texto="Escolha um serviço em Benefícios e envie sua solicitação. Ela aparece aqui."
          acao={
            <Botao variante="secundario" para="/beneficios">
              Ver benefícios
            </Botao>
          }
        />
      </div>
    );
  }

  const colunas = [
    { chave: 'data', titulo: 'Data', renderizar: (linha) => formatarData(linha.criadaEm) },
    {
      chave: 'servico',
      titulo: 'Serviço',
      renderizar: (linha) => (
        <Link to={`/servicos/${linha.servico.id}`} className="minhas-solicitacoes__link">
          {linha.servico.nome}
        </Link>
      ),
    },
    { chave: 'universidade', titulo: 'Universidade', renderizar: (linha) => linha.universidade.nome },
    {
      chave: 'status',
      titulo: 'Status',
      renderizar: (linha) => <Selo tipo={TIPO_DO_SELO[linha.status]}>{linha.status}</Selo>,
    },
    {
      chave: 'acoes',
      titulo: 'Ações',
      // O colaborador só cancela enquanto a universidade ainda não entrou em contato
      renderizar: (linha) =>
        linha.status === 'Enviada' && (
          <button
            type="button"
            className="minhas-solicitacoes__cancelar"
            onClick={() => setParaCancelar(linha)}
            aria-label={`Cancelar solicitação de ${linha.servico.nome}`}
          >
            Cancelar
          </button>
        ),
    },
  ];

  const total = lista.length;

  return (
    <div className="minhas-solicitacoes">
      {titulo}

      {/* Região sempre presente para o leitor de tela anunciar o sucesso */}
      <div aria-live="polite" className="minhas-solicitacoes__regiao-viva">
        {cancelada && (
          <div ref={refSucesso} tabIndex={-1} className="minhas-solicitacoes__sucesso">
            <Aviso tipo="sucesso" titulo="Solicitação cancelada">
              A solicitação de {cancelada} foi cancelada e o atendimento voltou para o seu limite do mês.
            </Aviso>
          </div>
        )}
      </div>

      <Tabela legenda="Suas solicitações, da mais recente para a mais antiga" colunas={colunas} linhas={lista} />

      <p className="minhas-solicitacoes__total">
        Mostrando {total} de {total} {total === 1 ? 'solicitação' : 'solicitações'}.
      </p>

      {paraCancelar && (
        <ModalCancelar
          solicitacao={paraCancelar}
          aoFechar={() => setParaCancelar(null)}
          aoConfirmar={confirmarCancelamento}
        />
      )}
    </div>
  );
}
