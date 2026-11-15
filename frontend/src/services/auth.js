import { colaboradores } from '../mocks/colaboradores';
import { empresas } from '../mocks/empresas';
import { usuarios } from '../mocks/usuarios';
import { dataDeHoje } from '../utils/datas';
import { USAR_MOCK, esperarMock, requisicao } from './api';
import { salvarColaboradores, statusAtual } from './empresa';

// true: simula erro ao abrir o link de ativação (modo mock)
export const SIMULAR_FALHA_CONVITE = false;

// true: simula erro ao clicar em "Ativar conta" (modo mock)
export const SIMULAR_FALHA_ATIVACAO = false;

// true: simula erro ao pedir o link de recuperação de senha (modo mock)
export const SIMULAR_FALHA_RECUPERACAO = false;

// Links de teste no modo mock: /ativar/convite-gabriela e /ativar/convite-heitor (válidos),
// /ativar/convite-iris (expirado). Os tokens ficam em mocks/colaboradores.js.
function buscarColaboradorPeloToken(token) {
  return colaboradores.find((item) => item.tokenConvite && item.tokenConvite === token);
}

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

  // A senha nunca é devolvida para a tela
  const { id, nome, email: emailUsuario, perfil, empresaId } = encontrado;
  return {
    token: `token-ficticio-${id}`,
    usuario: { id, nome, email: emailUsuario, perfil, empresaId },
  };
}

/**
 * Consulta um convite antes de mostrar a tela de ativação.
 * API: GET /auth/convites/:token
 * Resposta esperada: { nome, email, empresa: "Nome da empresa", status: "Convidado"|"Convite expirado" }
 * Token inexistente ou já usado: { nome: null, email: null, empresa: null, status: "Convite expirado" }
 */
export async function buscarConvite(token) {
  if (!USAR_MOCK) {
    return requisicao(`/auth/convites/${encodeURIComponent(token)}`);
  }

  await esperarMock();

  if (SIMULAR_FALHA_CONVITE) {
    throw new Error('Falha simulada ao carregar o convite.');
  }

  const colaborador = buscarColaboradorPeloToken(token);
  // Mesma regra dos 7 dias da tela Empresa; conta já ativada conta como convite usado
  if (!colaborador || statusAtual(colaborador) !== 'Convidado') {
    return { nome: null, email: null, empresa: null, status: 'Convite expirado' };
  }

  const empresa = empresas.find((item) => item.id === colaborador.empresaId);
  return {
    nome: colaborador.nome,
    email: colaborador.email,
    empresa: empresa.nome,
    status: 'Convidado',
  };
}

/**
 * Ativa a conta de um colaborador convidado e registra o aceite dos termos.
 * API: POST /auth/ativar  corpo: { token, senha, aceitouTermos: true }
 * Resposta esperada: { mensagem: "Conta ativada." }
 * Erro (410): { mensagem: "Este convite expirou." }
 * Erro (400): { mensagem: "Aceite os termos para continuar." }
 */
export async function ativarConta(token, { senha, aceitouTermos }) {
  if (!USAR_MOCK) {
    return requisicao('/auth/ativar', { metodo: 'POST', corpo: { token, senha, aceitouTermos } });
  }

  await esperarMock();

  if (SIMULAR_FALHA_ATIVACAO) {
    throw new Error('Não foi possível ativar sua conta agora. Tente de novo em alguns minutos.');
  }
  if (!aceitouTermos) {
    throw new Error('Aceite os termos para continuar.');
  }

  const colaborador = buscarColaboradorPeloToken(token);
  if (!colaborador || statusAtual(colaborador) !== 'Convidado') {
    throw new Error('Este convite expirou.');
  }

  // A senha não é guardada no mock: só o back-end guarda a senha (criptografada)
  const hoje = dataDeHoje();
  colaborador.status = 'Ativo';
  colaborador.ativadoEm = hoje;
  colaborador.aceiteTermosEm = hoje;
  delete colaborador.tokenConvite; // o link só pode ser usado uma vez
  salvarColaboradores();

  return { mensagem: 'Conta ativada.' };
}

/**
 * Pede o e-mail de recuperação de senha.
 * API: POST /auth/recuperar-senha  corpo: { email }
 * Resposta esperada: { mensagem: "Se o e-mail estiver cadastrado, você vai receber um link." }
 */
export async function recuperarSenha(email) {
  if (!USAR_MOCK) {
    return requisicao('/auth/recuperar-senha', { metodo: 'POST', corpo: { email } });
  }

  await esperarMock();

  if (SIMULAR_FALHA_RECUPERACAO) {
    throw new Error('Não foi possível enviar o link agora. Tente de novo em alguns minutos.');
  }

  // Mesma resposta para e-mail cadastrado ou não: assim ninguém descobre quem tem conta.
  // No modo mock nenhum e-mail é enviado de verdade.
  return { mensagem: 'Se o e-mail estiver cadastrado, você vai receber um link.' };
}
