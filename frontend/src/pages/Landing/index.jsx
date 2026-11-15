import Botao from '../../components/Botao/Botao';
import Card from '../../components/Card/Card';
import Icone from '../../components/Icone/Icone';
import imagemHero from '../../assets/hero-colaboradora.webp';
import SecaoComoFunciona from './SecaoComoFunciona';
import SecaoContato from './SecaoContato';
import SecaoPacotes from './SecaoPacotes';
import './Landing.css';

// Os ids das seções (inicio, empresas, como-funciona, pacotes, contato) são os mesmos da NavbarPublica

// Cubos da decoração do hero: [linha, coluna, cor]; os da linha 3 são mais altos
const CUBOS_HERO = [
  [1, 1, 'folha'],
  [1, 2, 'esmeralda'],
  [1, 3, 'folha'],
  [1, 4, 'esmeralda'],
  [2, 2, 'abissal'],
  [2, 3, 'esmeralda'],
  [2, 4, 'abissal'],
  [3, 2, 'esmeralda'],
  [3, 3, 'esmeralda'],
  [3, 4, 'folha'],
];

const VANTAGENS = [
  {
    icone: 'janela',
    titulo: 'Variedade de serviços',
    texto: 'Finanças, negócios, idiomas, tecnologia e assessoria jurídica no mesmo catálogo.',
  },
  {
    icone: 'pacote',
    titulo: 'Contratação simples',
    texto: 'Um único contrato com a EntreNós, sem negociar com cada universidade.',
  },
  {
    icone: 'moedas',
    titulo: 'Preço por colaborador',
    texto: 'A partir de R$ 29 por colaborador ao mês, no pacote Essencial.',
  },
];

export default function Landing() {
  return (
    <>
      <section id="inicio" className="landing-hero" aria-labelledby="landing-hero-titulo">
        <div className="container landing-hero__grade">
          <div className="landing-hero__textos">
            <h1 id="landing-hero-titulo" className="landing__titulo">
              Contrate serviços de alunos universitários, <span className="landing__destaque">Entre Nós.</span>
            </h1>
            <p className="landing-hero__subtitulo">
              Finanças, negócios, idiomas, tecnologia e assessoria jurídica para a sua equipe.{' '}
              <strong>Atendimento feito por alunos, com supervisão de professores.</strong>
            </p>
            <div className="landing-hero__botoes">
              <Botao tamanho="grande" para="/#contato">
                Solicitar proposta
              </Botao>
              <Botao variante="secundario" tamanho="grande" para="/#como-funciona">
                Como funciona?
              </Botao>
            </div>
          </div>

          <div className="landing-hero__figura">
            <div className="landing-hero__cubos" aria-hidden="true">
              {CUBOS_HERO.map(([linha, coluna, cor]) => (
                <span
                  key={`${linha}-${coluna}`}
                  className={`landing-hero__cubo landing-hero__cubo--${cor}`}
                  style={{ gridRow: linha, gridColumn: coluna }}
                />
              ))}
            </div>
            <img className="landing-hero__imagem" src={imagemHero} alt="" width="467" height="741" />
          </div>
        </div>
      </section>

      <section id="empresas" className="landing-secao landing-secao--clara" aria-labelledby="landing-vantagens-titulo">
        <div className="container landing-vantagens">
          <header className="landing-vantagens__cabecalho">
            <h2 id="landing-vantagens-titulo" className="landing__titulo">
              Por que as <span className="landing__destaque">empresas</span> escolhem o EntreNós?
            </h2>
            <p className="landing__texto-grande">
              Os atendimentos são feitos por alunos de universidades parceiras,{' '}
              <strong>com supervisão de professores</strong>.
            </p>
          </header>

          <ul className="landing-vantagens__lista">
            {VANTAGENS.map((vantagem) => (
              <li key={vantagem.titulo} className="landing-vantagens__item">
                <span className="landing-vantagens__icone">
                  <Icone nome={vantagem.icone} tamanho={40} />
                </span>
                <Card className="landing-vantagens__card">
                  <h3 className="landing-vantagens__titulo">{vantagem.titulo}</h3>
                  <p className="landing-vantagens__texto">{vantagem.texto}</p>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SecaoComoFunciona />
      <SecaoPacotes />
      <SecaoContato />
    </>
  );
}
