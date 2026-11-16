/* eslint-disable no-unused-vars */
import { empresas } from '../mocks/empresas';
import { categorias, servicos } from '../mocks/servicos';
import { universidades } from '../mocks/universidades';
import { dataDeHoje, somarDias } from '../utils/datas';
import { USAR_MOCK, esperarMock, requisicao } from './api';

// TODO: implementar listarServicos (modo mock e API).

// O selo "Novo" aparece nos 30 dias depois do cadastro do serviço
const DIAS_SELO_NOVO = 30;

/*
  Modo mock: depois da primeira mudança feita no Admin Serviços (criar ou editar),
  o catálogo fica no localStorage. Assim Benefícios e Detalhe mostram as mudanças. Apagar a chave restaura os dados de exemplo.
*/
const CHAVE_SERVICOS = 'entrenos:servicos';

function lerServicosSalvos() {
  try {
    const texto = localStorage.getItem(CHAVE_SERVICOS);
    return texto ? JSON.parse(texto) : null;
  } catch {
    return null;
  }
}

// Usada pelo Admin Serviços (services/admin.js) no modo mock
export function salvarServicos() {
  try {
    localStorage.setItem(CHAVE_SERVICOS, JSON.stringify(servicos));
  } catch {
    // Sem localStorage as mudanças valem só até recarregar a página
  }
}

// Altera o próprio array para que todos os módulos que importam o mock vejam a mesma lista
const salvos = lerServicosSalvos();
if (salvos) {
  servicos.splice(0, servicos.length, ...salvos);
}

// Datas "AAAA-MM-DD" podem ser comparadas como texto. Também usada pelo Admin Serviços.
export function servicoNovo(servico) {
  return somarDias(servico.criadoEm, DIAS_SELO_NOVO) >= dataDeHoje();
}

/**
 * Serviços do pacote da empresa, em TODOS os status (a lista mostra os selos
 * "Sem vagas no momento" e "Pausado").
 * API: GET /empresas/:empresaId/servicos
 * Resposta esperada: [
 *   { id, nome, categoria, descricaoCurta, modalidade: "Presencial"|"Online"|"Híbrido", local: "texto"|"",
 *     status: "Ativo"|"Sem vagas"|"Pausado", previsaoRetorno: "AAAA-MM-DD"|null, novo: boolean,
 *     universidade: { id, nome } }
 * ]
 * "novo": o back-end calcula (serviço criado há até 30 dias).
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
        local: servico.local,
        status: servico.status,
        previsaoRetorno: servico.previsaoRetorno,
        novo: servicoNovo(servico),
        universidade: { id: universidade.id, nome: universidade.nome },
      };
    });
}

/**
 * Lista os serviços do pacote da empresa do colaborador.
 * API: GET /servicos?categoria=Assessoria%20jur%C3%ADdica&busca=texto
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
 * Resposta esperada: { id, nome, categoria, descricaoCurta, descricaoCompleta, modalidade, local, observacoes,
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
    local: servico.local,
    observacoes: OBSERVACOES_PADRAO,
    status: servico.status,
    previsaoRetorno: servico.previsaoRetorno,
    novo: servicoNovo(servico),
    universidade: { id: universidade.id, nome: universidade.nome },
  };
}

/**
 * Lista as categorias do catálogo (para o filtro em pílulas).
 * API: GET /servicos/categorias
 * Resposta esperada: ["Apoio contábil e financeiro", "Consultoria em gestão e negócios",
 *   "Apoio educacional e idiomas", "Capacitação em tecnologia básica", "Assessoria jurídica"]
 */
export async function listarCategorias() {
  if (!USAR_MOCK) {
    return requisicao('/servicos/categorias');
  }

  await esperarMock();
  return [...categorias];
}
