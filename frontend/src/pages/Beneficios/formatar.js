const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export function primeiroNome(nomeCompleto) {
  return nomeCompleto.trim().split(' ')[0];
}

// "2026-12-01" -> "dez/2026". Lê o texto direto para não sofrer com fuso horário.
export function formatarMesAno(data) {
  const [ano, mes] = data.split('-');
  return `${MESES[Number(mes) - 1]}/${ano}`;
}
