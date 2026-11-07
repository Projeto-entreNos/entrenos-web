// Monta os ids usados no aria-describedby (ligam o campo à ajuda, ao erro e ao contador).
// Fica em arquivo separado porque arquivos de componente devem exportar só componentes.
export function idsDescricao(id, { ajuda, erro, contador }) {
  const ids = [];
  if (erro) ids.push(`${id}-erro`);
  else if (ajuda) ids.push(`${id}-ajuda`);
  if (contador) ids.push(`${id}-contador`);
  return ids.length ? ids.join(' ') : undefined;
}
