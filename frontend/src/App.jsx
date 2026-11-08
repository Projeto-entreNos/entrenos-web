import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Carregando from './components/Carregando/Carregando';
import LayoutLogado from './layouts/LayoutLogado/LayoutLogado';
import LayoutPublico from './layouts/LayoutPublico/LayoutPublico';
import AdminEmpresas from './pages/AdminEmpresas';
import AdminServicos from './pages/AdminServicos';
import AdminSolicitacoes from './pages/AdminSolicitacoes';
import AtivarConta from './pages/AtivarConta';
import Beneficios from './pages/Beneficios';
import DetalheServico from './pages/DetalheServico';
import Empresa from './pages/Empresa';
import Landing from './pages/Landing';
import Login from './pages/Login';
import MinhasSolicitacoes from './pages/MinhasSolicitacoes';
import NaoEncontrada from './pages/NaoEncontrada';
import RotaProtegida from './rotas/RotaProtegida';

// Vitrine de componentes: só em desenvolvimento, fora do build de produção.
const Componentes = import.meta.env.DEV ? lazy(() => import('./pages/Componentes')) : null;

export default function App() {
  return (
    <Routes>
      {/* Públicas com a navbar da landing */}
      <Route element={<LayoutPublico />}>
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Route>

      {/* Públicas sem navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/ativar/:token" element={<AtivarConta />} />

      {/* Colaborador */}
      <Route element={<RotaProtegida perfis={['colaborador']} />}>
        <Route element={<LayoutLogado />}>
          <Route path="/beneficios" element={<Beneficios />} />
          <Route path="/servicos/:id" element={<DetalheServico />} />
          <Route path="/minhas-solicitacoes" element={<MinhasSolicitacoes />} />
        </Route>
      </Route>

      {/* Empresa */}
      <Route element={<RotaProtegida perfis={['empresa']} />}>
        <Route element={<LayoutLogado />}>
          <Route path="/empresa" element={<Empresa />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<RotaProtegida perfis={['admin']} />}>
        <Route element={<LayoutLogado />}>
          <Route path="/admin/empresas" element={<AdminEmpresas />} />
          <Route path="/admin/servicos" element={<AdminServicos />} />
          <Route path="/admin/solicitacoes" element={<AdminSolicitacoes />} />
        </Route>
      </Route>

      {Componentes && (
        <Route
          path="/componentes"
          element={
            <Suspense fallback={<Carregando />}>
              <Componentes />
            </Suspense>
          }
        />
      )}
    </Routes>
  );
}
