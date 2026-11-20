import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import { useAuth } from '../../context/AuthContext';
import { paginaInicial } from '../../rotas/paginaInicial';

// Só aparece em desenvolvimento (npm run dev): fica fora do build de produção.
// Usuários de teste (senha de todos: teste123): na API, os do database/04_senhas_teste.sql;
// no modo mock, os de mocks/usuarios.js
const PERFIS_TESTE = [
  { perfil: 'colaborador', rotulo: 'Entrar como colaborador', email: 'colaborador@teste.entrenos' },
  { perfil: 'empresa', rotulo: 'Entrar como empresa', email: 'empresa@teste.entrenos' },
  { perfil: 'admin', rotulo: 'Entrar como admin', email: 'admin@teste.entrenos' },
];

export default function AtalhosTeste() {
  const { login } = useAuth();
  const navegar = useNavigate();
  const local = useLocation();
  const [carregandoPerfil, setCarregandoPerfil] = useState(null);
  const [erro, setErro] = useState('');

  async function entrarComo(email, perfil) {
    setErro('');
    setCarregandoPerfil(perfil);
    try {
      const usuario = await login(email, 'teste123');
      navegar(local.state?.de || paginaInicial(usuario.perfil), { replace: true });
    } catch (falha) {
      setErro(falha.message);
      setCarregandoPerfil(null);
    }
  }

  return (
    <section className="login__atalhos" aria-labelledby="login-atalhos-titulo">
      <h2 id="login-atalhos-titulo" className="login__atalhos-titulo">
        Atalhos de teste (só em desenvolvimento)
      </h2>

      <div aria-live="polite">{erro && <Aviso tipo="erro" titulo={erro} />}</div>

      <div className="login__atalhos-botoes">
        {PERFIS_TESTE.map((item) => (
          <Botao
            key={item.perfil}
            variante="secundario"
            carregando={carregandoPerfil === item.perfil}
            textoCarregando="Entrando..."
            desabilitado={carregandoPerfil !== null}
            onClick={() => entrarComo(item.email, item.perfil)}
          >
            {item.rotulo}
          </Botao>
        ))}
      </div>
    </section>
  );
}
