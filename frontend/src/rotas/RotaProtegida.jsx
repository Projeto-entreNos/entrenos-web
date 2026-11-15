import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paginaInicial } from './paginaInicial';

/*
  Sem login, redireciona para /login guardando a página pedida.
  Perfil sem permissão, redireciona para a página inicial do próprio perfil.
*/
export default function RotaProtegida({ perfis }) {
  const { usuario } = useAuth();
  const local = useLocation();

  if (!usuario) {
    return <Navigate to="/login" replace state={{ de: local.pathname }} />;
  }

  if (perfis && !perfis.includes(usuario.perfil)) {
    return <Navigate to={paginaInicial(usuario.perfil)} replace />;
  }

  return <Outlet />;
}
