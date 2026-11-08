/*
  USAR_MOCK = true: os services respondem com os dados de src/mocks.
  Cada função de service passa a usar "requisicao" (API em C#) à medida que o endpoint fica pronto.
*/

export const USAR_MOCK = true;

// Endereço da API: variável VITE_API_URL, configurada no arquivo frontend/.env
export const URL_API = import.meta.env.VITE_API_URL;

export function esperar(ms) {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

export function esperarMock() {
  const ms = 300 + Math.floor(Math.random() * 301);
  return esperar(ms);
}

/**
 * Devolve o JSON da resposta. Em resposta de erro, lança Error com o campo "mensagem" da API.
 * Ex.: requisicao('/propostas', { metodo: 'POST', corpo: dados })
 */
export async function requisicao(caminho, { metodo = 'GET', corpo, token } = {}) {
  const cabecalhos = { 'Content-Type': 'application/json' };
  if (token) cabecalhos.Authorization = `Bearer ${token}`;

  const resposta = await fetch(`${URL_API}${caminho}`, {
    method: metodo,
    headers: cabecalhos,
    body: corpo ? JSON.stringify(corpo) : undefined,
  });

  // Algumas respostas (ex.: 204) não têm corpo
  const texto = await resposta.text();
  const dados = texto ? JSON.parse(texto) : null;

  if (!resposta.ok) {
    throw new Error(dados?.mensagem || 'Não foi possível concluir. Tente novamente.');
  }

  return dados;
}
