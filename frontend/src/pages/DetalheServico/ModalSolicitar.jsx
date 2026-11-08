import { useId, useState } from 'react';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import CampoTextoLongo from '../../components/Campo/CampoTextoLongo';
import Modal from '../../components/Modal/Modal';

const LIMITE_MENSAGEM = 300;

// aoEnviar(mensagem) devolve uma Promise; se falhar, o modal continua aberto com o erro e a mensagem digitada
export default function ModalSolicitar({ aberto, aoFechar, aoEnviar }) {
  const idFormulario = useId();
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [falhou, setFalhou] = useState(false);

  function fechar() {
    if (enviando) return; // não fecha no meio do envio
    setMensagem('');
    setFalhou(false);
    aoFechar();
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setFalhou(false);
    try {
      await aoEnviar(mensagem);
      setMensagem('');
    } catch {
      setFalhou(true);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal
      aberto={aberto}
      aoFechar={fechar}
      titulo="Confirmar solicitação"
      acoes={
        <>
          <Botao variante="secundario" onClick={fechar} desabilitado={enviando}>
            Cancelar
          </Botao>
          <Botao tipo="submit" form={idFormulario} carregando={enviando}>
            Enviar solicitação
          </Botao>
        </>
      }
    >
      <form id={idFormulario} className="detalhe__formulario" onSubmit={enviar} noValidate>
        <p>A universidade receberá seu nome e e-mail corporativo para entrar em contato.</p>

        <CampoTextoLongo
          rotulo="Mensagem (opcional)"
          placeholder="Escreva uma mensagem para a universidade"
          ajuda="Não escreva diagnósticos ou detalhes de saúde. A universidade conversa com você diretamente."
          limite={LIMITE_MENSAGEM}
          value={mensagem}
          onChange={(evento) => setMensagem(evento.target.value)}
          desabilitado={enviando}
        />

        {falhou && <Aviso tipo="erro" titulo="Não foi possível enviar. Tente novamente." />}
      </form>
    </Modal>
  );
}
