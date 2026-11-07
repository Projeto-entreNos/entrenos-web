/* eslint-disable no-unused-vars */
import { solicitacoes } from '../mocks/solicitacoes';
import { usuarios } from '../mocks/usuarios';
import { USAR_MOCK, esperarMock, requisicao } from './api';

/*
  Solicitações do colaborador (Detalhe do serviço e Minhas solicitações).
  Funções ainda VAZIAS. Modo mock: use src/mocks/solicitacoes.js.
  Regras: só serviços "Ativo" podem ser solicitados; não pode haver outra
  solicitação "Enviada" ou "Em contato" do mesmo serviço; respeitar o limite
  mensal do pacote.
*/

/**
 * Lista as solicitações do colaborador logado.
 * API: GET /solicitacoes/minhas
 * Resposta esperada: [
 *   { id, status: "Enviada"|"Em contato"|"Atendida"|"Cancelada", criadaEm: "AAAA-MM-DD",
 *     atualizadaEm: "AAAA-MM-DD", servico: { id, nome, categoria }, universidade: { id, nome } }
 * ]
 */
export async function listarMinhasSolicitacoes() {
  throw new Error('listarMinhasSolicitacoes ainda não foi implementada.');
}

/**
 * Cria uma solicitação. A mensagem vai só para a universidade (LGPD).
 * API: POST /solicitacoes  corpo: { servicoId, mensagem }
 * Resposta esperada: { id, status: "Enviada", criadaEm }
 * Erros (409): { mensagem: "Você já tem uma solicitação em aberto para este serviço." }
 *              { mensagem: "Você atingiu o limite de atendimentos deste mês." }
 */
export async function criarSolicitacao({ servicoId, mensagem }) {
  throw new Error('criarSolicitacao ainda não foi implementada.');
}

/**
 * Cancela uma solicitação (só quando está "Enviada").
 * API: POST /solicitacoes/:id/cancelar
 * Resposta esperada: { id, status: "Cancelada" }
 */
export async function cancelarSolicitacao(id) {
  throw new Error('cancelarSolicitacao ainda não foi implementada.');
}

/**
 * Quantos atendimentos o usuário já usou no mês atual.
 * Regra: contam as solicitações criadas neste mês que não foram canceladas
 * (o limite renova no dia 1º).
 * API: GET /usuarios/:usuarioId/atendimentos-do-mes
 * Resposta esperada: { usados: 2 }
 */
export async function contarAtendimentosDoMes(usuarioId) {
  if (!USAR_MOCK) {
    const resposta = await requisicao(`/usuarios/${usuarioId}/atendimentos-do-mes`);
    return resposta.usados;
  }

  await esperarMock();

  const usuario = usuarios.find((item) => item.id === usuarioId);
  if (!usuario?.colaboradorId) return 0;

  // "AAAA-MM" do mês atual, para comparar com o começo de criadaEm
  const hoje = new Date();
  const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;

  return solicitacoes.filter(
    (solicitacao) =>
      solicitacao.colaboradorId === usuario.colaboradorId &&
      solicitacao.criadaEm.startsWith(mesAtual) &&
      solicitacao.status !== 'Cancelada'
  ).length;
}

/**
 * Uso do mês do colaborador logado (para mostrar "X de Y atendimentos").
 * API: GET /solicitacoes/uso-do-mes
 * Resposta esperada: { usados: 2, limite: 5, pacote: "Completo" }
 */
export async function buscarUsoDoMes() {
  throw new Error('buscarUsoDoMes ainda não foi implementada.');
}
