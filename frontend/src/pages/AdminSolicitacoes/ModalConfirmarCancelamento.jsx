import { useState } from 'react';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import Modal from '../../components/Modal/Modal';

// aoConfirmar é async; se falhar, o modal continua aberto com o aviso de erro
export default function ModalConfirmarCancelamento({ solicitacao, aoFechar, aoConfirmar }) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  // Durante o envio, Esc e "Voltar" não fecham (o pedido já saiu)
  function fechar() {
    if (!enviando) aoFechar();
  }

  async function confirmar() {
    setEnviando(true);
    setErro('');
    try {
      await aoConfirmar();
    } catch (falha) {
      setErro(falha.message);
      setEnviando(false);
    }
  }

  return (
    <Modal
      aberto
      aoFechar={fechar}
      titulo={`Cancelar a solicitação de ${solicitacao.colaborador.nome}?`}
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
      <div className="admin-solicitacoes__confirmacao">
        <p>
          O pedido de {solicitacao.servico.nome} será cancelado e não poderá ser reaberto. O atendimento volta
          para o limite do mês do colaborador.
        </p>
        {erro && (
          <Aviso tipo="erro" titulo="Não foi possível cancelar">
            {erro} Tente novamente.
          </Aviso>
        )}
      </div>
    </Modal>
  );
}
