export const STATUS_SERVICO = ['Ativo', 'Sem vagas', 'Pausado'];

// Previsão de retorno: a pessoa digita "MM/AAAA" e a API guarda o dia 1º do mês ("AAAA-MM-01")
const FORMATO_MES_ANO = /^(0[1-9]|1[0-2])\/(\d{4})$/;

// "2027-02-01" -> "02/2027"
export function paraMesAno(data) {
  if (!data) return '';
  const [ano, mes] = data.split('-');
  return `${mes}/${ano}`;
}

// "02/2027" -> "2027-02-01". Vazio vira null (a previsão é opcional).
export function paraDataDaApi(mesAno) {
  const partes = FORMATO_MES_ANO.exec(mesAno.trim());
  return partes ? `${partes[2]}-${partes[1]}-01` : null;
}

// Coloca a barra enquanto a pessoa digita: "022027" -> "02/2027"
export function mascararMesAno(texto) {
  const numeros = texto.replace(/\D/g, '').slice(0, 6);
  return numeros.length > 2 ? `${numeros.slice(0, 2)}/${numeros.slice(2)}` : numeros;
}

/*
  Devolve { campo: mensagem } só com os campos errados (objeto vazio = tudo certo).
  A ordem das chaves segue a ordem dos campos no formulário.
*/
export function validarServico(valores) {
  const erros = {};

  if (!valores.nome.trim()) {
    erros.nome = 'Informe o nome do serviço.';
  }
  if (!valores.categoria) {
    erros.categoria = 'Selecione a categoria.';
  }
  if (!valores.universidadeId) {
    erros.universidadeId = 'Selecione a universidade.';
  }
  if (valores.pacotes.length === 0) {
    erros.pacotes = 'Marque pelo menos um pacote.';
  }
  if (valores.status === 'Pausado' && valores.previsaoRetorno.trim() && !paraDataDaApi(valores.previsaoRetorno)) {
    erros.previsaoRetorno = 'Use o formato MM/AAAA.';
  }

  return erros;
}
