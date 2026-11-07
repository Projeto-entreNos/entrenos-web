import { empresas } from '../mocks/empresas';
import { pacotes } from '../mocks/pacotes';
import { servicos } from '../mocks/servicos';
import { solicitacoes } from '../mocks/solicitacoes';
import { universidades } from '../mocks/universidades';
import { usuarios } from '../mocks/usuarios';
import { USAR_MOCK, esperarMock, requisicao } from './api';

// Troque para true para testar o erro no envio da solicitação (modo mock)
export const SIMULAR_FALHA_SOLICITACAO = false;

// Troque para true para testar o erro no cancelamento (modo mock)
export const SIMULAR_FALHA_CANCELAMENTO = false;

const LIMITE_MENSAGEM = 300;
const STATUS_ABERTOS = ['Enviada', 'Em contato'];

/*
  Modo mock: as solicitações criadas pelo colaborador ficam no localStorage,
  para continuarem lá depois de recarregar a página. Ao carregar este arquivo,
  elas entram na lista de mocks, e assim contam no limite do mês e aparecem
  em Minhas solicitações.
  LGPD: o campo "mensagem" simula o que é enviado à universidade.
  As telas de admin NUNCA podem ler esse campo.
*/
const CHAVE_SOLICITACOES = 'entrenos:solicitacoes';

function lerSolicitacoesSalvas() {
  try {
    const texto = localStorage.getItem(CHAVE_SOLICITACOES);
    return texto ? JSON.parse(texto) : [];
  } catch {
    return [];
  }
}

function salvarSolicitacoes(lista) {
  try {
    localStorage.setItem(CHAVE_SOLICITACOES, JSON.stringify(lista));
  } catch {
    // Sem localStorage a solicitação vale só até recarregar a página
  }
}

// Confere o id para não duplicar quando o Vite recarrega este arquivo
for (const salva of lerSolicitacoesSalvas()) {
  if (!solicitacoes.some((item) => item.id === salva.id)) {
    solicitacoes.push(salva);
  }
}

/*
  Modo mock: os cancelamentos ficam numa chave separada, porque as
  solicitações de exemplo (src/mocks) não estão no localStorage.
  Formato: [{ id: "sol-2", atualizadaEm: "AAAA-MM-DD" }]
*/
const CHAVE_CANCELAMENTOS = 'entrenos:cancelamentos';

function lerCancelamentos() {
  try {
    const texto = localStorage.getItem(CHAVE_CANCELAMENTOS);
    return texto ? JSON.parse(texto) : [];
  } catch {
    return [];
  }
}

function salvarCancelamento(id, atualizadaEm) {
  try {
    const lista = lerCancelamentos().filter((item) => item.id !== id);
    localStorage.setItem(CHAVE_CANCELAMENTOS, JSON.stringify([...lista, { id, atualizadaEm }]));
  } catch {
    // Sem localStorage o cancelamento vale só até recarregar a página
  }
}

for (const cancelamento of lerCancelamentos()) {
  const solicitacao = solicitacoes.find((item) => item.id === cancelamento.id);
  if (solicitacao) {
    solicitacao.status = 'Cancelada';
    solicitacao.atualizadaEm = cancelamento.atualizadaEm;
  }
}

