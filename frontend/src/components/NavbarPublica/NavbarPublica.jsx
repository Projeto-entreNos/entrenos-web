import { Link } from 'react-router-dom';
import Botao from '../Botao/Botao';
import Logo from '../Logo/Logo';
import './NavbarPublica.css';

// Seções da landing. O "id" precisa ser igual ao id da <section> na landing.
const SECOES = [
  { id: 'inicio', rotulo: 'Início' },
  { id: 'empresas', rotulo: 'Empresas' },
  { id: 'como-funciona', rotulo: 'Como funciona' },
  { id: 'pacotes', rotulo: 'Pacotes' },
  { id: 'contato', rotulo: 'Contate-nos' },
];

/**
 * Navbar da landing (Figma: "header"). Fundo claro fixo e só o botão "Entrar".
 * Os links levam para "/#secao": o LayoutPublico rola até a seção,
 * inclusive quando a pessoa está em outra página.
 */
export default function NavbarPublica() {
  return (
    <header className="navbar-publica">
      <div className="container navbar-publica__conteudo">
        <Link to="/" className="navbar-publica__logo" aria-label="EntreNós, página inicial">
          <Logo fundo="claro" tamanho="grande" />
        </Link>

        <nav aria-label="Seções da página">
          <ul className="navbar-publica__links">
            {SECOES.map((secao) => (
              <li key={secao.id}>
                <Link to={{ pathname: '/', hash: `#${secao.id}` }} className="navbar-publica__link">
                  {secao.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Botao variante="principal" tamanho="grande" para="/login">
          Entrar
        </Botao>
      </div>
    </header>
  );
}
