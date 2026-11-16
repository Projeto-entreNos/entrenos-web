import { useState } from 'react';
import Botao from '../../components/Botao/Botao';
import Campo from '../../components/Campo/Campo';
import CardServico from '../../components/Card/CardServico';
import EstadoVazio from '../../components/EstadoVazio/EstadoVazio';
import Filtro from '../../components/Filtro/Filtro';
import { combinaComBusca } from '../../utils/busca';
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

function plural(quantidade, singular, varios) {
  return quantidade === 1 ? singular : varios;
}

/*
  A busca filtra na própria tela, sem chamar a API: pelo nome, pela descrição curta,
  pela categoria e pela universidade. Ela se combina com o filtro de categoria.
  Só aparecem pílulas das categorias que têm serviços.
*/
export default function ListaServicos({ servicos }) {
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState(TODOS);

  const categorias = [...new Set(servicos.map((servico) => servico.categoria))].sort(
    (a, b) => posicao(a) - posicao(b) || a.localeCompare(b, 'pt-BR')
  );
  const opcoes = [
    { valor: TODOS, rotulo: 'Todos' },
    ...categorias.map((nome) => ({ valor: nome, rotulo: nome })),
  ];

  const visiveis = servicos.filter(
    (servico) =>
      (categoria === TODOS || servico.categoria === categoria) &&
      combinaComBusca(busca, [servico.nome, servico.descricaoCurta, servico.categoria, servico.universidade.nome])
  );
  const filtrando = busca.trim() !== '' || categoria !== TODOS;

  function limparBusca() {
    setBusca('');
    setCategoria(TODOS);
  }

  return (
    <section className="beneficios__lista" aria-labelledby="titulo-lista">
      <h2 id="titulo-lista">Todos os serviços do seu pacote</h2>

      <div className="beneficios__busca">
        <Campo
          rotulo="Buscar serviços"
          tipo="search"
          icone="busca"
          placeholder="Buscar por serviço, assunto ou universidade"
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
        />
      </div>

      <Filtro rotulo="Filtrar por categoria" opcoes={opcoes} valor={categoria} aoMudar={setCategoria} />

      {/* Anuncia o resultado para o leitor de tela, que não vê os cards mudarem */}
      <p className="somente-leitor-tela" role="status">
        {filtrando
          ? `${visiveis.length} ${plural(visiveis.length, 'serviço encontrado', 'serviços encontrados')}.`
          : ''}
      </p>

      {visiveis.length === 0 ? (
        <EstadoVazio
          titulo="Nenhum serviço encontrado"
          texto="Tente outras palavras ou escolha outra categoria."
          acao={
            <Botao variante="secundario" onClick={limparBusca}>
              Limpar busca
            </Botao>
          }
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
