import { createContext, useContext, useState } from 'react';
import * as servicoAuth from '../services/auth';

/*
  A sessão fica no localStorage para sobreviver ao recarregamento da página.
  O localStorage pode falhar (aba anônima, bloqueio do navegador): todo acesso fica em try/catch.
*/

const CHAVE_SESSAO = 'entrenos:sessao';

const AuthContext = createContext(null);

function lerSessaoSalva() {
  try {
    const texto = localStorage.getItem(CHAVE_SESSAO);
    return texto ? JSON.parse(texto) : null;
  } catch {
    return null;
  }
}

function salvarSessao(sessao) {
  try {
    localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
  } catch {
    // Sem localStorage o login funciona só até recarregar a página
  }
}

function apagarSessao() {
  try {
    localStorage.removeItem(CHAVE_SESSAO);
  } catch {
    // Sem localStorage não há sessão salva para apagar
  }
}

export function AuthProvider({ children }) {
  const [sessao, setSessao] = useState(lerSessaoSalva);

  async function login(email, senha) {
    const resposta = await servicoAuth.login(email, senha);
    const novaSessao = { usuario: resposta.usuario, token: resposta.token };
    setSessao(novaSessao);
    salvarSessao(novaSessao);
    return resposta.usuario;
  }

  function logout() {
    setSessao(null);
    apagarSessao();
  }

  const valor = {
    usuario: sessao?.usuario ?? null, // { id, nome, email, perfil, empresaId }
    token: sessao?.token ?? null,
    login,
    logout,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth precisa estar dentro de <AuthProvider>.');
  }
  return contexto;
}
