import { Link, NavLink } from 'react-router-dom';
import { paginaInicial } from '../../rotas/paginaInicial';
import Logo from '../Logo/Logo';
import './NavbarLogada.css';

// Cada perfil só vê o próprio menu
const MENU_POR_PERFIL = {
  colaborador: [
    { rotulo: 'Benefícios', para: '/beneficios' },
    { rotulo: 'Minhas solicitações', para: '/minhas-solicitacoes' },
  ],
  empresa: [{ rotulo: 'Colaboradores', para: '/empresa' }],
  admin: [
    { rotulo: 'Empresas', para: '/admin/empresas' },
    { rotulo: 'Serviços', para: '/admin/servicos' },
    { rotulo: 'Solicitações', para: '/admin/solicitacoes' },
  ],
};

export default function NavbarLogada({ usuario, aoSair }) {
  const itens = MENU_POR_PERFIL[usuario.perfil] || [];

  return (
    <header className="navbar-logada">
      <div className="container navbar-logada__conteudo">
        <div className="navbar-logada__esquerda">
          <Link
            to={paginaInicial(usuario.perfil)}
            className="navbar-logada__logo"
            aria-label="EntreNós, página inicial"
          >
            <Logo fundo="escuro" tamanho="grande" />
          </Link>

          <nav aria-label="Menu principal">
            <ul className="navbar-logada__menu">
              {itens.map((item) => (
                <li key={item.para}>
                  <NavLink
                    to={item.para}
                    className={({ isActive }) =>
                      isActive ? 'navbar-logada__item navbar-logada__item--ativo' : 'navbar-logada__item'
                    }
                  >
                    {item.rotulo}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="navbar-logada__direita">
          <span className="navbar-logada__nome">{usuario.nome}</span>
          <button type="button" className="navbar-logada__sair" onClick={aoSair}>
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
