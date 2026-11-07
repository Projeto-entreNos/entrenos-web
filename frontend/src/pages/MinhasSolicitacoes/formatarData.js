// "2026-11-02" -> "02/11/2026". Lê o texto direto para não sofrer com fuso horário.
export function formatarData(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}
