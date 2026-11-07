import Aviso from '../Aviso/Aviso';
import './EmConstrucao.css';

/**
 * Espaço reservado para telas que ainda não foram feitas.
 * Quem for fazer a tela troca o conteúdo do index.jsx da pasta dela
 * (em src/pages/<NomeDaTela>) e apaga o uso deste componente.
 *
 * - comMargem: use em telas que não estão no LayoutLogado (landing, ativação),
 *   para o texto não ficar colado na borda da janela.
 */
export default function EmConstrucao({ nome, rota, comMargem = false }) {
  const conteudo = (
    <section className="em-construcao">
      <h1>{nome}</h1>
      <Aviso tipo="informacao" titulo="Tela em construção">
        Esta tela ainda vai ser feita. Rota: <code>{rota}</code>
      </Aviso>
    </section>
  );

  if (!comMargem) return conteudo;

  return <div className="container em-construcao__margem">{conteudo}</div>;
}
