// Texto para comparar na busca, sem diferenciar maiúsculas e acentos: "Educação" -> "educacao"
export function normalizarBusca(texto) {
  return (texto ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

// true se o termo aparece em algum dos textos. Termo vazio encontra tudo.
export function combinaComBusca(termo, textos) {
  const procurado = normalizarBusca(termo);
  if (!procurado) return true;
  return textos.some((texto) => normalizarBusca(texto).includes(procurado));
}
