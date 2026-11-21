import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import NavbarLogada from '../../components/NavbarLogada/NavbarLogada';
import { useAuth } from '../../context/AuthContext';
import '../layouts.css';

// Usado só dentro de <RotaProtegida>: sempre há usuário logado
export default function LayoutLogado() {
  const { usuario, logout } = useAuth();
  const navegar = useNavigate();
  const { pathname } = useLocation();

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
