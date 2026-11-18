import { colaboradores } from '../mocks/colaboradores';
import { empresas } from '../mocks/empresas';
import { pacotes } from '../mocks/pacotes';
import { USAR_MOCK, esperarMock, requisicao } from './api';
import { cancelarSolicitacoesAbertasDoColaborador } from './solicitacoes';
import { dataDeHoje, somarDias } from '../utils/datas';

/*
  Regras: só contrato "Ativo" permite convidar; cada convidado ocupa uma vaga
  (Convidado, Convite expirado ou Ativo); um e-mail não pode estar duas vezes
  na mesma empresa; o convite vale 7 dias.
*/

// true: simula erro ao carregar a tela Empresa (modo mock)
export const SIMULAR_FALHA_EMPRESA = false;

// Empresa exibida na tela Empresa no modo mock: 'emp-2' (Aguardando pagamento),
// 'emp-3' (Encerrado), 'emp-4' (Proposta enviada) ou null (empresa do login).
export const EMPRESA_DE_TESTE = null;

// true: simula a lista de colaboradores vazia (modo mock)
export const SIMULAR_LISTA_VAZIA = false;

const DIAS_VALIDADE_CONVITE = 7;

// Formato simples de e-mail: algo@dominio.algo, sem espaços
const FORMATO_EMAIL = /^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/;

export function emailValido(email) {
  return FORMATO_EMAIL.test(email);
}

/*
  Modo mock: depois da primeira mudança (convite, reenvio ou remoção), a lista de
  colaboradores fica no localStorage. Apagar a chave restaura os dados de exemplo.
*/
const CHAVE_COLABORADORES = 'entrenos:colaboradores';

function lerColaboradoresSalvos() {
  try {
    const texto = localStorage.getItem(CHAVE_COLABORADORES);
    return texto ? JSON.parse(texto) : null;
  } catch {
    return null;
  }
}

// Também usada pela ativação de conta (services/auth.js) no modo mock
export function salvarColaboradores() {
  try {
    localStorage.setItem(CHAVE_COLABORADORES, JSON.stringify(colaboradores));
  } catch {
    // Sem localStorage as mudanças valem só até recarregar a página
  }
}

// Altera o próprio array para que todos os módulos que importam o mock vejam a mesma lista
const salvos = lerColaboradoresSalvos();
if (salvos) {
  colaboradores.splice(0, colaboradores.length, ...salvos);
}

// O convite vence 7 dias depois do envio. Datas "AAAA-MM-DD" podem ser comparadas como texto.
// Também usada pela ativação de conta (services/auth.js) no modo mock.
export function statusAtual(colaborador) {
  if (colaborador.status === 'Ativo') return 'Ativo';
  const vencimento = somarDias(colaborador.conviteEnviadoEm, DIAS_VALIDADE_CONVITE);
  return vencimento < dataDeHoje() ? 'Convite expirado' : 'Convidado';
}

function paraResposta(colaborador) {
  return {
    id: colaborador.id,
    nome: colaborador.nome,
    email: colaborador.email,
    status: statusAtual(colaborador),
    conviteEnviadoEm: colaborador.conviteEnviadoEm,
  };
}

/**
 * Dados da empresa do usuário logado.
 * API: GET /empresas/:empresaId
 * Resposta esperada: { id, nome, dominio: "alfa.exemplo.com",
 *   statusContrato: "Proposta enviada"|"Aguardando pagamento"|"Ativo"|"Encerrado",
 *   pacote: { id, nome, precoPorColaborador, limiteAtendimentosMes },
 *   vagasContratadas, vagasOcupadas, vigenciaInicio: "AAAA-MM-DD", vigenciaFim: "AAAA-MM-DD" }
 */
