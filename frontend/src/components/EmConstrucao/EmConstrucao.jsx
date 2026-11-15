import Aviso from '../Aviso/Aviso';
import './EmConstrucao.css';

/**
 * Marcador de tela ainda não implementada.
 * - comMargem: para telas fora do LayoutLogado (landing, ativação)
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
