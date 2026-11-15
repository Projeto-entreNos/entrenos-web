/*
  DADOS DE EXEMPLO (fictícios).
  Status: 'Enviada', 'Em contato', 'Atendida', 'Cancelada'.
  Privacidade (LGPD): a mensagem do colaborador vai só para a universidade,
  por isso ela NÃO fica guardada aqui (o admin não pode ver o conteúdo).
  Regras respeitadas nos dados:
  - só há solicitação aberta (Enviada / Em contato) de serviços Ativos;
  - nenhum colaborador tem duas solicitações abertas do mesmo serviço;
  - a usuária de teste (col-1, pacote Completo, limite 5/mês) tem 2 em novembro.
*/

export const solicitacoes = [
  {
    id: 'sol-1',
    colaboradorId: 'col-1',
    servicoId: 'serv-1',
    status: 'Em contato',
    criadaEm: '2026-11-03',
    atualizadaEm: '2026-11-04',
  },
  {
    id: 'sol-2',
    colaboradorId: 'col-1',
    servicoId: 'serv-4',
    status: 'Enviada',
    criadaEm: '2026-11-06',
    atualizadaEm: '2026-11-06',
  },
  {
    id: 'sol-3',
    colaboradorId: 'col-1',
    servicoId: 'serv-6',
    status: 'Atendida',
    criadaEm: '2026-10-10',
    atualizadaEm: '2026-10-21',
  },
  {
    id: 'sol-4',
    colaboradorId: 'col-1',
    servicoId: 'serv-9',
    status: 'Cancelada',
    criadaEm: '2026-10-02',
    atualizadaEm: '2026-10-03',
  },
  {
    id: 'sol-5',
    colaboradorId: 'col-2',
    servicoId: 'serv-7',
    status: 'Enviada',
    criadaEm: '2026-11-05',
    atualizadaEm: '2026-11-05',
  },
  {
    id: 'sol-6',
    colaboradorId: 'col-3',
    servicoId: 'serv-11',
    status: 'Atendida',
    criadaEm: '2026-10-15',
    atualizadaEm: '2026-10-28',
  },
  {
    id: 'sol-7',
    colaboradorId: 'col-4',
    servicoId: 'serv-3',
    status: 'Em contato',
    criadaEm: '2026-11-01',
    atualizadaEm: '2026-11-02',
  },
  {
    id: 'sol-8',
    colaboradorId: 'col-8',
    servicoId: 'serv-12',
    status: 'Atendida',
    criadaEm: '2026-05-10',
    atualizadaEm: '2026-05-20',
  },
];
