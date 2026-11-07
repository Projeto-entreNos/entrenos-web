import { useEffect, useRef, useState } from 'react';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import Card from '../../components/Card/Card';
import ModalSolicitar from './ModalSolicitar';

/**
 * Cartão lateral: resumo do serviço, atendimentos do mês e o botão "Solicitar".
 * Ordem de prioridade do botão: serviço indisponível (Sem vagas/Pausado),
 * solicitação em andamento, limite do mês atingido e, por fim, habilitado.
 */
export default function CartaoResumo({ servico, empresa, atendimentosUsados, solicitacaoAberta, aoEnviar }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [enviada, setEnviada] = useState(false);
  const refSucesso = useRef(null);

  const limite = empresa.pacote.limiteAtendimentosMes;
  const indisponivel = servico.status !== 'Ativo';
  const emAndamento = !indisponivel && Boolean(solicitacaoAberta);
  const limiteAtingido = !indisponivel && !emAndamento && atendimentosUsados >= limite;
  const podeSolicitar = !indisponivel && !emAndamento && !limiteAtingido;

  async function enviar(mensagem) {
    await aoEnviar(mensagem);
    setEnviada(true);
    setModalAberto(false);
  }

  // Depois do envio o botão fica desabilitado e não pode receber o foco de volta,
  // então o foco vai para a mensagem de sucesso
  useEffect(() => {
    if (enviada && !modalAberto) refSucesso.current?.focus();
  }, [enviada, modalAberto]);

  return (
    <Card como="section" className="detalhe__card" aria-labelledby="titulo-resumo">
      <h2 id="titulo-resumo" className="detalhe__card-titulo">
        Resumo
      </h2>

      <dl className="detalhe__lista">
        <div>
          <dt>Serviço</dt>
          <dd>{servico.nome}</dd>
        </div>
        <div>
          <dt>Universidade</dt>
          <dd>{servico.universidade.nome}</dd>
        </div>
        <div>
          <dt>Custo</dt>
          <dd>Incluído no seu pacote</dd>
        </div>
        <div>
          <dt>Atendimentos este mês</dt>
          <dd>
            {atendimentosUsados} de {limite} do Pacote {empresa.pacote.nome}
          </dd>
        </div>
      </dl>

      {/* Região sempre presente para o leitor de tela anunciar o sucesso */}
      <div aria-live="polite" className="detalhe__regiao-viva">
        {enviada && (
          <div ref={refSucesso} tabIndex={-1} className="detalhe__sucesso">
            <Aviso tipo="sucesso" titulo="Solicitação enviada">
              A universidade recebeu seu pedido por e-mail e vai entrar em contato.
            </Aviso>
          </div>
        )}
      </div>

      {limiteAtingido && (
        <Aviso tipo="aviso" titulo="Limite do mês atingido">
          Você usou os atendimentos deste mês. Eles renovam no dia 1º.
        </Aviso>
      )}

      <Botao larguraTotal desabilitado={!podeSolicitar} onClick={() => setModalAberto(true)}>
        {emAndamento ? 'Solicitação em andamento' : 'Solicitar este serviço'}
      </Botao>

      {emAndamento && (
        <Botao variante="texto" tamanho="grande" larguraTotal para="/minhas-solicitacoes">
          Ver minhas solicitações
        </Botao>
      )}

      <ModalSolicitar aberto={modalAberto} aoFechar={() => setModalAberto(false)} aoEnviar={enviar} />
    </Card>
  );
}
