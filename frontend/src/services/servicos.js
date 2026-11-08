/* eslint-disable no-unused-vars */
import { empresas } from '../mocks/empresas';
import { servicos } from '../mocks/servicos';
import { universidades } from '../mocks/universidades';
import { USAR_MOCK, esperarMock, requisicao } from './api';

// TODO: implementar listarServicos e listarCategorias (modo mock e API).

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

// TODO: trocar pelo campo próprio de observações quando os serviços tiverem um
const OBSERVACOES_PADRAO = 'As vagas dependem da disponibilidade da universidade.';

/**
 * Detalhe de um serviço do pacote da empresa.
 * Devolve null se o serviço não existir OU não fizer parte do pacote da empresa
 * (para o colaborador, os dois casos são "Serviço não encontrado").
 * API: GET /empresas/:empresaId/servicos/:id
 * Resposta esperada: { id, nome, categoria, descricaoCurta, descricaoCompleta, modalidade, observacoes,
 *   status: "Ativo"|"Sem vagas"|"Pausado", previsaoRetorno: "AAAA-MM-DD"|null, novo: boolean,
 *   universidade: { id, nome } }
 * Erro (404): { mensagem: "Serviço não encontrado." }
 */
export async function buscarServico(id, empresaId) {
  if (!USAR_MOCK) {
    // TODO: quando a API estiver pronta, tratar o 404 devolvendo null
    // (hoje "requisicao" lança um erro genérico e a tela mostra o aviso de erro)
    return requisicao(`/empresas/${empresaId}/servicos/${id}`);
  }

  await esperarMock();

  const empresa = empresas.find((item) => item.id === empresaId);
  const servico = servicos.find((item) => item.id === id);
  if (!empresa || !servico || !servico.pacotes.includes(empresa.pacoteId)) {
    return null;
  }

  const universidade = universidades.find((item) => item.id === servico.universidadeId);
  return {
    id: servico.id,
    nome: servico.nome,
    categoria: servico.categoria,
    descricaoCurta: servico.descricaoCurta,
    descricaoCompleta: servico.descricaoCompleta,
    modalidade: servico.modalidade,
    observacoes: OBSERVACOES_PADRAO,
    status: servico.status,
    previsaoRetorno: servico.previsaoRetorno,
    novo: servico.novo,
    universidade: { id: universidade.id, nome: universidade.nome },
  };
}

/**
 * Lista as categorias do catálogo (para o filtro em pílulas).
 * API: GET /servicos/categorias
 * Resposta esperada: ["Assessoria jurídica", "Psicologia", "Nutrição", "Fisioterapia", "Odontologia"]
 */
export async function listarCategorias() {
  throw new Error('listarCategorias ainda não foi implementada.');
}
