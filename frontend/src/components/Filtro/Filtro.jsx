import './Filtro.css';

/**
 * Filtro em pílulas (ex.: categorias na tela de Benefícios).
 * - rotulo: descreve o grupo para leitores de tela (ex.: "Filtrar por categoria")
 * - opcoes: [{ valor: 'todos', rotulo: 'Todos' }, ...]
 * - valor: valor selecionado agora
 * - aoMudar: função chamada com o novo valor
 * Cada pílula é um botão com aria-pressed (ligado/desligado).
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
