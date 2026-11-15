import { useEffect, useRef, useState } from 'react';
import AbasAdmin from '../../components/Abas/AbasAdmin';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import Campo from '../../components/Campo/Campo';
import CampoSelecao from '../../components/Campo/CampoSelecao';
import Esqueleto from '../../components/Carregando/Esqueleto';
import EstadoVazio from '../../components/EstadoVazio/EstadoVazio';
import {
  alterarStatusContrato,
  criarEmpresa,
  editarEmpresa,
  listarEmpresas,
  listarPacotes,
} from '../../services/admin';
import { somenteNumeros } from './formatar';
import ModalConfirmarPagamento from './ModalConfirmarPagamento';
import ModalEmpresa from './ModalEmpresa';
import TabelaEmpresas from './TabelaEmpresas';
import './AdminEmpresas.css';

// Sem o prefixo "Contrato:" nos status, para o texto caber no filtro sem ser cortado
const OPCOES_CONTRATO = [
  { valor: 'todos', rotulo: 'Contrato: todos' },
  { valor: 'Proposta enviada', rotulo: 'Proposta enviada' },
  { valor: 'Aguardando pagamento', rotulo: 'Aguardando pagamento' },
  { valor: 'Ativo', rotulo: 'Ativo' },
  { valor: 'Encerrado', rotulo: 'Encerrado' },
];

function plural(quantidade, singular, varios) {
  return quantidade === 1 ? singular : varios;
}

// Busca pelo nome ou pelo CNPJ, com ou sem pontuação
function combinaComBusca(empresa, busca) {
  const termo = busca.trim().toLowerCase();
  if (!termo) return true;

  const numerosDoTermo = somenteNumeros(termo);
  return (
    empresa.nome.toLowerCase().includes(termo) ||
    (numerosDoTermo !== '' && somenteNumeros(empresa.cnpj).includes(numerosDoTermo))
  );
}

