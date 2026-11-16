import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icone from '../Icone/Icone';
import './Modal.css';

const SELETOR_FOCAVEIS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/*
  aoFechar é chamado no Esc, no clique no fundo e no botão X.
  Enquanto aberto, o foco fica preso no modal; ao fechar, volta para quem o abriu.
  largura: "normal" (560 px) | "grande" (760 px, para formulários em duas colunas)
  posicao: "centro" | "lateral" (painel de 480 px, à direita e na altura toda da tela; ignora a largura)
*/
export default function Modal({ aberto, aoFechar, titulo, children, acoes, largura = 'normal', posicao = 'centro' }) {
  const idTitulo = useId();
  const refCaixa = useRef(null);

  // Ref com a versão mais recente de aoFechar: o efeito não roda de novo a cada renderização do pai
  const refAoFechar = useRef(aoFechar);
  useEffect(() => {
    refAoFechar.current = aoFechar;
  });

  useEffect(() => {
    if (!aberto) return;

    const quemAbriu = document.activeElement;
    const caixa = refCaixa.current;

    const focaveis = caixa.querySelectorAll(SELETOR_FOCAVEIS);
    (focaveis[0] || caixa).focus();

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function aoPressionarTecla(evento) {
      if (evento.key === 'Escape') {
        refAoFechar.current();
        return;
      }

      if (evento.key === 'Tab') {
        const lista = caixa.querySelectorAll(SELETOR_FOCAVEIS);
        if (lista.length === 0) {
          evento.preventDefault();
          return;
        }
        const primeiro = lista[0];
        const ultimo = lista[lista.length - 1];

        if (evento.shiftKey && document.activeElement === primeiro) {
          evento.preventDefault();
          ultimo.focus();
        } else if (!evento.shiftKey && document.activeElement === ultimo) {
          evento.preventDefault();
          primeiro.focus();
        }
      }
    }

    document.addEventListener('keydown', aoPressionarTecla);

    return () => {
      document.removeEventListener('keydown', aoPressionarTecla);
      document.body.style.overflow = overflowAnterior;
      if (quemAbriu && quemAbriu.focus) quemAbriu.focus();
    };
  }, [aberto]);

  if (!aberto) return null;

  const lateral = posicao === 'lateral';
  let classeCaixa = 'modal';
  if (lateral) classeCaixa = 'modal modal--lateral';
  else if (largura === 'grande') classeCaixa = 'modal modal--grande';

  // Só fecha quando o clique começa no próprio fundo, não dentro da caixa
  function aoClicarNoFundo(evento) {
    if (evento.target === evento.currentTarget) aoFechar();
  }

  return createPortal(
    <div className={lateral ? 'modal__fundo modal__fundo--lateral' : 'modal__fundo'} onMouseDown={aoClicarNoFundo}>
      <div
        ref={refCaixa}
        className={classeCaixa}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        tabIndex={-1}
      >
        <div className="modal__cabecalho">
          <h2 id={idTitulo} className="modal__titulo">
            {titulo}
          </h2>
          <button type="button" className="modal__fechar" onClick={aoFechar} aria-label="Fechar">
            <Icone nome="fechar" tamanho={24} />
          </button>
        </div>

        <div className="modal__conteudo">{children}</div>

        {acoes && <div className="modal__acoes">{acoes}</div>}
      </div>
    </div>,
    document.body
  );
}
