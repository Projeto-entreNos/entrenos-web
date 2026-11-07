import './EstadoVazio.css';

/*
  Mosaico de quadrados do Figma (ilustração padrão do estado vazio).
  Cada linha tem 3 posições; null = espaço vazio.
*/
const MOSAICO = [
  ['folha', 'esmeralda', 'azul'],
  [null, 'folha', 'esmeralda'],
];

function Mosaico() {
  return (
    <div className="estado-vazio__mosaico" aria-hidden="true">
      {MOSAICO.map((linha, i) =>
        linha.map((cor, j) => (
          <span
            key={`${i}-${j}`}
            className={cor ? `estado-vazio__quadrado estado-vazio__quadrado--${cor}` : 'estado-vazio__quadrado'}
          />
        ))
      )}
    </div>
  );
}

/**
 * Estado vazio de uma lista.
 * - titulo e texto: mensagens
 * - icone: ilustração opcional (sem ela, usa o mosaico do Figma)
 * - acao: botão opcional (ex.: <Botao variante="secundario">Voltar ao início</Botao>)
 */
export default function EstadoVazio({ titulo, texto, icone, acao }) {
  return (
    <div className="estado-vazio">
      {icone || <Mosaico />}
      <h3 className="estado-vazio__titulo">{titulo}</h3>
      {texto && <p className="estado-vazio__texto">{texto}</p>}
      {acao}
    </div>
  );
}
