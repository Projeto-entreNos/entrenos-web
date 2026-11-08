import { emailValido } from '../../services/empresa';

/**
 * Cada linha: "email", "email, Nome" ou "Nome, email" (a parte com "@" é o e-mail).
 * Linhas em branco são ignoradas; "linha" é o número da linha no texto.
 * Devolve { totalLinhas, validos, invalidos, duplicados, outroDominio }.
 */
export function verificarLista(texto, emailsDaEmpresa, dominio) {
  const validos = [];
  const invalidos = [];
  const duplicados = [];
  const vistos = new Map(); // e-mail -> número da linha em que apareceu primeiro
  let totalLinhas = 0;

  texto.split('\n').forEach((conteudo, indice) => {
    const linha = indice + 1;
    const original = conteudo.trim();
    if (!original) return;
    totalLinhas += 1;

    const partes = original
      .split(',')
      .map((parte) => parte.trim())
      .filter(Boolean);
    const comArroba = partes.filter((parte) => parte.includes('@'));

    let motivo = '';
    if (partes.length > 2) motivo = 'Use só e-mail e nome, separados por uma vírgula.';
    else if (comArroba.length === 0) motivo = 'Falta o e-mail.';
    else if (comArroba.length > 1) motivo = 'Coloque só um e-mail por linha.';
    else if (!emailValido(comArroba[0])) motivo = 'E-mail em formato inválido.';

    if (motivo) {
      invalidos.push({ linha, texto: original, motivo });
      return;
    }

    const email = comArroba[0].toLowerCase();
    const nome = partes.find((parte) => !parte.includes('@')) || '';

    if (emailsDaEmpresa.includes(email)) {
      duplicados.push({ linha, email, motivo: 'Já foi convidado nesta empresa.' });
    } else if (vistos.has(email)) {
      duplicados.push({ linha, email, motivo: `Repetido na lista (linha ${vistos.get(email)}).` });
    } else {
      vistos.set(email, linha);
      validos.push({ linha, email, nome });
    }
  });

  const outroDominio = dominio
    ? validos.filter((item) => item.email.split('@')[1] !== dominio).map((item) => item.email)
    : [];

  return { totalLinhas, validos, invalidos, duplicados, outroDominio };
}
