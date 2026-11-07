import './Carregando.css';

/**
 * Esqueleto de carregamento (formas cinza no lugar do conteúdo).
 * - tipo: "card" (para listas de cards) | "linha" (para tabelas)
 * É só visual (aria-hidden). Use junto com um texto de status,
 * por exemplo: <Carregando /> ou um <span role="status"> escondido.
 */
export default function Esqueleto({ tipo = 'card' }) {
  if (tipo === 'linha') {
    return (
      <div className="esqueleto esqueleto--linha" aria-hidden="true">
        <span className="esqueleto__barra" />
        <span className="esqueleto__barra" />
        <span className="esqueleto__barra" />
        <span className="esqueleto__barra" />
      </div>
    );
  }

  return (
    <div className="esqueleto esqueleto--card" aria-hidden="true">
      <span className="esqueleto__circulo" />
      <span className="esqueleto__barra esqueleto__barra--titulo" />
      <span className="esqueleto__barra esqueleto__barra--curta" />
      <span className="esqueleto__barra esqueleto__barra--longa" />
      <span className="esqueleto__barra esqueleto__barra--media" />
      <span className="esqueleto__botao" />
    </div>
  );
}
