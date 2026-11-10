// "12.345.678/0001-90" -> "12345678000190"
export function somenteNumeros(texto) {
  return texto.replace(/\D/g, '');
}

// Aplica a máscara 00.000.000/0000-00 enquanto a pessoa digita
export function mascararCnpj(texto) {
  return somenteNumeros(texto)
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

// 1450 -> "R$ 1.450,00"
export function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// "2026-03-01", "2027-02-28" -> "03/2026 a 02/2027". Lê o texto direto para não sofrer com fuso horário.
export function formatarVigencia(inicio, fim) {
  const [anoInicio, mesInicio] = inicio.split('-');
  const [anoFim, mesFim] = fim.split('-');
  return `${mesInicio}/${anoInicio} a ${mesFim}/${anoFim}`;
}
