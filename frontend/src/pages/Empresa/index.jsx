import { useEffect, useRef, useState } from 'react';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import Campo from '../../components/Campo/Campo';
import CampoSelecao from '../../components/Campo/CampoSelecao';
import Esqueleto from '../../components/Carregando/Esqueleto';
import EstadoVazio from '../../components/EstadoVazio/EstadoVazio';
import { useAuth } from '../../context/AuthContext';
import {
  buscarMinhaEmpresa,
  listarColaboradores,
  reenviarConvite,
  removerColaborador,
} from '../../services/empresa';
import CartaoPlano from './CartaoPlano';
import ModalConvidar from './ModalConvidar';
import ModalRemover from './ModalRemover';
import TabelaColaboradores from './TabelaColaboradores';
import './Empresa.css';

const OPCOES_STATUS = [
  { valor: 'todos', rotulo: 'Status: todos' },
  { valor: 'Convidado', rotulo: 'Status: convidado' },
  { valor: 'Ativo', rotulo: 'Status: ativo' },
  { valor: 'Convite expirado', rotulo: 'Status: convite expirado' },
];

// Aviso de contrato que ainda não (ou não mais) permite convidar
const AVISO_CONTRATO = {
  'Proposta enviada': {
    titulo: 'Proposta enviada',
    texto: 'Seu contrato está em análise. Os convites serão liberados quando o pagamento for confirmado.',
  },
  'Aguardando pagamento': {
    titulo: 'Aguardando pagamento',
    texto: 'Assim que a equipe EntreNós confirmar o pagamento, você poderá convidar colaboradores.',
  },
  Encerrado: {
    titulo: 'Contrato encerrado',
    texto: 'Seu contrato terminou. Fale com o EntreNós para renovar.',
  },
};

function plural(quantidade, singular, varios) {
  return quantidade === 1 ? singular : varios;
}

