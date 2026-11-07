import Aviso from '../../components/Aviso/Aviso';
import CardServico from '../../components/Card/CardServico';
import Esqueleto from '../../components/Carregando/Esqueleto';
import SelosDoServico from './SelosDoServico';

/**
 * Área do resultado da IA. Fica sempre na página (mesmo vazia) porque o
 * aria-live só anuncia mudanças em uma região que já existia antes.
 * - estado: "ocioso" | "buscando" | "resultado" | "sem-resultado" | "indisponivel"
 * - sugestoes: [{ servico, motivo }] já validadas
 */
export default function ResultadoIa({ estado, sugestoes, semBuscas }) {
  return (
    <div className="beneficios__resultado-ia" aria-live="polite" aria-busy={estado === 'buscando'}>
      {estado === 'buscando' && (
        <section className="beneficios__sugestoes">
          <h2>Buscando sugestões...</h2>
          <div className="beneficios__grade">
            <Esqueleto tipo="card" />
            <Esqueleto tipo="card" />
            <Esqueleto tipo="card" />
          </div>
        </section>
      )}

      {estado === 'resultado' && (
        <section className="beneficios__sugestoes">
          <h2>Sugestões para você</h2>
          <p className="beneficios__sugestoes-aviso">
            A IA pode errar. Confira os detalhes de cada serviço antes de solicitar.
          </p>
          <div className="beneficios__grade">
            {sugestoes.map(({ servico, motivo }) => (
              <CardServico
                key={servico.id}
                categoria={servico.categoria}
                titulo={servico.nome}
                universidade={servico.universidade.nome}
                descricao={servico.descricaoCurta}
                motivo={motivo}
                seloStatus={<SelosDoServico servico={servico} />}
                para={`/servicos/${servico.id}`}
                textoBotao="Ver serviço"
              />
            ))}
          </div>
        </section>
      )}

      {estado === 'sem-resultado' && (
        <Aviso tipo="informacao" titulo="Não encontramos sugestões para essa busca">
          Tente descrever de outro jeito ou use os filtros abaixo.
        </Aviso>
      )}

      {estado === 'indisponivel' && (
        <Aviso tipo="aviso" titulo="Busca com IA indisponível">
          Enquanto isso, use os filtros abaixo para encontrar serviços.
        </Aviso>
      )}

      {semBuscas && estado !== 'buscando' && (
        <Aviso tipo="aviso" titulo="Limite diário de buscas atingido">
          As 10 buscas diárias voltam amanhã. Até lá, use os filtros abaixo.
        </Aviso>
      )}
    </div>
  );
}
