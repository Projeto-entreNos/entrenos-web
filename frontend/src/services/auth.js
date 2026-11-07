import { usuarios } from '../mocks/usuarios';
import { USAR_MOCK, esperarMock, requisicao } from './api';

/*
  Autenticação. Por enquanto só o login funciona (em modo mock).
*/

/**
 * Entra no sistema.
 * API: POST /auth/login  corpo: { email, senha }
 * Resposta esperada:
 *   { token: "jwt...", usuario: { id, nome, email, perfil: "colaborador"|"empresa"|"admin", empresaId } }
 * Erro (401): { mensagem: "E-mail ou senha incorretos." }
 */
export async function login(email, senha) {
  if (!USAR_MOCK) {
    return requisicao('/auth/login', { metodo: 'POST', corpo: { email, senha } });
  }

  await esperarMock();

  const encontrado = usuarios.find(
    (usuario) => usuario.email === email.trim().toLowerCase() && usuario.senha === senha
  );

  if (!encontrado) {
    throw new Error('E-mail ou senha incorretos.');
  }

  // Nunca devolvemos a senha para a tela
  const { id, nome, email: emailUsuario, perfil, empresaId } = encontrado;
  return {
    token: `token-ficticio-${id}`,
    usuario: { id, nome, email: emailUsuario, perfil, empresaId },
  };
}

/**
 * Ativa a conta de um colaborador convidado e registra o aceite dos termos.
 * API: POST /auth/ativar  corpo: { token, senha, aceitouTermos: true }
 * Resposta esperada: { mensagem: "Conta ativada." }
 * Erro (410): { mensagem: "Este convite expirou." }
 */
// eslint-disable-next-line no-unused-vars
export async function ativarConta(token, { senha, aceitouTermos }) {
  throw new Error('ativarConta ainda não foi implementada.');
}

/**
 * Consulta um convite antes de mostrar a tela de ativação.
 * API: GET /auth/convites/:token
 * Resposta esperada: { nome, email, empresa: "Nome da empresa", status: "Convidado"|"Convite expirado" }
 */
// eslint-disable-next-line no-unused-vars
export async function buscarConvite(token) {
  throw new Error('buscarConvite ainda não foi implementada.');
}

/**
 * Pede o e-mail de recuperação de senha.
 * API: POST /auth/recuperar-senha  corpo: { email }
 * Resposta esperada: { mensagem: "Se o e-mail estiver cadastrado, você vai receber um link." }
 */
// eslint-disable-next-line no-unused-vars
export async function recuperarSenha(email) {
  throw new Error('recuperarSenha ainda não foi implementada.');
}
