export const REGRAS_SENHA = [
  { id: 'tamanho', texto: 'Mínimo de 8 caracteres', cumprida: (senha) => senha.length >= 8 },
  { id: 'letra', texto: 'Pelo menos uma letra', cumprida: (senha) => /[a-zA-ZÀ-ÿ]/.test(senha) },
  { id: 'numero', texto: 'Pelo menos um número', cumprida: (senha) => /[0-9]/.test(senha) },
];

// Devolve { senha, confirmacao, termos } só com os campos que têm erro.
// A senha só é marcada como inválida (true): o que falta aparece na lista de regras.
export function validarAtivacao({ senha, confirmacao, aceitouTermos }) {
  const erros = {};

  if (REGRAS_SENHA.some((regra) => !regra.cumprida(senha))) {
    erros.senha = true;
  }

  if (!confirmacao) {
    erros.confirmacao = 'Repita a senha.';
  } else if (confirmacao !== senha) {
    erros.confirmacao = 'As senhas não são iguais.';
  }

  if (!aceitouTermos) {
    erros.termos = 'Aceite os termos para continuar.';
  }

  return erros;
}
