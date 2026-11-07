import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paginaInicial } from './paginaInicial';

/**
 * Protege um grupo de rotas.
 * - perfis: perfis que podem entrar (ex.: ['colaborador'])
 *
 * Sem login: vai para /login (guardando a página que a pessoa tentou abrir).
 * Perfil sem permissão: vai para a página inicial do próprio perfil.
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

  // Outlet mostra a rota filha (o layout e a tela)
  return <Outlet />;
}
