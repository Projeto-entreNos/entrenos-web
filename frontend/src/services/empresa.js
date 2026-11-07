/* eslint-disable no-unused-vars */
import { colaboradores } from '../mocks/colaboradores';
import { empresas } from '../mocks/empresas';
import { pacotes } from '../mocks/pacotes';
import { USAR_MOCK, esperarMock, requisicao } from './api';

/*
  Tela Empresa (perfil empresa): contrato, vagas, colaboradores e convites.
  Funções ainda VAZIAS. Modo mock: use src/mocks/empresas.js, colaboradores.js e pacotes.js.
  Regras: só contrato "Ativo" permite convidar; cada convidado ocupa uma vaga;
  um e-mail não pode estar duas vezes na mesma empresa; o convite vale 7 dias.
*/

/**
 * Dados da empresa do usuário logado.
 * API: GET /empresas/:empresaId
 * Resposta esperada: { id, nome, statusContrato: "Proposta enviada"|"Aguardando pagamento"|"Ativo"|"Encerrado",
 *   pacote: { id, nome, precoPorColaborador, limiteAtendimentosMes },
 *   vagasContratadas, vagasOcupadas, vigenciaInicio: "AAAA-MM-DD", vigenciaFim: "AAAA-MM-DD" }
 */
export async function buscarMinhaEmpresa(empresaId) {
  if (!USAR_MOCK) {
    return requisicao(`/empresas/${empresaId}`);
  }

  await esperarMock();

  const empresa = empresas.find((item) => item.id === empresaId);
  if (!empresa) {
    throw new Error('Não encontramos a sua empresa.');
  }

  const pacote = pacotes.find((item) => item.id === empresa.pacoteId);
  // Cada colaborador convidado ocupa uma vaga, qualquer que seja o status
  const vagasOcupadas = colaboradores.filter((item) => item.empresaId === empresaId).length;

  return {
    id: empresa.id,
    nome: empresa.nome,
    statusContrato: empresa.statusContrato,
    pacote: {
      id: pacote.id,
      nome: pacote.nome,
      precoPorColaborador: pacote.precoPorColaborador,
      limiteAtendimentosMes: pacote.limiteAtendimentosMes,
    },
    vagasContratadas: empresa.vagasContratadas,
    vagasOcupadas,
    vigenciaInicio: empresa.vigenciaInicio,
    vigenciaFim: empresa.vigenciaFim,
  };
}

/**
 * Lista os colaboradores da empresa.
 * API: GET /empresa/colaboradores
 * Resposta esperada: [ { id, nome, email, status: "Convidado"|"Ativo"|"Convite expirado", conviteEnviadoEm } ]
 */
export async function listarColaboradores() {
  throw new Error('listarColaboradores ainda não foi implementada.');
}

/**
 * Convida colaboradores por e-mail.
 * API: POST /empresa/convites  corpo: { emails: ["a@empresa.com", ...] }
 * Resposta esperada: { convidados: [ { id, email, status: "Convidado" } ], ignorados: [ { email, motivo } ] }
 * Erro (409): { mensagem: "Vagas insuficientes." }
 */
export async function convidarColaboradores(emails) {
  throw new Error('convidarColaboradores ainda não foi implementada.');
}

/**
 * Reenvia um convite (vale mais 7 dias).
 * API: POST /empresa/colaboradores/:id/reenviar-convite
 * Resposta esperada: { id, status: "Convidado", conviteEnviadoEm }
 */
export async function reenviarConvite(colaboradorId) {
  throw new Error('reenviarConvite ainda não foi implementada.');
}

/**
 * Remove um colaborador: libera a vaga e cancela as solicitações em aberto dele.
 * API: DELETE /empresa/colaboradores/:id
 * Resposta esperada: { vagasOcupadas, solicitacoesCanceladas: 1 }
 */
export async function removerColaborador(colaboradorId) {
  throw new Error('removerColaborador ainda não foi implementada.');
}
