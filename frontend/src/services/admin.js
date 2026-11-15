/* eslint-disable no-unused-vars */
import { colaboradores } from '../mocks/colaboradores';
import { empresas } from '../mocks/empresas';
import { pacotes } from '../mocks/pacotes';
import { USAR_MOCK, esperarMock, requisicao } from './api';

// LGPD: o admin nunca recebe o conteúdo da mensagem do colaborador.
// TODO: implementar as funções de serviços, universidades e solicitações deste arquivo (modo mock e API).

// true: simula erro ao carregar a tela Admin Empresas (modo mock)
export const SIMULAR_FALHA_EMPRESAS = false;

// true: simula a lista de empresas vazia (modo mock)
export const SIMULAR_EMPRESAS_VAZIA = false;

// true: simula erro ao salvar uma empresa ou confirmar o pagamento (modo mock)
export const SIMULAR_FALHA_SALVAR_EMPRESA = false;

/*
  Modo mock: depois da primeira mudança (criar, editar ou confirmar pagamento), a lista de
  empresas fica no localStorage. Apagar a chave restaura os dados de exemplo.
*/
const CHAVE_EMPRESAS = 'entrenos:empresas';

function lerEmpresasSalvas() {
  try {
    const texto = localStorage.getItem(CHAVE_EMPRESAS);
    return texto ? JSON.parse(texto) : null;
  } catch {
    return null;
  }
}

function salvarEmpresas() {
  try {
    localStorage.setItem(CHAVE_EMPRESAS, JSON.stringify(empresas));
  } catch {
    // Sem localStorage as mudanças valem só até recarregar a página
  }
}

// Altera o próprio array para que todos os módulos que importam o mock vejam a mesma lista
const salvas = lerEmpresasSalvas();
if (salvas) {
  empresas.splice(0, empresas.length, ...salvas);
}

function somenteNumeros(texto) {
  return texto.replace(/\D/g, '');
}

// Cada colaborador convidado ocupa uma vaga, qualquer que seja o status
function contarVagasOcupadas(empresaId) {
  return colaboradores.filter((item) => item.empresaId === empresaId).length;
}

function paraResposta(empresa) {
  const pacote = pacotes.find((item) => item.id === empresa.pacoteId);
  return {
    id: empresa.id,
    nome: empresa.nome,
    cnpj: empresa.cnpj,
    responsavel: empresa.responsavel,
    emailResponsavel: empresa.emailResponsavel,
    statusContrato: empresa.statusContrato,
    pacote: { id: pacote.id, nome: pacote.nome },
    vagasContratadas: empresa.vagasContratadas,
    vagasOcupadas: contarVagasOcupadas(empresa.id),
    vigenciaInicio: empresa.vigenciaInicio,
    vigenciaFim: empresa.vigenciaFim,
  };
}

// O back-end confere de novo: CNPJ único, pacote existente e vagas não menores que as ocupadas
function conferirDados(dados, empresaId) {
  const cnpjRepetido = empresas.some(
    (item) => item.id !== empresaId && somenteNumeros(item.cnpj) === somenteNumeros(dados.cnpj)
  );
  if (cnpjRepetido) {
    throw new Error('Já existe uma empresa com este CNPJ.');
  }
  if (!pacotes.some((item) => item.id === dados.pacoteId)) {
    throw new Error('Pacote não encontrado.');
  }

  const ocupadas = empresaId ? contarVagasOcupadas(empresaId) : 0;
  if (dados.vagasContratadas < ocupadas) {
    throw new Error(
      `A empresa já tem ${ocupadas} ${ocupadas === 1 ? 'vaga ocupada' : 'vagas ocupadas'}. Informe pelo menos ${ocupadas}.`
    );
  }
}

/**
 * Lista todas as empresas, na ordem de cadastro.
 * API: GET /admin/empresas
 * Resposta esperada: [ { id, nome, cnpj: "00.000.000/0000-00", responsavel, emailResponsavel,
 *   statusContrato: "Proposta enviada"|"Aguardando pagamento"|"Ativo"|"Encerrado",
 *   pacote: { id, nome }, vagasContratadas, vagasOcupadas,
 *   vigenciaInicio: "AAAA-MM-DD", vigenciaFim: "AAAA-MM-DD" } ]
 */
export async function listarEmpresas() {
  if (!USAR_MOCK) {
    return requisicao('/admin/empresas');
  }

  await esperarMock();

  if (SIMULAR_FALHA_EMPRESAS) {
    throw new Error('Falha simulada ao carregar as empresas.');
  }
  if (SIMULAR_EMPRESAS_VAZIA) return [];

  return empresas.map(paraResposta);
}

/**
 * API: POST /admin/empresas  corpo: { nome, cnpj, responsavel, emailResponsavel, pacoteId,
 *   vagasContratadas, vigenciaInicio, vigenciaFim, statusContrato }
 * Resposta esperada: a empresa criada, no mesmo formato de listarEmpresas
 * Erros (409): { mensagem: "Já existe uma empresa com este CNPJ." }
 */
