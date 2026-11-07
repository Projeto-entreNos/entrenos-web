/*
  Configuração central de acesso a dados.
  Enquanto a API em C# não estiver pronta, USAR_MOCK = true e os services
  usam os dados de src/mocks. Quando a API estiver pronta, troque cada função
  para usar "requisicao" (fetch), uma de cada vez.
*/

export const USAR_MOCK = true;

// Endereço da API (definido em frontend/.env.local; veja .env.example)
export const URL_API = import.meta.env.VITE_API_URL;

// Espera "ms" milissegundos. Útil para simular a demora da rede.
export function esperar(ms) {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

// Simula a demora da API no modo mock: entre 300 e 600 ms.
export function esperarMock() {
  const ms = 300 + Math.floor(Math.random() * 301);
  return esperar(ms);
}

/**
 * Faz uma requisição à API e devolve o JSON da resposta.
 * Lança um erro com a mensagem da API quando a resposta não é de sucesso.
 * Exemplo: requisicao('/servicos') ou requisicao('/propostas', { metodo: 'POST', corpo: dados })
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
    throw new Error(dados?.mensagem || 'Não foi possível concluir. Tente de novo.');
  }

  return dados;
}
