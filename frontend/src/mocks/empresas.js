/*
  DADOS DE EXEMPLO (fictícios). Empresas inventadas.
  Status do contrato: 'Proposta enviada', 'Aguardando pagamento', 'Ativo', 'Encerrado'.
  Só "Ativo" permite convidar colaboradores.
  Datas no formato AAAA-MM-DD.
  A emp-4 serve para testar o contrato "Proposta enviada".
*/

export const empresas = [
  {
    id: 'emp-1',
    nome: 'Alfa Exemplo Tecnologia Ltda.',
    dominio: 'alfa.exemplo.com', // domínio dos e-mails da empresa (aviso no convite)
    statusContrato: 'Ativo',
    pacoteId: 'completo',
    vagasContratadas: 10,
    vigenciaInicio: '2026-09-01',
    vigenciaFim: '2027-08-31',
  },
  {
    id: 'emp-2',
    nome: 'Beta Exemplo Comércio S.A.',
    dominio: 'beta.exemplo.com',
    statusContrato: 'Aguardando pagamento',
    pacoteId: 'essencial',
    vagasContratadas: 25,
    vigenciaInicio: '2026-12-01',
    vigenciaFim: '2027-11-30',
  },
  {
    id: 'emp-3',
    nome: 'Gama Exemplo Serviços Ltda.',
    dominio: 'gama.exemplo.com',
    statusContrato: 'Encerrado',
    pacoteId: 'essencial',
    vagasContratadas: 5,
    vigenciaInicio: '2025-06-01',
    vigenciaFim: '2026-05-31',
  },  {
    id: 'emp-4',
    nome: 'Delta Exemplo Indústria Ltda.',
    dominio: 'delta.exemplo.com',
    statusContrato: 'Proposta enviada',
    pacoteId: 'completo',
    vagasContratadas: 15,
    vigenciaInicio: '2027-01-01',
    vigenciaFim: '2027-12-31',
  },
];
