/*
  USAR_MOCK: cada service pode usar os dados de src/mocks (true) ou a API em C# (false).
  Com "auth" em true, o login é fictício e a API recusa o token: nesse caso, ponha
  em true também os services das telas logadas que for testar.
  Atenção: nos mocks os ids são textos ("emp-1") e na API são números (1).
*/
export const USAR_MOCK = {
  pacotes: false,
  propostas: false,
  auth: false,
  servicos: false,
  solicitacoes: false,
  empresa: false,
  admin: false,
};

// Endereço da API: variável VITE_API_URL, configurada no arquivo frontend/.env.local
export const URL_API = import.meta.env.VITE_API_URL;

// Token de quem está logado e o que fazer quando a API recusa o token.
// O AuthContext preenche os dois ao entrar e ao carregar a página.
let tokenAtual = null;
let aoExpirarSessao = () => {};

export function definirToken(token) {
  tokenAtual = token;
}

export function definirAoExpirarSessao(funcao) {
  aoExpirarSessao = funcao;
}

export function esperar(ms) {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

export function esperarMock() {
  const ms = 300 + Math.floor(Math.random() * 301);
  return esperar(ms);
}

/**
 * Devolve o JSON da resposta. Em resposta de erro, lança Error com o campo "mensagem" da API
 * e com "status" (ex.: 404), para o service tratar casos específicos.
 * Ex.: requisicao('/propostas', { metodo: 'POST', corpo: dados })
 */
export async function requisicao(caminho, { metodo = 'GET', corpo } = {}) {
  const cabecalhos = { 'Content-Type': 'application/json' };
  if (tokenAtual) cabecalhos.Authorization = `Bearer ${tokenAtual}`;

  let resposta;
  try {
    resposta = await fetch(`${URL_API}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new Error('Não foi possível falar com o servidor. Confira sua conexão.');
  }

  // Algumas respostas (ex.: 204) não têm corpo
  const texto = await resposta.text();
  const dados = texto ? JSON.parse(texto) : null;

  // Token vencido (8 horas) ou usuário removido: encerra a sessão.
  // Sem token (ex.: login com senha errada), o 401 é só um erro comum.
  if (resposta.status === 401 && tokenAtual) {
    aoExpirarSessao();
  }

  if (!resposta.ok) {
    const erro = new Error(dados?.mensagem || 'Não foi possível concluir. Tente novamente.');
    erro.status = resposta.status;
    throw erro;
  }

  return dados;
}
