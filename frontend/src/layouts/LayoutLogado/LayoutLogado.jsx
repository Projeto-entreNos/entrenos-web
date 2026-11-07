import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import NavbarLogada from '../../components/NavbarLogada/NavbarLogada';
import { useAuth } from '../../context/AuthContext';
import '../layouts.css';

/**
 * Layout das telas logadas: navbar escura com o menu do perfil + conteúdo
 * com a largura da grade do Figma (1220 px).
 * Só é usado dentro de <RotaProtegida>, então sempre há usuário logado.
 */
export default function LayoutLogado() {
  const { usuario, logout } = useAuth();
  const navegar = useNavigate();
  const { pathname } = useLocation();

  // Ao trocar de tela, volta ao topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  function sair() {
    logout();
    navegar('/login');
  }

  return (
    <>
      <a href="#conteudo" className="pular-para-conteudo">
        Pular para o conteúdo
      </a>
      <NavbarLogada usuario={usuario} aoSair={sair} />
      <main id="conteudo" className="container layout-logado__conteudo">
        <Outlet />
      </main>
    </>
  );
}
