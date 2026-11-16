import { useEffect, useRef, useState } from 'react';
import AbasAdmin from '../../components/Abas/AbasAdmin';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import Campo from '../../components/Campo/Campo';
import CampoSelecao from '../../components/Campo/CampoSelecao';
import Esqueleto from '../../components/Carregando/Esqueleto';
import EstadoVazio from '../../components/EstadoVazio/EstadoVazio';
import {
  criarServico,
  editarServico,
  listarPacotes,
  listarServicosAdmin,
  listarUniversidades,
} from '../../services/admin';
import { listarCategorias } from '../../services/servicos';
import ModalServico from './ModalServico';
import TabelaServicos from './TabelaServicos';
import { STATUS_SERVICO } from './validarServico';
import './AdminServicos.css';

function plural(quantidade, singular, varios) {
  return quantidade === 1 ? singular : varios;
}

// Busca sem diferenciar maiúsculas e acentos: "educacao" encontra "Educação financeira"
function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export default function AdminServicos() {
  const [lista, setLista] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [universidades, setUniversidades] = useState([]);
  const [pacotes, setPacotes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0); // muda para carregar de novo

  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  // null: fechado | { servico: null }: novo serviço | { servico }: editar
  const [formulario, setFormulario] = useState(null);
  // { tipo: 'sucesso', titulo, texto, focar }: mensagem na região aria-live
  const [mensagem, setMensagem] = useState(null);
  const refMensagem = useRef(null);

  useEffect(() => {
    // Evita atualizar a tela se a pessoa saiu dela antes da resposta chegar
    let ativo = true;

    Promise.all([listarServicosAdmin(), listarCategorias(), listarUniversidades(), listarPacotes()])
      .then(([servicos, dadosCategorias, dadosUniversidades, dadosPacotes]) => {
        if (!ativo) return;
        setLista(servicos);
        setCategorias(dadosCategorias);
        setUniversidades(dadosUniversidades);
        setPacotes(dadosPacotes);
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

  // Depois de fechar o modal, o foco vai para a mensagem de sucesso
  useEffect(() => {
    if (mensagem?.focar && !formulario) refMensagem.current?.focus();
  }, [mensagem, formulario]);

  function tentarDeNovo() {
    setCarregando(true);
    setErro('');
    setTentativa((valor) => valor + 1);
  }

  function limparFiltros() {
    setBusca('');
    setFiltroCategoria('todas');
    setFiltroStatus('todos');
  }

  // Se falhar, o erro sobe para o modal, que mostra o aviso e continua aberto
  async function salvarServico(dados) {
    const emEdicao = formulario.servico;

    if (emEdicao) {
      const atualizado = await editarServico(emEdicao.id, dados);
      setLista((atual) => atual.map((item) => (item.id === atualizado.id ? atualizado : item)));
      setMensagem({
        tipo: 'sucesso',
        titulo: 'Alterações salvas',
        texto: `Os dados de ${atualizado.nome} foram atualizados.`,
        focar: true,
      });
    } else {
      const novo = await criarServico(dados);
      setLista((atual) => [...atual, novo]);
      limparFiltros(); // para o novo serviço aparecer na tabela
      setMensagem({
        tipo: 'sucesso',
        titulo: 'Serviço cadastrado',
        texto: `${novo.nome} foi cadastrado com o status "${novo.status}".`,
        focar: true,
      });
    }

    setFormulario(null);
  }

  function abrirNovo() {
    setFormulario({ servico: null });
  }

  function conteudo() {
    if (carregando) {
      return (
        <>
          <p className="somente-leitor-tela" role="status">
            Carregando os serviços...
          </p>
          <div className="admin-servicos__esqueleto">
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
          <Aviso tipo="erro" titulo="Não foi possível carregar os serviços">
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

    const termo = normalizar(busca);
    const filtrados = lista.filter(
      (servico) =>
        (filtroCategoria === 'todas' || servico.categoria === filtroCategoria) &&
        (filtroStatus === 'todos' || servico.status === filtroStatus) &&
        normalizar(servico.nome).includes(termo)
    );

    let resultado;
    if (lista.length === 0) {
      resultado = (
        <EstadoVazio
          titulo="Nenhum serviço cadastrado"
          texto="Cadastre o primeiro serviço depois de fechar a parceria com a universidade."
          acao={
            <Botao variante="secundario" onClick={abrirNovo}>
              Novo serviço
            </Botao>
          }
        />
      );
    } else if (filtrados.length === 0) {
      resultado = (
        <EstadoVazio
          titulo="Nenhum serviço encontrado"
          texto="Tente outro nome ou limpe os filtros."
          acao={
            <Botao variante="secundario" onClick={limparFiltros}>
              Limpar filtros
            </Botao>
          }
        />
      );
    } else {
      resultado = (
        <TabelaServicos linhas={filtrados} pacotes={pacotes} aoEditar={(servico) => setFormulario({ servico })} />
      );
    }

    return (
      <>
        {/* Região sempre presente para o leitor de tela anunciar as mensagens */}
        <div aria-live="polite" className="admin-servicos__regiao-viva">
          {mensagem && (
            <div ref={refMensagem} tabIndex={-1} className="admin-servicos__mensagem">
              <Aviso tipo={mensagem.tipo} titulo={mensagem.titulo}>
                {mensagem.texto}
              </Aviso>
            </div>
          )}
        </div>

        <div className="admin-servicos__barra">
          <div className="admin-servicos__busca">
            <Campo
              rotulo="Buscar por nome do serviço"
              tipo="search"
              placeholder="Buscar por nome do serviço"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </div>
          <div className="admin-servicos__filtro">
            <CampoSelecao
              rotulo="Filtrar por categoria"
              ocultarRotulo
              opcoes={[
                { valor: 'todas', rotulo: 'Categoria: todas' },
                ...categorias.map((categoria) => ({ valor: categoria, rotulo: categoria })),
              ]}
              value={filtroCategoria}
              onChange={(evento) => setFiltroCategoria(evento.target.value)}
            />
          </div>
          <div className="admin-servicos__filtro">
            <CampoSelecao
              rotulo="Filtrar por status"
              ocultarRotulo
              opcoes={[
                { valor: 'todos', rotulo: 'Status: todos' },
                ...STATUS_SERVICO.map((status) => ({ valor: status, rotulo: status })),
              ]}
              value={filtroStatus}
              onChange={(evento) => setFiltroStatus(evento.target.value)}
            />
          </div>
          <Botao onClick={abrirNovo}>Novo serviço</Botao>
        </div>

        {resultado}

        {lista.length > 0 && (
          <p className="admin-servicos__total" role="status">
            Mostrando {filtrados.length} de {lista.length} {plural(lista.length, 'serviço', 'serviços')}.
          </p>
        )}
      </>
    );
  }

  return (
    <div className="admin-servicos">
      <h1 className="admin-servicos__titulo">Painel administrativo</h1>
      <AbasAdmin />

      {conteudo()}

      {formulario && (
        <ModalServico
          servico={formulario.servico}
          categorias={categorias}
          universidades={universidades}
          pacotes={pacotes}
          aoFechar={() => setFormulario(null)}
          aoSalvar={salvarServico}
        />
      )}
    </div>
  );
}
