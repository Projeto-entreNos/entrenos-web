// Confere só o formato (algo@algo.algo); se o e-mail existe, quem diz é a API
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Devolve a mensagem de erro, ou '' se o e-mail estiver certo
export function validarEmail(email) {
  if (!email.trim()) return 'Informe seu e-mail.';
  if (!FORMATO_EMAIL.test(email.trim())) return 'Digite um e-mail válido, como voce@empresa.com.br.';
  return '';
}