export async function buscarMinhaEmpresa(empresaId) {
  if (!USAR_MOCK.empresa) {
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
    dominio: empresa.dominio,
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
 * Lista os colaboradores da empresa, do convite mais recente para o mais antigo.
 * API: GET /empresas/:empresaId/colaboradores
 * Resposta esperada: [ { id, nome, email, status: "Convidado"|"Ativo"|"Convite expirado",
 *   conviteEnviadoEm: "AAAA-MM-DD" } ]
 * O back-end calcula "Convite expirado" (convite com mais de 7 dias e não ativado).
 */
export async function listarColaboradores(empresaId) {
  if (!USAR_MOCK.empresa) {
    return requisicao(`/empresas/${empresaId}/colaboradores`);
  }

  await esperarMock();

  if (SIMULAR_FALHA_EMPRESA) {
    throw new Error('Falha simulada ao carregar os colaboradores.');
  }
  if (SIMULAR_LISTA_VAZIA) return [];

  return colaboradores
    .filter((item) => item.empresaId === empresaId)
    .map(paraResposta)
    .sort((a, b) => b.conviteEnviadoEm.localeCompare(a.conviteEnviadoEm));
}

/**
 * Convida colaboradores por e-mail. "lista" já vem verificada pela tela,
 * mas o back-end confere tudo de novo.
 * API: POST /empresas/:empresaId/convites  corpo: { convites: [ { email, nome } ] } (nome pode ser "")
 * Resposta esperada: { convidados: [ { id, nome, email, status: "Convidado", conviteEnviadoEm } ],
 *   ignorados: [ { email, motivo } ] }
 * Erros (409): { mensagem: "Os convites só ficam liberados com o contrato ativo." }
 *              { mensagem: "Vagas insuficientes." }
 */
export async function convidarColaboradores(empresaId, lista) {
  if (!USAR_MOCK.empresa) {
    return requisicao(`/empresas/${empresaId}/convites`, { metodo: 'POST', corpo: { convites: lista } });
  }

  await esperarMock();

  const empresa = empresas.find((item) => item.id === empresaId);
  if (!empresa) {
    throw new Error('Não encontramos a sua empresa.');
  }
  if (empresa.statusContrato !== 'Ativo') {
    throw new Error('Os convites só ficam liberados com o contrato ativo.');
  }

  const daEmpresa = colaboradores.filter((item) => item.empresaId === empresaId);
  const emailsUsados = new Set(daEmpresa.map((item) => item.email.toLowerCase()));
  const novos = [];
  const ignorados = [];
  const hoje = dataDeHoje();

  lista.forEach((item, indice) => {
    const email = item.email.trim().toLowerCase();
    if (!emailValido(email)) {
      ignorados.push({ email, motivo: 'E-mail inválido.' });
    } else if (emailsUsados.has(email)) {
      ignorados.push({ email, motivo: 'Este e-mail já está na empresa.' });
    } else {
      emailsUsados.add(email);
      novos.push({
        id: `col-${Date.now()}-${indice}`,
        nome: (item.nome || '').trim(),
        email,
        empresaId,
        status: 'Convidado',
        conviteEnviadoEm: hoje,
        ativadoEm: null,
      });
    }
  });

  if (daEmpresa.length + novos.length > empresa.vagasContratadas) {
    throw new Error('Vagas insuficientes.');
  }

  colaboradores.push(...novos);
  salvarColaboradores();

  return { convidados: novos.map(paraResposta), ignorados };
}

/**
 * Reenvia um convite: nova data de envio, vale mais 7 dias e volta para "Convidado".
 * API: POST /colaboradores/:id/reenviar-convite
 * Resposta esperada: { id, nome, email, status: "Convidado", conviteEnviadoEm: "AAAA-MM-DD" }
 * Erros (409): { mensagem: "Esta pessoa já ativou a conta." }
 *              { mensagem: "Os convites só ficam liberados com o contrato ativo." }
 */
export async function reenviarConvite(colaboradorId) {
  if (!USAR_MOCK.empresa) {
    return requisicao(`/colaboradores/${colaboradorId}/reenviar-convite`, { metodo: 'POST' });
  }

  await esperarMock();

  const colaborador = colaboradores.find((item) => item.id === colaboradorId);
  if (!colaborador) {
    throw new Error('Colaborador não encontrado.');
  }
  if (colaborador.status === 'Ativo') {
    throw new Error('Esta pessoa já ativou a conta.');
  }
  const empresa = empresas.find((item) => item.id === colaborador.empresaId);
  if (empresa?.statusContrato !== 'Ativo') {
    throw new Error('Os convites só ficam liberados com o contrato ativo.');
  }

  colaborador.status = 'Convidado';
  colaborador.conviteEnviadoEm = dataDeHoje();
  salvarColaboradores();

  return paraResposta(colaborador);
}

/**
 * Remove um colaborador: libera a vaga e cancela as solicitações em aberto dele.
 * API: DELETE /colaboradores/:id
 * Resposta esperada: { vagasOcupadas: 6, solicitacoesCanceladas: 1 }
 */
export async function removerColaborador(colaboradorId) {
  if (!USAR_MOCK.empresa) {
    return requisicao(`/colaboradores/${colaboradorId}`, { metodo: 'DELETE' });
  }

  await esperarMock();

  const indice = colaboradores.findIndex((item) => item.id === colaboradorId);
  if (indice === -1) {
    throw new Error('Colaborador não encontrado.');
  }

  const [removido] = colaboradores.splice(indice, 1);
  salvarColaboradores();
  const solicitacoesCanceladas = await cancelarSolicitacoesAbertasDoColaborador(colaboradorId);

  return {
    vagasOcupadas: colaboradores.filter((item) => item.empresaId === removido.empresaId).length,
    solicitacoesCanceladas,
  };
}
