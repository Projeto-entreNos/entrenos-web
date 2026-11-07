/* eslint-disable no-unused-vars */
/*
  Telas do admin (equipe EntreNós): Empresas, Serviços e Solicitações.
  Funções ainda VAZIAS. Modo mock: use os arquivos de src/mocks.
  LGPD: o admin NÃO vê o conteúdo da mensagem do colaborador.
*/

// ---------- Empresas ----------

/**
 * API: GET /admin/empresas
 * Resposta esperada: [ { id, nome, statusContrato, pacote: { id, nome }, vagasContratadas, vagasOcupadas,
 *   vigenciaInicio, vigenciaFim } ]
 */
export async function listarEmpresas() {
  throw new Error('listarEmpresas ainda não foi implementada.');
}

/**
 * API: POST /admin/empresas  corpo: { nome, pacoteId, vagasContratadas, vigenciaInicio, vigenciaFim,
 *   emailResponsavel }
 * Resposta esperada: a empresa criada, com statusContrato: "Proposta enviada"
 */
export async function criarEmpresa(dados) {
  throw new Error('criarEmpresa ainda não foi implementada.');
}

/**
 * API: PUT /admin/empresas/:id  corpo: mesmos campos de criarEmpresa
 * Resposta esperada: a empresa atualizada
 */
export async function editarEmpresa(id, dados) {
  throw new Error('editarEmpresa ainda não foi implementada.');
}

/**
 * Registra o resultado do contrato/pagamento (feito fora do sistema).
 * API: POST /admin/empresas/:id/status  corpo: { statusContrato: "Ativo" }
 * Resposta esperada: { id, statusContrato }
 */
export async function alterarStatusContrato(id, statusContrato) {
  throw new Error('alterarStatusContrato ainda não foi implementada.');
}

// ---------- Serviços ----------

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

// ---------- Solicitações ----------

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
