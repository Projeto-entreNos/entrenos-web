import Logo from '../Logo/Logo';
import './PainelMarca.css';

// Posição de cada cubo da decoração: [linha, coluna] numa grade de 4 linhas e 3 colunas
const CUBOS = [
  [1, 3],
  [2, 2],
  [2, 3],
  [3, 1],
  [3, 2],
  [3, 3],
  [4, 2],
  [4, 3],
];

// Painel azul à esquerda das telas de acesso (ativação de conta, login e recuperação de senha)
export default function PainelMarca({ titulo, texto }) {
  return (
    <div className="painel-marca">
      <div className="painel-marca__logo">
        <Logo fundo="escuro" tamanho="grande" />
      </div>

      <div className="painel-marca__mensagem">
        <p className="painel-marca__titulo">{titulo}</p>
        {texto && <p className="painel-marca__texto">{texto}</p>}
      </div>

      <div className="painel-marca__cubos" aria-hidden="true">
        {CUBOS.map(([linha, coluna]) => (
          <span
            key={`${linha}-${coluna}`}
            className="painel-marca__cubo"
            style={{ gridRow: linha, gridColumn: coluna }}
          />
        ))}
      </div>
    </div>
  );
}
