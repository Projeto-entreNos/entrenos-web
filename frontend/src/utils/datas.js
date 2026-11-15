const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// Data local no formato "AAAA-MM-DD" (toISOString usaria o fuso UTC)
export function paraTextoAAAAMMDD(data) {
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${data.getFullYear()}-${mes}-${dia}`;
}

export function dataDeHoje() {
  return paraTextoAAAAMMDD(new Date());
}

// "2026-11-02" + 7 -> "2026-11-09"
export function somarDias(dataTexto, dias) {
  const [ano, mes, dia] = dataTexto.split('-').map(Number);
  return paraTextoAAAAMMDD(new Date(ano, mes - 1, dia + dias));
}

// "2026-11-02" -> "02/11/2026". Lê o texto direto para não sofrer com fuso horário.
export function formatarData(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

// "2026-12-01" -> "dez/2026". Lê o texto direto para não sofrer com fuso horário.
export function formatarMesAno(data) {
  const [ano, mes] = data.split('-');
  return `${MESES[Number(mes) - 1]}/${ano}`;
}
