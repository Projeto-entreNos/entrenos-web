import './Carregando.css';

/**
 * - tipo: "card" | "linha"
 * Só visual (aria-hidden): deve vir acompanhado de um texto com role="status".
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
