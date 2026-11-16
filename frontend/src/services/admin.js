/* eslint-disable no-unused-vars */
import { colaboradores } from '../mocks/colaboradores';
import { empresas } from '../mocks/empresas';
import { pacotes } from '../mocks/pacotes';
import { categorias, servicos } from '../mocks/servicos';
import { universidades } from '../mocks/universidades';
import { dataDeHoje } from '../utils/datas';
import { USAR_MOCK, esperarMock, requisicao } from './api';
import { salvarServicos, servicoNovo } from './servicos';

// LGPD: o admin nunca recebe o conteúdo da mensagem do colaborador.
// TODO: implementar as funções de solicitações deste arquivo (modo mock e API).

// true: simula erro ao carregar a tela Admin Empresas (modo mock)
export const SIMULAR_FALHA_EMPRESAS = false;

// true: simula a lista de empresas vazia (modo mock)
export const SIMULAR_EMPRESAS_VAZIA = false;

// true: simula erro ao salvar uma empresa ou confirmar o pagamento (modo mock)
export const SIMULAR_FALHA_SALVAR_EMPRESA = false;

// true: simula erro ao carregar a tela Admin Serviços (modo mock)
export const SIMULAR_FALHA_SERVICOS = false;

// true: simula a lista de serviços vazia (modo mock)
export const SIMULAR_SERVICOS_VAZIA = false;

// true: simula erro ao criar ou editar um serviço (modo mock)
export const SIMULAR_FALHA_SALVAR_SERVICO = false;

const STATUS_SERVICO = ['Ativo', 'Sem vagas', 'Pausado'];
const MODALIDADES = ['Presencial', 'Online', 'Híbrido'];

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

function paraRespostaServico(servico) {
  const universidade = universidades.find((item) => item.id === servico.universidadeId);
  return {
    id: servico.id,
    nome: servico.nome,
    categoria: servico.categoria,
    universidade: { id: universidade?.id ?? null, nome: universidade?.nome ?? '-' },
    modalidade: servico.modalidade,
    local: servico.local,
    descricaoCurta: servico.descricaoCurta,
    descricaoCompleta: servico.descricaoCompleta,
    pacotes: servico.pacotes,
    status: servico.status,
    previsaoRetorno: servico.previsaoRetorno,
    novo: servicoNovo(servico),
  };
}

// O back-end confere de novo: campos obrigatórios, universidade e pacotes existentes
function conferirServico(dados) {
  if (!dados.nome?.trim()) {
    throw new Error('Informe o nome do serviço.');
  }
  if (!categorias.includes(dados.categoria)) {
    throw new Error('Selecione a categoria.');
  }
  if (!universidades.some((item) => item.id === dados.universidadeId)) {
    throw new Error('Selecione a universidade.');
  }
  if (!dados.pacotes?.length || !dados.pacotes.every((id) => pacotes.some((item) => item.id === id))) {
    throw new Error('Marque pelo menos um pacote.');
  }
  if (!STATUS_SERVICO.includes(dados.status)) {
    throw new Error('Status inválido.');
  }
  if (dados.modalidade && !MODALIDADES.includes(dados.modalidade)) {
    throw new Error('Modalidade inválida.');
  }
}

// A previsão de retorno só vale para serviço "Pausado"
function camposDoServico(dados) {
  return {
    nome: dados.nome.trim(),
    universidadeId: dados.universidadeId,
    categoria: dados.categoria,
    descricaoCurta: dados.descricaoCurta?.trim() ?? '',
    descricaoCompleta: dados.descricaoCompleta?.trim() ?? '',
    modalidade: dados.modalidade ?? '',
    local: dados.local?.trim() ?? '',
    pacotes: dados.pacotes,
    status: dados.status,
    previsaoRetorno: dados.status === 'Pausado' ? dados.previsaoRetorno || null : null,
  };
}

/**
 * Lista todos os serviços do catálogo, em todos os status.
 * API: GET /admin/servicos
 * Resposta esperada: [ { id, nome, categoria, universidade: { id, nome },
 *   modalidade: "Presencial"|"Online"|"Híbrido", local: "texto"|"", descricaoCurta, descricaoCompleta,
 *   pacotes: ["essencial", "completo"], status: "Ativo"|"Sem vagas"|"Pausado",
 *   previsaoRetorno: "AAAA-MM-DD"|null, novo: boolean } ]
 * "novo": o back-end calcula (serviço criado há até 30 dias).
 */
export async function listarServicosAdmin() {
  if (!USAR_MOCK) {
    return requisicao('/admin/servicos');
  }

  await esperarMock();

  if (SIMULAR_FALHA_SERVICOS) {
    throw new Error('Falha simulada ao carregar os serviços.');
  }
  if (SIMULAR_SERVICOS_VAZIA) return [];

  return servicos.map(paraRespostaServico);
}

/**
 * API: POST /admin/servicos  corpo: { nome, universidadeId, categoria, descricaoCurta, descricaoCompleta,
 *   modalidade, local, pacotes: ["essencial"], status, previsaoRetorno: "AAAA-MM-01"|null }
 * O back-end grava a data de cadastro (criadoEm), usada no selo "Novo".
 * Resposta esperada: o serviço criado, no mesmo formato de listarServicosAdmin
 * Erros (400): { mensagem: "Selecione a universidade." }
 */
export async function criarServico(dados) {
  if (!USAR_MOCK) {
    return requisicao('/admin/servicos', { metodo: 'POST', corpo: dados });
  }

  await esperarMock();

  if (SIMULAR_FALHA_SALVAR_SERVICO) {
    throw new Error('Falha simulada ao salvar o serviço.');
  }
  conferirServico(dados);

  const novo = { id: `serv-${Date.now()}`, ...camposDoServico(dados), criadoEm: dataDeHoje() };
  servicos.push(novo);
  salvarServicos();

  return paraRespostaServico(novo);
}

/**
 * API: PUT /admin/servicos/:id  corpo: mesmos campos de criarServico
 * Resposta esperada: o serviço atualizado, no mesmo formato de listarServicosAdmin
 * Erros (404): { mensagem: "Serviço não encontrado." }
 */
export async function editarServico(id, dados) {
  if (!USAR_MOCK) {
    return requisicao(`/admin/servicos/${id}`, { metodo: 'PUT', corpo: dados });
  }

  await esperarMock();

  if (SIMULAR_FALHA_SALVAR_SERVICO) {
    throw new Error('Falha simulada ao salvar o serviço.');
  }

  const servico = servicos.find((item) => item.id === id);
  if (!servico) {
    throw new Error('Serviço não encontrado.');
  }
  conferirServico(dados);

  Object.assign(servico, camposDoServico(dados));
  salvarServicos();
  return paraRespostaServico(servico);
}

/**
 * Lista as universidades (para o select do formulário de serviço).
 * API: GET /admin/universidades
 * Resposta esperada: [ { id, nome } ]
 */
export async function listarUniversidades() {
  if (!USAR_MOCK) {
    return requisicao('/admin/universidades');
  }

  await esperarMock();

  return universidades.map((universidade) => ({ id: universidade.id, nome: universidade.nome }));
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