export async function criarEmpresa(dados) {
  if (!USAR_MOCK) {
    return requisicao('/admin/empresas', { metodo: 'POST', corpo: dados });
  }

  await esperarMock();

  if (SIMULAR_FALHA_SALVAR_EMPRESA) {
    throw new Error('Falha simulada ao salvar a empresa.');
  }
  conferirDados(dados);

  const nova = {
    ...dados,
    id: `emp-${Date.now()}`,
    // Usado no aviso de domínio do convite (tela Empresa)
    dominio: dados.emailResponsavel.split('@')[1],
  };
  empresas.push(nova);
  salvarEmpresas();

  return paraResposta(nova);
}

/**
 * API: PUT /admin/empresas/:id  corpo: mesmos campos de criarEmpresa
 * Resposta esperada: a empresa atualizada, no mesmo formato de listarEmpresas
 * Erros (409): { mensagem: "Já existe uma empresa com este CNPJ." }
 *              { mensagem: "A empresa já tem 7 vagas ocupadas. Informe pelo menos 7." }
 */
export async function editarEmpresa(id, dados) {
  if (!USAR_MOCK) {
    return requisicao(`/admin/empresas/${id}`, { metodo: 'PUT', corpo: dados });
  }

  await esperarMock();

  if (SIMULAR_FALHA_SALVAR_EMPRESA) {
    throw new Error('Falha simulada ao salvar a empresa.');
  }

  const empresa = empresas.find((item) => item.id === id);
  if (!empresa) {
    throw new Error('Empresa não encontrada.');
  }
  conferirDados(dados, id);

  Object.assign(empresa, dados);
  salvarEmpresas();
  return paraResposta(empresa);
}

/**
 * Registra o resultado do contrato/pagamento (feito fora do sistema).
 * API: POST /admin/empresas/:id/status  corpo: { statusContrato: "Ativo" }
 * Resposta esperada: { id, statusContrato }
 */
export async function alterarStatusContrato(id, statusContrato) {
  if (!USAR_MOCK) {
    return requisicao(`/admin/empresas/${id}/status`, { metodo: 'POST', corpo: { statusContrato } });
  }

  await esperarMock();

  if (SIMULAR_FALHA_SALVAR_EMPRESA) {
    throw new Error('Falha simulada ao confirmar o pagamento.');
  }

  const empresa = empresas.find((item) => item.id === id);
  if (!empresa) {
    throw new Error('Empresa não encontrada.');
  }

  empresa.statusContrato = statusContrato;
  salvarEmpresas();
  return { id: empresa.id, statusContrato: empresa.statusContrato };
}

/**
 * Pacotes para o formulário de empresa (select e valor estimado).
 * API: GET /admin/pacotes
 * Resposta esperada: [ { id: "essencial", nome: "Essencial", precoPorColaborador: 29 } ]
 */
export async function listarPacotes() {
  if (!USAR_MOCK) {
    return requisicao('/admin/pacotes');
  }

  await esperarMock();

  return pacotes.map((pacote) => ({
    id: pacote.id,
    nome: pacote.nome,
    precoPorColaborador: pacote.precoPorColaborador,
  }));
}

/**
 * API: GET /admin/servicos
 * Resposta esperada: [ { id, nome, categoria, universidade: { id, nome }, modalidade, pacotes: ["essencial"],
 *   status, previsaoRetorno, novo } ]
 */
export async function listarServicosAdmin() {
  throw new Error('listarServicosAdmin ainda não foi implementada.');
}

/**
 * API: POST /admin/servicos  corpo: { nome, universidadeId, categoria, descricaoCurta, descricaoCompleta,
 *   modalidade, pacotes, status, previsaoRetorno, novo }
 * Resposta esperada: o serviço criado
 */
export async function criarServico(dados) {
  throw new Error('criarServico ainda não foi implementada.');
}

/**
 * API: PUT /admin/servicos/:id  corpo: mesmos campos de criarServico
 * Resposta esperada: o serviço atualizado
 */
export async function editarServico(id, dados) {
  throw new Error('editarServico ainda não foi implementada.');
}

/**
 * Lista as universidades (para o select do formulário de serviço).
 * API: GET /admin/universidades
 * Resposta esperada: [ { id, nome } ]
 */
export async function listarUniversidades() {
  throw new Error('listarUniversidades ainda não foi implementada.');
}

/**
 * API: GET /admin/solicitacoes?status=Enviada
 * Resposta esperada: [ { id, status, criadaEm, atualizadaEm, colaborador: { nome }, empresa: { nome },
 *   servico: { nome }, universidade: { nome } } ]   (sem a mensagem)
 */
export async function listarSolicitacoesAdmin({ status } = {}) {
  throw new Error('listarSolicitacoesAdmin ainda não foi implementada.');
}

/**
 * API: POST /admin/solicitacoes/:id/status  corpo: { status: "Em contato"|"Atendida"|"Cancelada" }
 * Resposta esperada: { id, status, atualizadaEm }
 */
export async function alterarStatusSolicitacao(id, status) {
  throw new Error('alterarStatusSolicitacao ainda não foi implementada.');
}