export default function AdminEmpresas() {
  const [lista, setLista] = useState([]);
  const [pacotes, setPacotes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0); // muda para carregar de novo

  const [busca, setBusca] = useState('');
  const [filtroContrato, setFiltroContrato] = useState('todos');

  // null: fechado | { empresa: null }: nova empresa | { empresa }: editar
  const [formulario, setFormulario] = useState(null);
  const [paraConfirmar, setParaConfirmar] = useState(null); // empresa no modal de confirmar pagamento
  // { tipo: 'sucesso', titulo, texto, focar }: mensagem na região aria-live
  const [mensagem, setMensagem] = useState(null);
  const refMensagem = useRef(null);

  useEffect(() => {
    // Evita atualizar a tela se a pessoa saiu dela antes da resposta chegar
    let ativo = true;

    Promise.all([listarEmpresas(), listarPacotes()])
      .then(([empresas, dadosPacotes]) => {
        if (!ativo) return;
        setLista(empresas);
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

  // Depois de fechar um modal, o foco vai para a mensagem de sucesso
  useEffect(() => {
    if (mensagem?.focar && !formulario && !paraConfirmar) refMensagem.current?.focus();
  }, [mensagem, formulario, paraConfirmar]);

  function tentarDeNovo() {
    setCarregando(true);
    setErro('');
    setTentativa((valor) => valor + 1);
  }

  function limparFiltros() {
    setBusca('');
    setFiltroContrato('todos');
  }

  // Se falhar, o erro sobe para o modal, que mostra o aviso e continua aberto
  async function salvarEmpresa(dados) {
    const emEdicao = formulario.empresa;

    if (emEdicao) {
      const atualizada = await editarEmpresa(emEdicao.id, dados);
      setLista((atual) => atual.map((item) => (item.id === atualizada.id ? atualizada : item)));
      setMensagem({
        tipo: 'sucesso',
        titulo: 'Alterações salvas',
        texto: `Os dados de ${atualizada.nome} foram atualizados.`,
        focar: true,
      });
    } else {
      const nova = await criarEmpresa(dados);
      setLista((atual) => [...atual, nova]);
      limparFiltros(); // para a nova empresa aparecer na tabela
      setMensagem({
        tipo: 'sucesso',
        titulo: 'Empresa cadastrada',
        texto: `${nova.nome} foi cadastrada com o contrato "${nova.statusContrato}".`,
        focar: true,
      });
    }

    setFormulario(null);
  }

  async function confirmarPagamento() {
    const resposta = await alterarStatusContrato(paraConfirmar.id, 'Ativo');
    setLista((atual) =>
      atual.map((item) => (item.id === resposta.id ? { ...item, statusContrato: resposta.statusContrato } : item))
    );
    setMensagem({
      tipo: 'sucesso',
      titulo: 'Pagamento confirmado',
      texto: `O contrato de ${paraConfirmar.nome} está ativo. A empresa já pode convidar colaboradores.`,
      focar: true,
    });
    setParaConfirmar(null);
  }

  function conteudo() {
    if (carregando) {
      return (
        <>
          <p className="somente-leitor-tela" role="status">
            Carregando as empresas...
          </p>
          <div className="admin-empresas__esqueleto">
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
          <Aviso tipo="erro" titulo="Não foi possível carregar as empresas">
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

    const filtradas = lista.filter(
      (empresa) =>
        (filtroContrato === 'todos' || empresa.statusContrato === filtroContrato) && combinaComBusca(empresa, busca)
    );

    let resultado;
    if (lista.length === 0) {
      resultado = (
        <EstadoVazio
          titulo="Nenhuma empresa cadastrada"
          texto="Cadastre a primeira empresa parceira para registrar o contrato e liberar os convites."
        />
      );
    } else if (filtradas.length === 0) {
      resultado = (
        <EstadoVazio
          titulo="Nenhuma empresa encontrada"
          texto="Confira a busca ou escolha outro contrato."
          acao={
            <Botao variante="secundario" onClick={limparFiltros}>
              Limpar filtros
            </Botao>
          }
        />
      );
    } else {
      resultado = (
        <TabelaEmpresas
          linhas={filtradas}
          aoEditar={(empresa) => setFormulario({ empresa })}
          aoConfirmarPagamento={setParaConfirmar}
        />
      );
    }

    return (
      <>
        {/* Região sempre presente para o leitor de tela anunciar as mensagens */}
        <div aria-live="polite" className="admin-empresas__regiao-viva">
          {mensagem && (
            <div ref={refMensagem} tabIndex={-1} className="admin-empresas__mensagem">
              <Aviso tipo={mensagem.tipo} titulo={mensagem.titulo}>
                {mensagem.texto}
              </Aviso>
            </div>
          )}
        </div>

        <div className="admin-empresas__barra">
          <div className="admin-empresas__busca">
            <Campo
              rotulo="Buscar por nome ou CNPJ"
              tipo="search"
              placeholder="Buscar por nome ou CNPJ"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </div>
          <div className="admin-empresas__filtro">
            <CampoSelecao
              rotulo="Filtrar por contrato"
              ocultarRotulo
              opcoes={OPCOES_CONTRATO}
              value={filtroContrato}
              onChange={(evento) => setFiltroContrato(evento.target.value)}
            />
          </div>
          <Botao onClick={() => setFormulario({ empresa: null })}>Nova empresa</Botao>
        </div>

        {resultado}

        {lista.length > 0 && (
          <p className="admin-empresas__total" role="status">
            Mostrando {filtradas.length} de {lista.length} {plural(lista.length, 'empresa', 'empresas')}.
          </p>
        )}
      </>
    );
  }

  return (
    <div className="admin-empresas">
      <h1 className="admin-empresas__titulo">Painel administrativo</h1>
      <AbasAdmin />

      {conteudo()}

      {formulario && (
        <ModalEmpresa
          empresa={formulario.empresa}
          pacotes={pacotes}
          aoFechar={() => setFormulario(null)}
          aoSalvar={salvarEmpresa}
        />
      )}

      {paraConfirmar && (
        <ModalConfirmarPagamento
          empresa={paraConfirmar}
          aoFechar={() => setParaConfirmar(null)}
          aoConfirmar={confirmarPagamento}
        />
      )}
    </div>
  );
}
