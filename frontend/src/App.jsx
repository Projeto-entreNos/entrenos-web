import { Route, Routes } from 'react-router-dom';
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
import Privacidade from './pages/Privacidade';
import Termos from './pages/Termos';
import RotaProtegida from './rotas/RotaProtegida';

export default function App() {
  return (
    <Routes>
      <Route element={<LayoutPublico />}>
        <Route path="/" element={<Landing />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/ativar/:token" element={<AtivarConta />} />

      <Route element={<RotaProtegida perfis={['colaborador']} />}>
        <Route element={<LayoutLogado />}>
          <Route path="/beneficios" element={<Beneficios />} />
          <Route path="/servicos/:id" element={<DetalheServico />} />
          <Route path="/minhas-solicitacoes" element={<MinhasSolicitacoes />} />
        </Route>
      </Route>

      <Route element={<RotaProtegida perfis={['empresa']} />}>
        <Route element={<LayoutLogado />}>
          <Route path="/empresa" element={<Empresa />} />
        </Route>
      </Route>

      <Route element={<RotaProtegida perfis={['admin']} />}>
        <Route element={<LayoutLogado />}>
          <Route path="/admin/empresas" element={<AdminEmpresas />} />
          <Route path="/admin/servicos" element={<AdminServicos />} />
          <Route path="/admin/solicitacoes" element={<AdminSolicitacoes />} />
        </Route>
      </Route>
    </Routes>
  );
}
