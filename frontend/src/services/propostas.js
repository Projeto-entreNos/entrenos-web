/* eslint-disable no-unused-vars */
/*
  Formulário "Solicite uma proposta" da landing page.
*/

/**
 * Envia uma proposta.
 * API: POST /api/propostas  corpo: { nome, empresa, email, numeroColaboradores, mensagem, aceitouPrivacidade: true }
 * Resposta esperada (201): { id, mensagem: "Recebemos o seu pedido. Nosso time entra em contato." }
 * Erro (400): { mensagem: "Confira os campos destacados.", erros: { email: "E-mail inválido." } }
 */
export async function enviarProposta(dados) {
  throw new Error('enviarProposta ainda não foi implementada.');
}
