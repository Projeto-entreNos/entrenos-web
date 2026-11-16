import { useEffect, useRef, useState } from 'react';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import CampoSelecao from '../../components/Campo/CampoSelecao';
import Modal from '../../components/Modal/Modal';
import Selo from '../../components/Selo/Selo';
import { proximosStatus } from '../../services/admin';
import { formatarData } from '../../utils/datas';
import { TIPO_DO_SELO } from './status';

/*
  Painel lateral com os detalhes de uma solicitação.
  aoSalvar(status) é async; se falhar, o painel mostra o erro e continua aberto.
  aoPedirCancelamento(): "Cancelada" não tem volta, então passa antes por um modal de confirmação.
  mensagemInicial: aviso de sucesso para mostrar ao abrir (ex.: depois de confirmar o cancelamento).
*/
export default function PainelSolicitacao({ solicitacao, aoFechar, aoSalvar, aoPedirCancelamento, mensagemInicial }) {
  const [escolhido, setEscolhido] = useState(solicitacao.status);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(mensagemInicial ?? '');
  const refRetorno = useRef(null);

  // O botão "Salvar status" some depois de salvar, então o foco vai para a mensagem de sucesso
  useEffect(() => {
    if (sucesso) refRetorno.current?.focus();
  }, [sucesso]);

  const proximos = proximosStatus(solicitacao.status);
  const travada = proximos.length === 0;
  const mudou = escolhido !== solicitacao.status;

  function fechar() {
    if (!salvando) aoFechar();
  }

  function escolher(evento) {
    setEscolhido(evento.target.value);
    setErro('');
    setSucesso('');
  }

  async function salvar() {
    if (escolhido === 'Cancelada') {
      aoPedirCancelamento();
      return;
    }

    setSalvando(true);
    setErro('');
    try {
      await aoSalvar(escolhido);
      setSucesso(`Status atualizado para "${escolhido}".`);
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal
      aberto
      posicao="lateral"
      aoFechar={fechar}
      titulo="Detalhes da solicitação"
      acoes={
        mudou && (
          <Botao onClick={salvar} carregando={salvando} textoCarregando="Salvando...">
            Salvar status
          </Botao>
        )
      }
    >
      <div className="admin-solicitacoes__painel">
        <div>
          <Selo tipo={TIPO_DO_SELO[solicitacao.status]}>{solicitacao.status}</Selo>
        </div>

        <dl className="admin-solicitacoes__dados">
          <div>
            <dt>Colaborador</dt>
            <dd>{solicitacao.colaborador.nome}</dd>
          </div>
          <div>
            <dt>E-mail do colaborador</dt>
            <dd>{solicitacao.colaborador.email}</dd>
          </div>
          <div>
            <dt>Empresa</dt>
            <dd>{solicitacao.empresa.nome}</dd>
          </div>
          <div>
            <dt>Serviço</dt>
            <dd>{solicitacao.servico.nome}</dd>
          </div>
          <div>
            <dt>Universidade</dt>
            <dd>{solicitacao.universidade.nome}</dd>
          </div>
          <div>
            <dt>E-mail da universidade</dt>
            <dd>{solicitacao.universidade.email}</dd>
          </div>
          {/* LGPD: o admin só sabe se há mensagem; o conteúdo vai só para a universidade */}
          <div>
            <dt>Mensagem</dt>
            <dd className="admin-solicitacoes__mensagem">
              {solicitacao.temMensagem ? 'Mensagem enviada à universidade' : 'Sem mensagem'}
            </dd>
          </div>
        </dl>

        <div className="admin-solicitacoes__datas">
          <p>Enviada em {formatarData(solicitacao.criadaEm)}</p>
          <p>Atendida em {solicitacao.atendidaEm ? formatarData(solicitacao.atendidaEm) : '—'}</p>
        </div>

        <CampoSelecao
          rotulo="Atualizar status"
          opcoes={[solicitacao.status, ...proximos].map((status) => ({ valor: status, rotulo: status }))}
          ajuda={
            travada
              ? `Solicitação ${solicitacao.status.toLowerCase()}: o status não pode mais mudar.`
              : 'Opções: Enviada, Em contato, Atendida ou Cancelada.'
          }
          value={escolhido}
          onChange={escolher}
          desabilitado={travada || salvando}
        />

        <div aria-live="polite" ref={refRetorno} tabIndex={-1} className="admin-solicitacoes__retorno">
          {sucesso && <Aviso tipo="sucesso" titulo={sucesso} />}
          {erro && (
            <Aviso tipo="erro" titulo="Não foi possível salvar">
              {erro} Tente novamente.
            </Aviso>
          )}
        </div>
      </div>
    </Modal>
  );
}