// Data local no formato AAAA-MM-DD (toISOString usaria o fuso UTC)
function dataDeHoje() {
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${hoje.getFullYear()}-${mes}-${dia}`;
}

function procurarAberta(colaboradorId, servicoId) {
  return solicitacoes.find(
    (item) =>
      item.colaboradorId === colaboradorId &&
      item.servicoId === servicoId &&
      STATUS_ABERTOS.includes(item.status)
  );
}

/*
  Solicitações do colaborador (Detalhe do serviço e Minhas solicitações).
  Algumas funções ainda estão vazias. Modo mock: use src/mocks/solicitacoes.js.
  Regras: só serviços "Ativo" podem ser solicitados; não pode haver outra
  solicitação "Enviada" ou "Em contato" do mesmo serviço; respeitar o limite
  mensal do pacote.
*/

/**
 * Lista as solicitações do usuário, da mais recente para a mais antiga.
 * Não traz a mensagem: ela é só da universidade (LGPD).
 * API: GET /usuarios/:usuarioId/solicitacoes
 * Resposta esperada: [
 *   { id, status: "Enviada"|"Em contato"|"Atendida"|"Cancelada", criadaEm: "AAAA-MM-DD",
 *     atualizadaEm: "AAAA-MM-DD", servico: { id, nome }, universidade: { id, nome } }
 * ]
 */
export async function listarMinhasSolicitacoes(usuarioId) {
  if (!USAR_MOCK) {
    return requisicao(`/usuarios/${usuarioId}/solicitacoes`);
  }

  await esperarMock();

  const usuario = usuarios.find((item) => item.id === usuarioId);
  if (!usuario?.colaboradorId) return [];

  return solicitacoes
    .filter((item) => item.colaboradorId === usuario.colaboradorId)
    // As criadas por último ficam no fim da lista: invertendo, elas vêm antes no mesmo dia
    .reverse()
    .map((item) => {
      const servico = servicos.find((s) => s.id === item.servicoId);
      const universidade = universidades.find((u) => u.id === servico?.universidadeId);
      return {
        id: item.id,
        status: item.status,
        criadaEm: item.criadaEm,
        atualizadaEm: item.atualizadaEm,
        servico: { id: item.servicoId, nome: servico?.nome ?? 'Serviço removido' },
        universidade: { id: universidade?.id ?? null, nome: universidade?.nome ?? '-' },
      };
    })
    // Datas "AAAA-MM-DD" podem ser comparadas como texto
    .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm));
}

/**
 * Cria uma solicitação. A mensagem vai só para a universidade (LGPD).
 * "usuarioId" é usado SÓ no modo mock: na API, o usuário vem do token e não vai no corpo.
 * API: POST /solicitacoes  corpo: { servicoId, mensagem }
 * Resposta esperada: { id, status: "Enviada", criadaEm: "AAAA-MM-DD" }
 * Erros (409): { mensagem: "Este serviço não está disponível para solicitação." }
 *              { mensagem: "Você já tem uma solicitação em aberto para este serviço." }
 *              { mensagem: "Você atingiu o limite de atendimentos deste mês." }
 */
export async function criarSolicitacao({ servicoId, mensagem = '', usuarioId }) {
  const texto = mensagem.trim();
  if (texto.length > LIMITE_MENSAGEM) {
    throw new Error(`A mensagem pode ter no máximo ${LIMITE_MENSAGEM} caracteres.`);
  }

  if (!USAR_MOCK) {
    // TODO: enviar o token do usuário quando a API exigir autenticação
    return requisicao('/solicitacoes', { metodo: 'POST', corpo: { servicoId, mensagem: texto } });
  }

  // contarAtendimentosDoMes já simula a espera da rede
  const usados = await contarAtendimentosDoMes(usuarioId);

  if (SIMULAR_FALHA_SOLICITACAO) {
    throw new Error('Falha simulada no envio.');
  }

  const usuario = usuarios.find((item) => item.id === usuarioId);
  const servico = servicos.find((item) => item.id === servicoId);
  if (!usuario?.colaboradorId || !servico) {
    throw new Error('Não foi possível enviar. Tente novamente.');
  }

  if (servico.status !== 'Ativo') {
    throw new Error('Este serviço não está disponível para solicitação.');
  }
  if (procurarAberta(usuario.colaboradorId, servicoId)) {
    throw new Error('Você já tem uma solicitação em aberto para este serviço.');
  }

  const empresa = empresas.find((item) => item.id === usuario.empresaId);
  const pacote = pacotes.find((item) => item.id === empresa?.pacoteId);
  if (!pacote || usados >= pacote.limiteAtendimentosMes) {
    throw new Error('Você atingiu o limite de atendimentos deste mês.');
  }

  const hoje = dataDeHoje();
  const nova = {
    id: `sol-${Date.now()}`,
    colaboradorId: usuario.colaboradorId,
    empresaId: usuario.empresaId,
    servicoId,
    universidadeId: servico.universidadeId,
    mensagem: texto, // só para a universidade (LGPD): nunca mostrar no admin
    status: 'Enviada',
    criadaEm: hoje,
    atualizadaEm: hoje,
  };

  solicitacoes.push(nova);
  salvarSolicitacoes([...lerSolicitacoesSalvas(), nova]);

  return { id: nova.id, status: nova.status, criadaEm: nova.criadaEm };
}

/**
 * Solicitação em aberto ("Enviada" ou "Em contato") do usuário para um serviço, ou null.
 * Serve para bloquear um novo pedido do mesmo serviço.
 * API: GET /usuarios/:usuarioId/solicitacao-aberta?servicoId=serv-1
 * Resposta esperada: { id, status: "Enviada"|"Em contato", criadaEm: "AAAA-MM-DD" } ou null
 */
export async function buscarSolicitacaoAberta(servicoId, usuarioId) {
  if (!USAR_MOCK) {
    return requisicao(`/usuarios/${usuarioId}/solicitacao-aberta?servicoId=${encodeURIComponent(servicoId)}`);
  }

  await esperarMock();

  const usuario = usuarios.find((item) => item.id === usuarioId);
  if (!usuario?.colaboradorId) return null;

  const aberta = procurarAberta(usuario.colaboradorId, servicoId);
  return aberta ? { id: aberta.id, status: aberta.status, criadaEm: aberta.criadaEm } : null;
}

/**
 * Cancela uma solicitação. Só o próprio colaborador cancela, e só quando está "Enviada"
 * (depois disso a universidade já está em contato). Cancelada, deixa de contar no limite do mês.
 * "usuarioId" é usado SÓ no modo mock: na API, o usuário vem do token.
 * API: PATCH /solicitacoes/:id/cancelar
 * Resposta esperada: { id, status: "Cancelada", atualizadaEm: "AAAA-MM-DD" }
 * Erros (409): { mensagem: "Esta solicitação não pode mais ser cancelada." }
 */
export async function cancelarSolicitacao(id, usuarioId) {
  if (!USAR_MOCK) {
    // TODO: enviar o token do usuário quando a API exigir autenticação
    return requisicao(`/solicitacoes/${id}/cancelar`, { metodo: 'PATCH' });
  }

  await esperarMock();

  if (SIMULAR_FALHA_CANCELAMENTO) {
    throw new Error('Falha simulada no cancelamento.');
  }

  const usuario = usuarios.find((item) => item.id === usuarioId);
  const solicitacao = solicitacoes.find((item) => item.id === id);
  if (!usuario?.colaboradorId || solicitacao?.colaboradorId !== usuario.colaboradorId) {
    throw new Error('Solicitação não encontrada.');
  }
  if (solicitacao.status !== 'Enviada') {
    throw new Error('Esta solicitação não pode mais ser cancelada.');
  }

  solicitacao.status = 'Cancelada';
  solicitacao.atualizadaEm = dataDeHoje();
  salvarCancelamento(id, solicitacao.atualizadaEm);

  return { id, status: solicitacao.status, atualizadaEm: solicitacao.atualizadaEm };
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
