import { useEffect, useState } from 'react';
import AbasAdmin from '../../components/Abas/AbasAdmin';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import Campo from '../../components/Campo/Campo';
import CampoSelecao from '../../components/Campo/CampoSelecao';
import CardResumo from '../../components/Card/CardResumo';
import Esqueleto from '../../components/Carregando/Esqueleto';
import EstadoVazio from '../../components/EstadoVazio/EstadoVazio';
import {
  alterarStatusSolicitacao,
  listarEmpresas,
  listarSolicitacoesAdmin,
  listarUniversidades,
} from '../../services/admin';
import ModalConfirmarCancelamento from './ModalConfirmarCancelamento';
import PainelSolicitacao from './PainelSolicitacao';
import { combinaComBusca } from '../../utils/busca';
import { STATUS_SOLICITACAO } from './status';
import TabelaSolicitacoes from './TabelaSolicitacoes';
import './AdminSolicitacoes.css';

function plural(quantidade, singular, varios) {
  return quantidade === 1 ? singular : varios;
}


function contar(lista, status) {
  return lista.filter((item) => item.status === status).length;
}

export default function AdminSolicitacoes() {
  const [lista, setLista] = useState([]);
  const [universidades, setUniversidades] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0); // muda para carregar de novo

  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroUniversidade, setFiltroUniversidade] = useState('todas');
  const [filtroEmpresa, setFiltroEmpresa] = useState('todas');
  const [busca, setBusca] = useState('');

  // { id, mensagemInicial }: painel aberto | null
  const [painel, setPainel] = useState(null);
  // id da solicitação no modal de confirmar o cancelamento (o painel fica fechado enquanto isso)
  const [confirmando, setConfirmando] = useState(null);

  useEffect(() => {
    // Evita atualizar a tela se a pessoa saiu dela antes da resposta chegar
    let ativo = true;

    Promise.all([listarSolicitacoesAdmin(), listarUniversidades(), listarEmpresas()])
      .then(([solicitacoes, dadosUniversidades, dadosEmpresas]) => {
        if (!ativo) return;
        setLista(solicitacoes);
        setUniversidades(dadosUniversidades);
        setEmpresas(dadosEmpresas);
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
  }, [tentativa]);

  function tentarDeNovo() {
    setCarregando(true);
    setErro('');
    setTentativa((valor) => valor + 1);
  }

  function limparFiltros() {
    setFiltroStatus('todos');
    setFiltroUniversidade('todas');
    setFiltroEmpresa('todas');
    setBusca('');
  }

  // Atualiza a linha na lista: a tabela e os cartões de resumo mudam juntos
  async function salvarStatus(id, status) {
    const resposta = await alterarStatusSolicitacao(id, status);
    setLista((atual) => atual.map((item) => (item.id === resposta.id ? { ...item, ...resposta } : item)));
  }

  async function confirmarCancelamento() {
    await salvarStatus(confirmando, 'Cancelada');
    setPainel({ id: confirmando, mensagemInicial: 'Solicitação cancelada.' });
    setConfirmando(null);
  }

  function pedirCancelamento(id) {
    setPainel(null);
    setConfirmando(id);
  }

  function voltarDoCancelamento() {
    setPainel({ id: confirmando });
    setConfirmando(null);
  }

  function conteudo() {
    if (carregando) {
      return (
        <>
          <p className="somente-leitor-tela" role="status">
            Carregando as solicitações...
          </p>
          <div className="admin-solicitacoes__esqueleto">
            <Esqueleto tipo="linha" />
            <Esqueleto tipo="linha" />
            <Esqueleto tipo="linha" />
          </div>
        </>
      );
    }

    if (erro) {
      return (
        <>
          <Aviso tipo="erro" titulo="Não foi possível carregar as solicitações">
            {erro} Tente novamente.
          </Aviso>
          <div>
            <Botao variante="secundario" onClick={tentarDeNovo}>
              Tentar novamente
            </Botao>
          </div>
        </>
      );
    }

    if (lista.length === 0) {
      return (
        <EstadoVazio
          titulo="Nenhuma solicitação recebida"
          texto="Quando um colaborador solicitar um serviço, o pedido aparece aqui."
        />
      );
    }

    const filtradas = lista.filter(
      (item) =>
        (filtroStatus === 'todos' || item.status === filtroStatus) &&
        // O select devolve texto e a API manda ids numéricos: compara os dois como texto
        (filtroUniversidade === 'todas' || String(item.universidade.id) === filtroUniversidade) &&
        (filtroEmpresa === 'todas' || String(item.empresa.id) === filtroEmpresa) &&
        combinaComBusca(busca, [item.colaborador.nome, item.servico.nome])
    );

    return (
      <>
        {/* Os cartões contam todas as solicitações, sem os filtros */}
        <div className="admin-solicitacoes__resumo" role="status">
          <CardResumo numero={lista.length} legenda="Total de solicitações" />
          <CardResumo numero={contar(lista, 'Enviada')} legenda="Enviadas" />
          <CardResumo numero={contar(lista, 'Em contato')} legenda="Em contato" />
          <CardResumo numero={contar(lista, 'Atendida')} legenda="Atendidas" />
        </div>

        <div className="admin-solicitacoes__barra">
          <div className="admin-solicitacoes__filtro">
            <CampoSelecao
              rotulo="Filtrar por status"
              ocultarRotulo
              opcoes={[
                { valor: 'todos', rotulo: 'Status: todos' },
                ...STATUS_SOLICITACAO.map((status) => ({ valor: status, rotulo: status })),
              ]}
              value={filtroStatus}
              onChange={(evento) => setFiltroStatus(evento.target.value)}
            />
          </div>
          <div className="admin-solicitacoes__filtro admin-solicitacoes__filtro--largo">
            <CampoSelecao
              rotulo="Filtrar por universidade"
              ocultarRotulo
              opcoes={[
                { valor: 'todas', rotulo: 'Universidade: todas' },
                ...universidades.map((item) => ({ valor: item.id, rotulo: item.nome })),
              ]}
              value={filtroUniversidade}
              onChange={(evento) => setFiltroUniversidade(evento.target.value)}
            />
          </div>
          <div className="admin-solicitacoes__filtro">
            <CampoSelecao
              rotulo="Filtrar por empresa"
              ocultarRotulo
              opcoes={[
                { valor: 'todas', rotulo: 'Empresa: todas' },
                ...empresas.map((item) => ({ valor: item.id, rotulo: item.nome })),
              ]}
              value={filtroEmpresa}
              onChange={(evento) => setFiltroEmpresa(evento.target.value)}
            />
          </div>
          <div className="admin-solicitacoes__busca">
            <Campo
              rotulo="Buscar por colaborador ou serviço"
              tipo="search"
              placeholder="Buscar por colaborador ou serviço"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </div>
          <Botao variante="texto" onClick={limparFiltros}>
            Limpar filtros
          </Botao>
        </div>

        {filtradas.length === 0 ? (
          <EstadoVazio
            titulo="Nenhuma solicitação encontrada"
            texto="Ajuste os filtros ou limpe a busca para ver outras solicitações."
            acao={
              <Botao variante="secundario" onClick={limparFiltros}>
                Limpar filtros
              </Botao>
            }
          />
        ) : (
          <>
            <TabelaSolicitacoes linhas={filtradas} aoVerDetalhes={(item) => setPainel({ id: item.id })} />
            <p className="admin-solicitacoes__total" role="status">
              Mostrando {filtradas.length} de {lista.length} {plural(lista.length, 'solicitação', 'solicitações')}.
            </p>
          </>
        )}
      </>
    );
  }

  const noPainel = painel && lista.find((item) => item.id === painel.id);
  const paraConfirmar = confirmando && lista.find((item) => item.id === confirmando);

  return (
    <div className="admin-solicitacoes">
      <h1 className="admin-solicitacoes__titulo">Painel administrativo</h1>
      <AbasAdmin />

      {conteudo()}

      {noPainel && (
        <PainelSolicitacao
          key={noPainel.id}
          solicitacao={noPainel}
          mensagemInicial={painel.mensagemInicial}
          aoFechar={() => setPainel(null)}
          aoSalvar={(status) => salvarStatus(noPainel.id, status)}
          aoPedirCancelamento={() => pedirCancelamento(noPainel.id)}
        />
      )}

      {paraConfirmar && (
        <ModalConfirmarCancelamento
          solicitacao={paraConfirmar}
          aoFechar={voltarDoCancelamento}
          aoConfirmar={confirmarCancelamento}
        />
      )}
    </div>
  );
}
