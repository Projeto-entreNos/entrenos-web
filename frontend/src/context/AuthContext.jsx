import { createContext, useContext, useState } from 'react';
import * as servicoAuth from '../services/auth';

/*
  Contexto de autenticação: guarda quem está logado e oferece login() e logout().
  A sessão fica no localStorage para não perder o login ao recarregar a página.
  O localStorage pode falhar (aba anônima, bloqueio do navegador), por isso
  todo acesso a ele fica dentro de try/catch.
*/

const CHAVE_SESSAO = 'entrenos:sessao';

const AuthContext = createContext(null);

// Lê a sessão salva. Se não houver ou der erro, começa deslogado.
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
    // Nada a fazer
  }
}

export function AuthProvider({ children }) {
  // A função passada ao useState roda só na primeira renderização
  const [sessao, setSessao] = useState(lerSessaoSalva);

  /**
   * Faz login e devolve o usuário.
   * Lança erro com mensagem amigável se o e-mail ou a senha estiverem errados.
   */
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

/**
 * Hook para usar a autenticação em qualquer componente:
 *   const { usuario, login, logout } = useAuth();
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth precisa estar dentro de <AuthProvider>.');
  }
  return contexto;
}
