import { useState } from 'react';
import CardServico from '../../components/Card/CardServico';
import EstadoVazio from '../../components/EstadoVazio/EstadoVazio';
import Filtro from '../../components/Filtro/Filtro';
import SelosDoServico from './SelosDoServico';

const TODOS = 'todos';

// Ordem das categorias na landing. Categoria fora desta lista vai para o fim, em ordem alfabética.
const ORDEM_CATEGORIAS = [
  'Apoio contábil e financeiro',
  'Consultoria em gestão e negócios',
  'Apoio educacional e idiomas',
  'Capacitação em tecnologia básica',
  'Assessoria jurídica',
];

function posicao(categoria) {
  const indice = ORDEM_CATEGORIAS.indexOf(categoria);
  return indice === -1 ? ORDEM_CATEGORIAS.length : indice;
}

// Só aparecem pílulas das categorias que têm serviços
export default function ListaServicos({ servicos }) {
  const [categoria, setCategoria] = useState(TODOS);

  const categorias = [...new Set(servicos.map((servico) => servico.categoria))].sort(
    (a, b) => posicao(a) - posicao(b) || a.localeCompare(b, 'pt-BR')
  );
  const opcoes = [
    { valor: TODOS, rotulo: 'Todos' },
    ...categorias.map((nome) => ({ valor: nome, rotulo: nome })),
  ];

  const visiveis =
    categoria === TODOS ? servicos : servicos.filter((servico) => servico.categoria === categoria);

  return (
    <section className="beneficios__lista" aria-labelledby="titulo-lista">
      <h2 id="titulo-lista">Todos os serviços do seu pacote</h2>

      <Filtro rotulo="Filtrar por categoria" opcoes={opcoes} valor={categoria} aoMudar={setCategoria} />

      {visiveis.length === 0 ? (
        <EstadoVazio
          titulo="Nenhum serviço nesta categoria"
          texto="Escolha outra categoria ou veja todos os serviços do seu pacote."
        />
      ) : (
        <div className="beneficios__grade">
          {visiveis.map((servico) => (
            <CardServico
              key={servico.id}
              categoria={servico.categoria}
              titulo={servico.nome}
              universidade={servico.universidade.nome}
              descricao={servico.descricaoCurta}
              seloStatus={<SelosDoServico servico={servico} />}
              para={`/servicos/${servico.id}`}
              textoBotao="Ver serviço"
            />
          ))}
        </div>
      )}
    </section>
  );
}
