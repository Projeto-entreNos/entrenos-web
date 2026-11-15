import { USAR_MOCK, esperarMock, requisicao } from './api';

// true: simula erro ao enviar o formulário de proposta (modo mock)
export const SIMULAR_FALHA_PROPOSTA = false;

/**
 * Envia uma proposta.
 * API: POST /propostas  corpo: { nome, empresa, email, numeroColaboradores, mensagem, aceitouPrivacidade: true }
 * Resposta esperada (201): { id, mensagem: "Recebemos o seu pedido. Nosso time entra em contato." }
 * Erro (400): { mensagem: "Confira os campos destacados.", erros: { email: "E-mail inválido." } }
 */
export async function enviarProposta(dados) {
  if (!USAR_MOCK) {
    return requisicao('/propostas', { metodo: 'POST', corpo: dados });
  }

  await esperarMock();

  if (SIMULAR_FALHA_PROPOSTA) {
    throw new Error('Não foi possível enviar agora. Tente de novo em alguns minutos.');
  }
  if (!dados.aceitouPrivacidade) {
    throw new Error('Aceite a Política de Privacidade para continuar.');
  }

  // No modo mock a proposta não é guardada: são dados pessoais de quem preencheu
  return { id: `prop-${Date.now()}`, mensagem: 'Recebemos o seu pedido. Nosso time entra em contato.' };
}
