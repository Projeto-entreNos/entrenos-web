import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import Esqueleto from '../../components/Carregando/Esqueleto';
import Icone from '../../components/Icone/Icone';
import { listarPacotesPublicos } from '../../services/pacotes';

// Pacote com o selo "Mais escolhido" e o cartão escuro
const ID_PACOTE_DESTAQUE = 'completo';

function CartaoPacote({ pacote }) {
  const destaque = pacote.id === ID_PACOTE_DESTAQUE;

  return (
    <li className={`landing-pacote ${destaque ? 'landing-pacote--destaque' : ''}`}>
      <div className="landing-pacote__topo">
        <h3 className="landing-pacote__nome">{pacote.nome}</h3>
        {destaque && <span className="landing-pacote__selo">Mais escolhido</span>}
      </div>
      <p className="landing-pacote__descricao">{pacote.descricao}</p>
      <p className="landing-pacote__preco">
        <span className="landing-pacote__valor">R$ {pacote.precoPorColaborador}</span>
        <span className="landing-pacote__periodo">/colaborador por mês</span>
      </p>

      <ul className="landing-pacote__beneficios">
        {pacote.beneficios.map((beneficio) => (
          <li key={beneficio} className="landing-pacote__beneficio">
            <span className="landing-pacote__check">
              <Icone nome="sucesso" tamanho={14} />
            </span>
            {beneficio}
          </li>
        ))}
      </ul>

      <Botao variante={destaque ? 'principal' : 'secundario'} tamanho="grande" larguraTotal para="/#contato">
        Solicitar proposta
      </Botao>
    </li>
  );
}

export default function SecaoPacotes() {
  const [pacotes, setPacotes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0); // muda para carregar de novo

  useEffect(() => {
    // Evita atualizar a tela se a pessoa saiu dela antes da resposta chegar
    let ativo = true;

    listarPacotesPublicos()
      .then((resposta) => {
        if (!ativo) return;
        setPacotes(resposta);
        setErro('');
      })
      .catch((falha) => {
        if (ativo) setErro(falha.message);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [tentativa]);

  function tentarDeNovo() {
    setCarregando(true);
    setErro('');
    setTentativa((valor) => valor + 1);
  }

  let conteudo;
  if (carregando) {
    conteudo = (
      <div className="landing-pacotes__estado">
        <p role="status" className="somente-leitor-tela">
          Carregando os pacotes...
        </p>
        <div className="landing-pacotes__esqueletos">
          <Esqueleto />
          <Esqueleto />
        </div>
      </div>
    );
  } else if (erro) {
    conteudo = (
      <div className="landing-pacotes__estado">
        <Aviso tipo="erro" titulo="Não foi possível carregar os pacotes">
          Tente de novo ou fale com a gente pelo formulário abaixo.
        </Aviso>
        <Botao variante="secundario" onClick={tentarDeNovo}>
          Tentar novamente
        </Botao>
      </div>
    );
  } else if (pacotes.length === 0) {
    conteudo = (
      <div className="landing-pacotes__estado">
        <Aviso tipo="informacao" titulo="Os pacotes estão sendo atualizados">
          Fale com a gente pelo formulário abaixo para receber uma proposta.
        </Aviso>
      </div>
    );
  } else {
    conteudo = (
      <ul className="landing-pacotes__lista">
        {pacotes.map((pacote) => (
          <CartaoPacote key={pacote.id} pacote={pacote} />
        ))}
      </ul>
    );
  }

  return (
    <section id="pacotes" className="landing-secao landing-secao--clara" aria-labelledby="landing-pacotes-titulo">
      <div className="container landing-pacotes">
        <header className="landing-pacotes__cabecalho">
          <p className="landing__sobretitulo">Pacotes</p>
          <h2 id="landing-pacotes-titulo" className="landing__titulo">
            Dois pacotes, preço <span className="landing__destaque">por colaborador</span>
          </h2>
          <p className="landing__texto-grande">
            Você paga por colaborador, todo mês. Os dois pacotes dão acesso ao catálogo completo.
          </p>
        </header>

        <div aria-live="polite" className="landing-pacotes__conteudo">
          {conteudo}
        </div>

        <p className="landing-pacotes__nota">
          Precisa de algo diferente?{' '}
          <Link to={{ pathname: '/', hash: '#contato' }} className="landing-pacotes__link">
            Fale com a gente
          </Link>{' '}
          e montamos um pacote personalizado.
        </p>
      </div>
    </section>
  );
}
