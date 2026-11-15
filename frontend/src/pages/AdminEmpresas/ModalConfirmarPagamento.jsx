import { useState } from 'react';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import Modal from '../../components/Modal/Modal';

// aoConfirmar é async; se falhar, o modal continua aberto com o aviso de erro
export default function ModalConfirmarPagamento({ empresa, aoFechar, aoConfirmar }) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  // Nomes como "Beta Exemplo Comércio S.A." já terminam com ponto
  const nome = empresa.nome.endsWith('.') ? empresa.nome : `${empresa.nome}.`;

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
      titulo="Confirmar pagamento"
      acoes={
        <>
          <Botao variante="secundario" onClick={fechar} desabilitado={enviando}>
            Cancelar
          </Botao>
          <Botao onClick={confirmar} carregando={enviando} textoCarregando="Confirmando...">
            Confirmar pagamento
          </Botao>
        </>
      }
    >
      <div className="admin-empresas__formulario">
        <p>{nome} O status passará para Ativo e a empresa poderá convidar colaboradores.</p>
        {erro && (
          <Aviso tipo="erro" titulo="Não foi possível confirmar o pagamento">
            {erro} Tente novamente.
          </Aviso>
        )}
      </div>
    </Modal>
  );
}
