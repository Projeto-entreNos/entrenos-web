import './Filtro.css';

/**
 * - rotulo: nome do grupo para leitores de tela
 * - opcoes: [{ valor, rotulo }]
 */
export default function Filtro({ rotulo, opcoes, valor, aoMudar }) {
  return (
    <div role="group" aria-label={rotulo} className="filtro">
      {opcoes.map((opcao) => {
        const ativa = opcao.valor === valor;
        return (
          <button
            key={opcao.valor}
            type="button"
            className="filtro__pilula"
            aria-pressed={ativa}
            onClick={() => aoMudar(opcao.valor)}
          >
            {opcao.rotulo}
          </button>
        );
      })}
    </div>
  );
}
