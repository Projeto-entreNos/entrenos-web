/*
  DADOS DE EXEMPLO (fictícios), mas nomes, preços e limites seguem
  EXATAMENTE a seção "Pacotes" da landing page no Figma.
*/

export const pacotes = [
  {
    id: 'essencial',
    nome: 'Essencial',
    descricao: 'Para começar a oferecer os atendimentos à equipe.',
    precoPorColaborador: 29, // R$ por colaborador por mês
    limiteAtendimentosMes: 2, // por colaborador, renovado no dia 1º
    beneficios: [
      'Acesso ao catálogo de serviços',
      'Até 2 atendimentos por colaborador/mês',
      'Agendamento com a universidade',
      'Suporte por e-mail',
    ],
  },
  {
    id: 'completo',
    nome: 'Completo',
    descricao: 'Mais atendimentos por mês, gerente de conta e relatórios de uso.',
    precoPorColaborador: 49,
    limiteAtendimentosMes: 5,
    beneficios: [
      'Tudo do pacote Essencial',
      'Até 5 atendimentos por colaborador/mês',
      'Gerente de conta dedicado',
      'Acompanhamento de uso pelo RH',
      'Suporte prioritário por WhatsApp',
    ],
  },
];
