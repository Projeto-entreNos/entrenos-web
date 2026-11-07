import './Tabela.css';

/**
 * Tabela (Figma: "Linha de tabela", cabeçalho e dados).
 *
 * - legenda: descreve a tabela para leitores de tela (fica escondida na tela)
 * - colunas: [{ chave: 'nome', titulo: 'Nome', alinhar: 'direita', renderizar: (linha) => ... }]
 *     "renderizar" é opcional: use para mostrar um Selo, um botão etc.
 *     Sem ele, a célula mostra linha[chave].
 * - linhas: array de objetos, cada um com um "id"
 */
export default function Tabela({ legenda, colunas, linhas }) {
  return (
    <div className="tabela__moldura">
      <table className="tabela">
        <caption className="somente-leitor-tela">{legenda}</caption>
        <thead>
          <tr>
            {colunas.map((coluna) => (
              <th
                key={coluna.chave}
                scope="col"
                className={coluna.alinhar === 'direita' ? 'tabela__celula--direita' : undefined}
              >
                {coluna.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha) => (
            <tr key={linha.id}>
              {colunas.map((coluna) => (
                <td
                  key={coluna.chave}
                  className={coluna.alinhar === 'direita' ? 'tabela__celula--direita' : undefined}
                >
                  {coluna.renderizar ? coluna.renderizar(linha) : linha[coluna.chave]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
