import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icone from '../Icone/Icone';
import './Modal.css';

// Elementos que podem receber foco pelo Tab
const SELETOR_FOCAVEIS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal acessível.
 * - aberto: mostra ou esconde
 * - aoFechar: função chamada no Esc, no clique no fundo e no botão X
 * - titulo: título do modal (ligado ao aria-labelledby)
 * - children: conteúdo
 * - acoes: botões do rodapé (ex.: Cancelar e Confirmar)
 *
 * Comportamento: prende o foco dentro do modal e, ao fechar,
 * devolve o foco para o elemento que abriu.
 */
export default function Modal({ aberto, aoFechar, titulo, children, acoes }) {
  const idTitulo = useId();
  const refCaixa = useRef(null);

  // Guardamos a função mais recente em uma ref para o efeito abaixo
  // não rodar de novo a cada renderização do componente pai.
  const refAoFechar = useRef(aoFechar);
  useEffect(() => {
    refAoFechar.current = aoFechar;
  });

  useEffect(() => {
    if (!aberto) return;

    const quemAbriu = document.activeElement; // para devolver o foco depois
    const caixa = refCaixa.current;

    // Coloca o foco no primeiro elemento focável (ou na própria caixa)
    const focaveis = caixa.querySelectorAll(SELETOR_FOCAVEIS);
    (focaveis[0] || caixa).focus();

    // Impede a página de rolar por trás do modal
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function aoPressionarTecla(evento) {
      if (evento.key === 'Escape') {
        refAoFechar.current();
        return;
      }

      // Foco preso: Tab no último volta ao primeiro, Shift+Tab no primeiro vai ao último
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

    // Limpeza: roda quando o modal fecha
    return () => {
      document.removeEventListener('keydown', aoPressionarTecla);
      document.body.style.overflow = overflowAnterior;
      if (quemAbriu && quemAbriu.focus) quemAbriu.focus();
    };
  }, [aberto]);

  if (!aberto) return null;

  // Fecha só se o clique começou no próprio fundo (não dentro da caixa)
  function aoClicarNoFundo(evento) {
    if (evento.target === evento.currentTarget) aoFechar();
  }

  // createPortal coloca o modal no fim do <body>, por cima de tudo
  return createPortal(
    <div className="modal__fundo" onMouseDown={aoClicarNoFundo}>
      <div
        ref={refCaixa}
        className="modal"
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