export default function Empresa() {
  const { usuario } = useAuth();
  const empresaId = usuario.empresaId;

  const [empresa, setEmpresa] = useState(null);
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0); // muda para carregar de novo

  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const [convidando, setConvidando] = useState(false); // modal de convite aberto
  const [paraRemover, setParaRemover] = useState(null); // colaborador no modal de remoção
  const [reenviandoId, setReenviandoId] = useState(null);
  // { tipo: 'sucesso'|'erro', titulo, texto, focar }: mensagem na região aria-live
  const [mensagem, setMensagem] = useState(null);
  const refMensagem = useRef(null);

  useEffect(() => {
    // Evita atualizar a tela se a pessoa saiu dela antes da resposta chegar
    let ativo = true;

    Promise.all([buscarMinhaEmpresa(empresaId), listarColaboradores(empresaId)])
      .then(([dadosEmpresa, colaboradores]) => {
        if (!ativo) return;
        setEmpresa(dadosEmpresa);
        setLista(colaboradores);
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
  }, [empresaId, tentativa]);

  // Depois de fechar um modal, o foco vai para a mensagem (o botão que abriu pode ter sumido)
  useEffect(() => {
    if (mensagem?.focar && !convidando && !paraRemover) refMensagem.current?.focus();
  }, [mensagem, convidando, paraRemover]);

  function tentarDeNovo() {
    setCarregando(true);
    setErro('');
    setTentativa((valor) => valor + 1);
  }

  function limparFiltros() {
    setBusca('');
    setFiltroStatus('todos');
  }

  function aoEnviarConvites(resposta) {
    const enviados = resposta.convidados.length;
    const ignorados = resposta.ignorados.length;
    setLista((atual) => [...resposta.convidados, ...atual]);
    setConvidando(false);
    limparFiltros(); // para os convidados aparecerem na tabela
    setMensagem({
      tipo: 'sucesso',
      titulo: plural(enviados, 'Convite enviado', 'Convites enviados'),
      texto:
        `Enviamos ${enviados} ${plural(enviados, 'convite', 'convites')}. Cada convite vale por 7 dias.` +
        (ignorados ? ` ${ignorados} ${plural(ignorados, 'e-mail foi ignorado', 'e-mails foram ignorados')}.` : ''),
      focar: true,
    });
  }

  async function reenviar(colaborador) {
    setReenviandoId(colaborador.id);
    try {
      const atualizado = await reenviarConvite(colaborador.id);
      setLista((atual) => atual.map((item) => (item.id === atualizado.id ? { ...item, ...atualizado } : item)));
      setMensagem({
        tipo: 'sucesso',
        titulo: 'Convite reenviado',
        texto: `Enviamos um novo convite para ${colaborador.email}. Ele vale por 7 dias.`,
      });
    } catch (falha) {
      setMensagem({ tipo: 'erro', titulo: 'Não foi possível reenviar o convite', texto: falha.message });
    } finally {
      setReenviandoId(null);
    }
  }

  // Se falhar, o erro sobe para o modal, que mostra o aviso e continua aberto
  async function confirmarRemocao() {
    const resposta = await removerColaborador(paraRemover.id);
    const quem = paraRemover.nome || paraRemover.email;
    const canceladas = resposta.solicitacoesCanceladas;
    setLista((atual) => atual.filter((item) => item.id !== paraRemover.id));
    setParaRemover(null);
    setMensagem({
      tipo: 'sucesso',
      titulo: 'Colaborador removido',
      texto:
        `${quem} não tem mais acesso aos benefícios e a vaga foi liberada.` +
        (canceladas
          ? ` ${canceladas} ${plural(canceladas, 'solicitação em aberto foi cancelada', 'solicitações em aberto foram canceladas')}.`
          : ''),
      focar: true,
    });
  }

  if (carregando) {
    return (
      <div className="empresa">
        <h1 className="empresa__titulo">Colaboradores</h1>
        <p className="somente-leitor-tela" role="status">
          Carregando seus colaboradores...
        </p>
        <div className="empresa__esqueleto empresa__esqueleto--plano">
          <Esqueleto tipo="linha" />
        </div>
        <div className="empresa__esqueleto">
          <Esqueleto tipo="linha" />
          <Esqueleto tipo="linha" />
          <Esqueleto tipo="linha" />
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="empresa">
        <h1 className="empresa__titulo">Colaboradores</h1>
        <Aviso tipo="erro" titulo="Não foi possível carregar seus colaboradores">
          {erro} Tente novamente.
        </Aviso>
        <div>
          <Botao variante="secundario" onClick={tentarDeNovo}>
            Tentar novamente
          </Botao>
        </div>
      </div>
    );
  }

  const contratoAtivo = empresa.statusContrato === 'Ativo';
  const avisoContrato = AVISO_CONTRATO[empresa.statusContrato];
  const vagasRestantes = Math.max(0, empresa.vagasContratadas - lista.length);

  const termo = busca.trim().toLowerCase();
  const filtrados = lista.filter(
    (item) =>
      (filtroStatus === 'todos' || item.status === filtroStatus) &&
      (!termo || item.nome.toLowerCase().includes(termo) || item.email.toLowerCase().includes(termo))
  );

  function conteudoDaLista() {
    if (lista.length === 0) {
      return contratoAtivo ? (
        <EstadoVazio
          titulo="Nenhum colaborador convidado"
          texto={`Envie convites por e-mail. Cada colaborador convidado ocupa uma vaga do Pacote ${empresa.pacote.nome}.`}
          acao={
            <Botao variante="secundario" onClick={() => setConvidando(true)}>
              Convidar colaboradores
            </Botao>
          }
        />
      ) : (
        <EstadoVazio
          titulo="Convites ainda bloqueados"
          texto="A lista de colaboradores aparece aqui depois do primeiro convite."
        />
      );
    }

    if (filtrados.length === 0) {
      return (
        <EstadoVazio
          titulo="Nenhum colaborador encontrado"
          texto="Confira a busca ou escolha outro status."
          acao={
            <Botao variante="secundario" onClick={limparFiltros}>
              Limpar filtros
            </Botao>
          }
        />
      );
    }

    return (
      <TabelaColaboradores
        linhas={filtrados}
        podeReenviar={contratoAtivo}
        reenviandoId={reenviandoId}
        aoReenviar={reenviar}
        aoRemover={setParaRemover}
      />
    );
  }

  return (
    <div className="empresa">
      <h1 className="empresa__titulo">Colaboradores da {empresa.nome}</h1>

      <CartaoPlano empresa={empresa} vagasUsadas={lista.length} />

      {avisoContrato && (
        <Aviso tipo="aviso" titulo={avisoContrato.titulo}>
          {avisoContrato.texto}
        </Aviso>
      )}

      {/* Região sempre presente para o leitor de tela anunciar as mensagens */}
      <div aria-live="polite" className="empresa__regiao-viva">
        {mensagem && (
          <div ref={refMensagem} tabIndex={-1} className="empresa__mensagem">
            <Aviso tipo={mensagem.tipo} titulo={mensagem.titulo}>
              {mensagem.texto}
            </Aviso>
          </div>
        )}
      </div>

      <div className="empresa__barra">
        <div className="empresa__busca">
          <Campo
            rotulo="Buscar por nome ou e-mail"
            tipo="search"
            placeholder="Buscar por nome ou e-mail"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
          />
        </div>
        <div className="empresa__filtro">
          <CampoSelecao
            rotulo="Filtrar por status"
            ocultarRotulo
            opcoes={OPCOES_STATUS}
            value={filtroStatus}
            onChange={(evento) => setFiltroStatus(evento.target.value)}
          />
        </div>
        <Botao onClick={() => setConvidando(true)} desabilitado={!contratoAtivo}>
          Convidar colaboradores
        </Botao>
      </div>

      {conteudoDaLista()}

      {lista.length > 0 && (
        <p className="empresa__total" role="status">
          Mostrando {filtrados.length} de {lista.length} {plural(lista.length, 'colaborador', 'colaboradores')}.
        </p>
      )}

      {convidando && (
        <ModalConvidar
          empresa={empresa}
          emailsDaEmpresa={lista.map((item) => item.email.toLowerCase())}
          vagasRestantes={vagasRestantes}
          aoFechar={() => setConvidando(false)}
          aoEnviar={aoEnviarConvites}
        />
      )}

      {paraRemover && (
        <ModalRemover
          colaborador={paraRemover}
          aoFechar={() => setParaRemover(null)}
          aoConfirmar={confirmarRemocao}
        />
      )}
    </div>
  );
}
