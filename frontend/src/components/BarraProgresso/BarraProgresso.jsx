import './BarraProgresso.css';

/**
 * Barra de progresso com legenda e porcentagem.
 * - valor: número de 0 a 100
 * - legenda: texto à esquerda (também usado como nome acessível)
 */
export default function BarraProgresso({ valor = 0, legenda }) {
  // Garante que o valor fique entre 0 e 100
  const porcentagem = Math.min(100, Math.max(0, Math.round(valor)));

  return (
    <div className="barra-progresso">
      <div className="barra-progresso__textos" aria-hidden="true">
        <span className="barra-progresso__legenda">{legenda}</span>
        <span className="barra-progresso__valor">{porcentagem}%</span>
      </div>
      <div
        className="barra-progresso__trilha"
        role="progressbar"
        aria-label={legenda}
        aria-valuenow={porcentagem}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="barra-progresso__preenchimento" style={{ width: `${porcentagem}%` }} />
      </div>
    </div>
  );
}
