import { pacotes } from '../mocks/pacotes';
import { USAR_MOCK, esperarMock, requisicao } from './api';

// true: simula erro ao carregar os pacotes da landing (modo mock)
export const SIMULAR_FALHA_PACOTES = false;

/**
 * Pacotes mostrados na landing (rota pública, sem login).
 * API: GET /pacotes
 * Resposta esperada: [
 *   { id: "essencial", nome: "Essencial", descricao, precoPorColaborador: 29,
 *     limiteAtendimentosMes: 2, beneficios: ["Acesso ao catálogo de serviços", ...] }
 * ]
 */
export async function listarPacotesPublicos() {
  if (!USAR_MOCK.pacotes) {
    return requisicao('/pacotes');
  }

  await esperarMock();

  if (SIMULAR_FALHA_PACOTES) {
    throw new Error('Falha simulada ao carregar os pacotes.');
  }

  return pacotes.map((pacote) => ({
    id: pacote.id,
    nome: pacote.nome,
    descricao: pacote.descricao,
    precoPorColaborador: pacote.precoPorColaborador,
    limiteAtendimentosMes: pacote.limiteAtendimentosMes,
    beneficios: pacote.beneficios,
  }));
}
