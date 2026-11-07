import { useState } from 'react';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import Modal from '../../components/Modal/Modal';

/**
 * Confirmação do cancelamento (Figma: Minhas-solicitacoes-Modal Cancelar).
 * - solicitacao: a solicitação que será cancelada
 * - aoFechar: fecha sem cancelar
 * - aoConfirmar: função async; se falhar, o modal continua aberto com o aviso de erro
 */
export default function ModalCancelar({ solicitacao, aoFechar, aoConfirmar }) {
  const [enviando, setEnviando] = useState(false);
  const [falhou, setFalhou] = useState(false);

  // Durante o envio, Esc e "Voltar" não fecham (o pedido já saiu)
  function fechar() {
    if (!enviando) aoFechar();
  }

  async function confirmar() {
    setEnviando(true);
    setFalhou(false);
    try {
      await aoConfirmar();
    } catch {
      setFalhou(true);
      setEnviando(false);
    }
  }

  return (
    <Modal
      aberto
      aoFechar={fechar}
      titulo={`Cancelar solicitação de ${solicitacao.servico.nome}?`}
      acoes={
        <>
          <Botao variante="secundario" onClick={fechar} desabilitado={enviando}>
            Voltar
          </Botao>
          <Botao variante="perigo" onClick={confirmar} carregando={enviando} textoCarregando="Cancelando...">
            Cancelar solicitação
          </Botao>
        </>
      }
    >
      <div className="minhas-solicitacoes__modal">
        <p>A universidade será avisada por e-mail e o atendimento volta para o seu limite do mês.</p>
        {falhou && <Aviso tipo="erro" titulo="Não foi possível cancelar. Tente novamente." />}
      </div>
    </Modal>
  );
}
