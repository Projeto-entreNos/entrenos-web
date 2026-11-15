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

  // Só os mais parecidos com a busca: em "dívida no cartão e contrato", educação financeira
  // (2 palavras) ganha de assessoria jurídica (só "contrato")
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
  'aula', 'aulas', 'curso', 'cursos', 'aprender',
]);

// Palavras ligadas a cada categoria, além das que já aparecem no texto do serviço.
// Sem isso, buscas comuns como "Excel" ou "advogado" não achariam nada.
const PALAVRAS_DA_CATEGORIA = {
  'Apoio contábil e financeiro':
    'divida dividas orcamento imposto renda declaracao dinheiro conta contas gasto gastos economizar poupar financas juros emprestimo cartao',
  'Consultoria em gestão e negócios':
    'negocio negocios empresa empreender empreendedor mei vendas vender marketing cliente clientes loja divulgar redes',
  'Apoio educacional e idiomas':
    'ingles espanhol idioma idiomas reforco escola escolar filho filhos estudar tarefa matematica portugues redacao',
  'Capacitação em tecnologia básica':
    'computador informatica planilha planilhas excel internet celular email aplicativo digital senha golpe',
  'Assessoria jurídica':
    'juridico direito direitos advogado contrato contratos trabalhista cobranca consumidor pensao guarda divorcio processo rescisao',
};

const MOTIVO_POR_CATEGORIA = {
  'Apoio contábil e financeiro': 'ajuda a organizar o orçamento, sair das dívidas e tirar dúvidas sobre impostos.',
  'Consultoria em gestão e negócios': 'orienta quem quer abrir, organizar ou divulgar um pequeno negócio.',
  'Apoio educacional e idiomas': 'oferece aulas de idiomas e reforço escolar, como você descreveu.',
  'Capacitação em tecnologia básica': 'ensina o básico de computador, planilhas e internet para o dia a dia.',
  'Assessoria jurídica': 'orienta sobre dúvidas jurídicas do dia a dia, como a que você descreveu.',
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
