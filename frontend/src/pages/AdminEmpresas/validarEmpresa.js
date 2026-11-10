import { emailValido } from '../../services/empresa';
import { somenteNumeros } from './formatar';

/*
  Devolve { campo: mensagem } só com os campos errados (objeto vazio = tudo certo).
  vagasOcupadas: na edição, as vagas contratadas não podem ficar abaixo das já ocupadas.
*/
export function validarEmpresa(valores, vagasOcupadas = 0) {
  const erros = {};
  const vagas = Number(valores.vagasContratadas);

  if (!valores.nome.trim()) {
    erros.nome = 'Informe o nome da empresa.';
  }
  if (somenteNumeros(valores.cnpj).length !== 14) {
    erros.cnpj = 'CNPJ inválido. Confira os 14 números.';
  }
  if (!emailValido(valores.emailResponsavel.trim())) {
    erros.emailResponsavel = 'E-mail inválido.';
  }
  if (!valores.pacoteId) {
    erros.pacoteId = 'Selecione o pacote.';
  }
  if (!Number.isInteger(vagas) || vagas <= 0) {
    erros.vagasContratadas = 'Informe vagas maiores que zero.';
  } else if (vagas < vagasOcupadas) {
    erros.vagasContratadas = `A empresa já tem ${vagasOcupadas} ${
      vagasOcupadas === 1 ? 'vaga ocupada' : 'vagas ocupadas'
    }. Informe pelo menos ${vagasOcupadas}.`;
  }
  if (!valores.vigenciaInicio) {
    erros.vigenciaInicio = 'Informe o início da vigência.';
  }
  // Datas "AAAA-MM-DD" podem ser comparadas como texto
  if (!valores.vigenciaFim) {
    erros.vigenciaFim = 'Informe o fim da vigência.';
  } else if (valores.vigenciaInicio && valores.vigenciaFim <= valores.vigenciaInicio) {
    erros.vigenciaFim = 'A data final deve ser depois da inicial.';
  }

  return erros;
}
