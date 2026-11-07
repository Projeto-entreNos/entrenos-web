import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import Card from '../../components/Card/Card';
import Logo from '../../components/Logo/Logo';
import { useAuth } from '../../context/AuthContext';
import { paginaInicial } from '../../rotas/paginaInicial';
import './Login.css';

/*
  PÁGINA TEMPORÁRIA, só para testar os perfis enquanto a tela de login não existe.
  Quem fizer a tela de verdade (Figma: "Login-Padrão") troca todo este arquivo.
  A tela nova deve usar: const { login } = useAuth(); await login(email, senha);
*/

// E-mails dos usuários de teste (senha de todos: teste123)
const PERFIS_TESTE = [
  { perfil: 'colaborador', rotulo: 'Entrar como colaborador', email: 'colaborador@teste.entrenos' },
  { perfil: 'empresa', rotulo: 'Entrar como empresa', email: 'empresa@teste.entrenos' },
  { perfil: 'admin', rotulo: 'Entrar como admin', email: 'admin@teste.entrenos' },
];

export default function Login() {
  const { usuario, login, logout } = useAuth();
  const navegar = useNavigate();
  const local = useLocation();
  const [carregandoPerfil, setCarregandoPerfil] = useState(null);
  const [erro, setErro] = useState('');

  async function entrarComo(email, perfil) {
    setErro('');
    setCarregandoPerfil(perfil);
    try {
      const usuarioLogado = await login(email, 'teste123');
      // Volta para a página que a pessoa tentou abrir, ou vai para a inicial do perfil
      navegar(local.state?.de || paginaInicial(usuarioLogado.perfil), { replace: true });
    } catch (falha) {
      setErro(falha.message);
      setCarregandoPerfil(null);
    }
  }

  return (
    <main className="login-temporario">
      <Card className="login-temporario__card">
        <Logo fundo="claro" />
        <h1 className="login-temporario__titulo">Entrar (teste)</h1>
        <p>Página temporária para testar os três perfis. A tela de login de verdade ainda vai ser feita.</p>

        {usuario && (
          <Aviso tipo="informacao" titulo={`Você já está conectado como ${usuario.nome}`}>
            Perfil: {usuario.perfil}.{' '}
            <button type="button" className="login-temporario__link" onClick={logout}>
              Sair
            </button>
          </Aviso>
        )}

        {/* aria-live: o leitor de tela anuncia o erro assim que ele aparece */}
        <div aria-live="polite">{erro && <Aviso tipo="erro" titulo={erro} />}</div>

        <div className="login-temporario__botoes">
          {PERFIS_TESTE.map((item) => (
            <Botao
              key={item.perfil}
              variante="secundario"
              larguraTotal
              carregando={carregandoPerfil === item.perfil}
              textoCarregando="Entrando..."
              desabilitado={carregandoPerfil !== null}
              onClick={() => entrarComo(item.email, item.perfil)}
            >
              {item.rotulo}
            </Botao>
          ))}
        </div>
      </Card>
    </main>
  );
}
