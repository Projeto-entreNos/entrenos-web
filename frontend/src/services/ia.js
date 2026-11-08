import { empresas } from '../mocks/empresas';
import { servicos } from '../mocks/servicos';
import { USAR_MOCK, esperar, requisicao } from './api';

/*
  Busca "Encontrar com IA" (tela Benefícios).
  A chave da IA fica SÓ no back-end: o front envia o texto da busca para a nossa API.
  Não enviar nome, e-mail ou empresa do usuário (só o empresaId, para filtrar o pacote).
  Se a IA falhar, a tela continua mostrando a lista com filtros (plano B obrigatório).
*/

// true: simula a IA indisponível, para testar o plano B (modo mock)
export const SIMULAR_FALHA_IA = false;

/**
 * Pede recomendações à IA.
 * API: POST /ia/recomendar  corpo: { texto, empresaId }
 * Resposta esperada: {
 *   recomendacoes: [ { servicoId: "serv-6", motivo: "Por que indicamos: ..." } ]  // no máximo 3
 * }
 * A API só deve recomendar serviços Ativos do pacote da empresa, mas a tela valida de novo.
 * Erro (503): { mensagem: "A busca com IA está indisponível agora." }
 */
export async function recomendarServicos(texto, empresaId) {
  if (!USAR_MOCK) {
    return requisicao('/ia/recomendar', { metodo: 'POST', corpo: { texto, empresaId } });
  }

  // A IA de verdade demora mais que as outras chamadas: 800 a 1500 ms
  await esperar(800 + Math.floor(Math.random() * 701));

  if (SIMULAR_FALHA_IA) {
    throw new Error('A busca com IA está indisponível agora.');
  }

  const empresa = empresas.find((item) => item.id === empresaId);
  if (!empresa) return { recomendacoes: [] };

  const palavras = palavrasDaBusca(texto);

  const pontuados = servicos
    .filter((servico) => servico.status === 'Ativo' && servico.pacotes.includes(empresa.pacoteId))
    .map((servico) => ({ servico, pontos: contarPalavrasEmComum(palavras, servico) }));
  const maiorPontuacao = Math.max(0, ...pontuados.map((item) => item.pontos));

  // Só os mais parecidos com a busca: em "dor de dente", odontologia (2 palavras)
  // ganha de fisioterapia (só "dor")
  const recomendacoes = pontuados
    .filter((item) => item.pontos > 0 && item.pontos === maiorPontuacao)
    .slice(0, 3)
    .map(({ servico }) => ({
      servicoId: servico.id,
      motivo: `Por que indicamos: ${MOTIVO_POR_CATEGORIA[servico.categoria]}`,
    }));

  return { recomendacoes };
}

// Simulação da IA (modo mock)

const PALAVRAS_IGNORADAS = new Set([
  'quero', 'queria', 'gostaria', 'preciso', 'ajuda', 'para', 'com', 'uma', 'umas', 'uns', 'que',
  'minha', 'meu', 'meus', 'minhas', 'estou', 'tenho', 'sobre', 'mais', 'muito', 'muita', 'algum',
  'alguma', 'alguem', 'fazer', 'trabalho', 'melhorar', 'como', 'esta', 'isso', 'pelo', 'pela',
  'sem', 'nao', 'por', 'dos', 'das', 'nos', 'nas', 'ter', 'ser', 'seu', 'sua', 'tem', 'bem', 'mal',
]);

// Palavras ligadas a cada categoria, além das que já aparecem no texto do serviço.
// Sem isso, buscas comuns como "dor nas costas" ou "dente" não achariam nada.
const PALAVRAS_DA_CATEGORIA = {
  'Assessoria jurídica': 'juridico direito advogado contrato divida cobranca consumidor pensao guarda divorcio processo',
  Psicologia: 'ansiedade estresse emocional tristeza terapia conversar desabafar sono cansaco mental',
  'Nutrição': 'alimentacao dieta comer comida peso emagrecer nutricionista marmita disposicao',
  Fisioterapia: 'postura dor dores costas coluna pescoco punho alongamento sentado lombar',
  Odontologia: 'dente dentes dor gengiva boca sorriso dentista carie limpeza',
};

const MOTIVO_POR_CATEGORIA = {
  'Assessoria jurídica': 'orienta sobre dúvidas jurídicas do dia a dia, como a que você descreveu.',
  Psicologia: 'oferece escuta e apoio para lidar com o que você descreveu.',
  'Nutrição': 'ajuda a ajustar a alimentação à sua rotina.',
  Fisioterapia: 'cuida de postura e dores comuns de quem passa horas trabalhando.',
  Odontologia: 'cuida da saúde dos dentes com avaliação e tratamento.',
};

function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function palavrasDaBusca(texto) {
  return normalizar(texto)
    .split(/[^a-z]+/)
    .filter((palavra) => palavra.length >= 3 && !PALAVRAS_IGNORADAS.has(palavra));
}

function contarPalavrasEmComum(palavras, servico) {
  const textoDoServico = normalizar(
    [servico.nome, servico.categoria, servico.descricaoCompleta, PALAVRAS_DA_CATEGORIA[servico.categoria]].join(' ')
  );
  return palavras.filter((palavra) => textoDoServico.includes(palavra)).length;
}
