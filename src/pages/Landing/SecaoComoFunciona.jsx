import Botao from '../../components/Botao/Botao';
import Icone from '../../components/Icone/Icone';
import Selo from '../../components/Selo/Selo';

// Vitrine fixa da landing: exemplos do catálogo, um por categoria (o catálogo completo fica em Benefícios)
const EXEMPLOS_CATALOGO = [
  { icone: 'carteira', fundo: 'folha', nome: 'Educação financeira', unidade: 'Núcleo de Apoio Contábil e Fiscal' },
  { icone: 'maleta', fundo: 'esmeralda', nome: 'Consultoria de negócios', unidade: 'Curso de Administração' },
  { icone: 'idiomas', fundo: 'folha', nome: 'Idiomas e reforço escolar', unidade: 'Licenciaturas e Letras' },
  { icone: 'monitor', fundo: 'esmeralda', nome: 'Informática e planilhas', unidade: 'Cursos de Tecnologia' },
  { icone: 'balanca', fundo: 'folha', nome: 'Assessoria jurídica', unidade: 'Núcleo de Prática Jurídica' },
];

const PASSOS = [
  {
    titulo: 'Conte o que sua empresa precisa',
    texto: 'Fale com o nosso time sobre o tamanho da equipe e os benefícios que quer oferecer.',
  },
  {
    titulo: 'Receba a proposta',
    texto: 'Indicamos o pacote e os serviços de acordo com o tamanho da sua equipe.',
  },
  {
    titulo: 'Sua equipe começa a usar',
    texto: 'Os colaboradores agendam atendimentos pela plataforma, com acompanhamento do nosso time.',
  },
];

export default function SecaoComoFunciona() {
  return (
    <section id="como-funciona" className="landing-secao" aria-labelledby="landing-como-funciona-titulo">
      <div className="container landing-como-funciona">
        <div className="landing-catalogo">
          <p className="landing__sobretitulo landing__sobretitulo--sobre-escuro">Catálogo EntreNós</p>
          {/* Parágrafo, não título: o painel vem antes do h2 da seção e não deve quebrar a ordem dos títulos */}
          <p className="landing-catalogo__titulo">Serviços disponíveis para a sua equipe</p>
          <ul className="landing-catalogo__lista">
            {EXEMPLOS_CATALOGO.map((servico) => (
              <li key={servico.nome} className="landing-catalogo__servico">
                <span className={`landing-catalogo__icone landing-catalogo__icone--${servico.fundo}`}>
                  <Icone nome={servico.icone} tamanho={24} />
                </span>
                <span className="landing-catalogo__textos">
                  <span className="landing-catalogo__nome">{servico.nome}</span>
                  <span className="landing-catalogo__unidade">{servico.unidade}</span>
                </span>
                <Selo tipo="sucesso">Disponível</Selo>
              </li>
            ))}
          </ul>
        </div>

        <div className="landing-como-funciona__conteudo">
          <p className="landing__sobretitulo">Para empresas</p>
          <h2 id="landing-como-funciona-titulo" className="landing__titulo">
            Como funciona para a <span className="landing__destaque">sua empresa</span>
          </h2>
          <p className="landing__texto-grande">Do primeiro contato ao primeiro atendimento, são três etapas.</p>

          <ol className="landing-passos">
            {PASSOS.map((passo, indice) => (
              <li key={passo.titulo} className="landing-passos__item">
                <span className="landing-passos__numero" aria-hidden="true">
                  {indice + 1}
                </span>
                <div className="landing-passos__textos">
                  <h3 className="landing-passos__titulo">{passo.titulo}</h3>
                  <p className="landing-passos__texto">{passo.texto}</p>
                </div>
              </li>
            ))}
          </ol>

          <Botao tamanho="grande" para="/#contato">
            Solicitar proposta
          </Botao>
        </div>
      </div>
    </section>
  );
}
