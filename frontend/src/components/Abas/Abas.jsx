import { useId, useRef, useState } from 'react';
import './Abas.css';

/**
 * - abas: [{ id, rotulo, conteudo }]
 * - abaInicial: id da aba aberta no início (padrão: a primeira)
 */
export default function Abas({ abas, abaInicial, aoMudar, rotulo }) {
  const prefixo = useId();
  const [ativa, setAtiva] = useState(abaInicial || abas[0]?.id);
  const refsBotoes = useRef([]);

  function selecionar(indice) {
    const aba = abas[indice];
    setAtiva(aba.id);
    refsBotoes.current[indice]?.focus();
    if (aoMudar) aoMudar(aba.id);
  }

  function aoPressionarTecla(evento, indice) {
    const ultimo = abas.length - 1;
    let proximo = null;

    if (evento.key === 'ArrowRight') proximo = indice === ultimo ? 0 : indice + 1;
    if (evento.key === 'ArrowLeft') proximo = indice === 0 ? ultimo : indice - 1;
    if (evento.key === 'Home') proximo = 0;
    if (evento.key === 'End') proximo = ultimo;

    if (proximo !== null) {
      evento.preventDefault();
      selecionar(proximo);
    }
  }

  const abaAtual = abas.find((aba) => aba.id === ativa);

  return (
    <div className="abas">
      <div role="tablist" aria-label={rotulo} className="abas__lista">
        {abas.map((aba, indice) => {
          const selecionada = aba.id === ativa;
          return (
            <button
              key={aba.id}
              ref={(elemento) => (refsBotoes.current[indice] = elemento)}
              type="button"
              role="tab"
              id={`${prefixo}-aba-${aba.id}`}
              aria-selected={selecionada}
              aria-controls={`${prefixo}-painel-${aba.id}`}
              // Só a aba ativa entra no Tab; as outras são alcançadas pelas setas
              tabIndex={selecionada ? 0 : -1}
              className="abas__aba"
              onClick={() => selecionar(indice)}
              onKeyDown={(evento) => aoPressionarTecla(evento, indice)}
            >
              {aba.rotulo}
            </button>
          );
        })}
      </div>

      {abaAtual && (
        <div
          role="tabpanel"
          id={`${prefixo}-painel-${abaAtual.id}`}
          aria-labelledby={`${prefixo}-aba-${abaAtual.id}`}
          tabIndex={0}
          className="abas__painel"
        >
          {abaAtual.conteudo}
        </div>
      )}
    </div>
  );
}
