import { useState } from 'react';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import Modal from '../../components/Modal/Modal';

/**
 * Confirmação da remoção (Figma: Empresa-Modal Confirmar remoção).
 * - colaborador: quem será removido
 * - aoFechar: fecha sem remover
 * - aoConfirmar: função async; se falhar, o modal continua aberto com o aviso de erro
 */
export default function ModalRemover({ colaborador, aoFechar, aoConfirmar }) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const quem = colaborador.nome || colaborador.email;
  const ativo = colaborador.status === 'Ativo';
  const textoBotao = ativo ? 'Remover acesso' : 'Remover';

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
      titulo={ativo ? `Remover acesso de ${quem}?` : `Remover ${quem}?`}
      acoes={
        <>
          <Botao variante="secundario" onClick={fechar} desabilitado={enviando}>
            Cancelar
          </Botao>
          <Botao variante="perigo" onClick={confirmar} carregando={enviando} textoCarregando="Removendo...">
            {textoBotao}
          </Botao>
        </>
      }
    >
      <div className="empresa__modal">
        <p>
          {quem} perderá o acesso aos benefícios e a vaga voltará a ficar disponível. Solicitações em
          aberto desta pessoa serão canceladas. Essa ação não pode ser desfeita.
        </p>
        {erro && (
          <Aviso tipo="erro" titulo="Não foi possível remover. Tente novamente.">
            {erro}
          </Aviso>
        )}
      </div>
    </Modal>
  );
}
