/* eslint-disable no-unused-vars */
import { empresas } from '../mocks/empresas';
import { servicos } from '../mocks/servicos';
import { universidades } from '../mocks/universidades';
import { USAR_MOCK, esperarMock, requisicao } from './api';

/*
  Serviços do catálogo (tela Benefícios e Detalhe do serviço).
  Modo mock: use os dados de src/mocks/servicos.js e src/mocks/universidades.js,
  com "await esperarMock()" antes de responder (veja src/services/auth.js como exemplo).
*/

/**
 * Serviços do pacote da empresa, em TODOS os status (a lista mostra os selos
 * "Sem vagas no momento" e "Pausado").
 * API: GET /empresas/:empresaId/servicos
 * Resposta esperada: [
 *   { id, nome, categoria, descricaoCurta, modalidade,
 *     status: "Ativo"|"Sem vagas"|"Pausado", previsaoRetorno: "AAAA-MM-DD"|null, novo: boolean,
 *     universidade: { id, nome } }
 * ]
 */
export async function listarServicosDoPacote(empresaId) {
  if (!USAR_MOCK) {
    // TODO: enviar o token do usuário quando a API exigir autenticação
    return requisicao(`/empresas/${empresaId}/servicos`);
  }

  await esperarMock();

  const empresa = empresas.find((item) => item.id === empresaId);
  if (!empresa) {
    throw new Error('Não encontramos a sua empresa.');
  }

  return servicos
    .filter((servico) => servico.pacotes.includes(empresa.pacoteId))
    .map((servico) => {
      const universidade = universidades.find((item) => item.id === servico.universidadeId);
      return {
        id: servico.id,
        nome: servico.nome,
        categoria: servico.categoria,
        descricaoCurta: servico.descricaoCurta,
        modalidade: servico.modalidade,
        status: servico.status,
        previsaoRetorno: servico.previsaoRetorno,
        novo: servico.novo,
        universidade: { id: universidade.id, nome: universidade.nome },
      };
    });
}

/**
 * Lista os serviços do pacote da empresa do colaborador.
 * API: GET /servicos?categoria=Psicologia&busca=texto
 * Resposta esperada: [
 *   { id, nome, categoria, descricaoCurta, modalidade, status: "Ativo"|"Sem vagas"|"Pausado",
 *     previsaoRetorno: "AAAA-MM-DD"|null, novo: boolean,
 *     universidade: { id, nome } }
 * ]
 */
export async function listarServicos({ categoria, busca } = {}) {
  throw new Error('listarServicos ainda não foi implementada.');
}

/**
 * Detalhe de um serviço.
 * API: GET /servicos/:id
 * Resposta esperada: { id, nome, categoria, descricaoCurta, descricaoCompleta, modalidade, status,
 *   previsaoRetorno, novo, universidade: { id, nome } }
 * Erro (404): { mensagem: "Serviço não encontrado." }
 */
export async function buscarServico(id) {
  throw new Error('buscarServico ainda não foi implementada.');
}

/**
 * Lista as categorias do catálogo (para o filtro em pílulas).
 * API: GET /servicos/categorias
 * Resposta esperada: ["Assessoria jurídica", "Psicologia", "Nutrição", "Fisioterapia", "Odontologia"]
 */
export async function listarCategorias() {
  throw new Error('listarCategorias ainda não foi implementada.');
}
