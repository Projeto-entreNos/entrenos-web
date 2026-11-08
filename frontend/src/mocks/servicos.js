/*
  DADOS DE EXEMPLO (fictícios).
  Categorias iguais às da landing page.
  Os dois pacotes dão acesso ao catálogo completo: todo serviço tem pacotes ['essencial', 'completo'].
  Status possíveis: 'Ativo', 'Sem vagas', 'Pausado'. Só 'Ativo' pode ser solicitado.
  "novo" é só um selo visual.
*/

export const categorias = ['Assessoria jurídica', 'Psicologia', 'Nutrição', 'Fisioterapia', 'Odontologia'];

const TODOS_OS_PACOTES = ['essencial', 'completo'];

export const servicos = [
  {
    id: 'serv-1',
    nome: 'Atendimento psicológico individual',
    universidadeId: 'uni-1',
    categoria: 'Psicologia',
    descricaoCurta: 'Sessões semanais com estudantes de Psicologia, com supervisão de professores.',
    descricaoCompleta:
      'Acompanhamento psicológico individual na clínica-escola. Os atendimentos são feitos por estudantes dos últimos semestres, com supervisão de professores. A clínica entra em contato para agendar a primeira conversa.',
    modalidade: 'Presencial ou online',
    pacotes: TODOS_OS_PACOTES,
    status: 'Ativo',
    previsaoRetorno: null,
    novo: false,
  },
  {
    id: 'serv-2',
    nome: 'Plantão psicológico',
    universidadeId: 'uni-3',
    categoria: 'Psicologia',
    descricaoCurta: 'Escuta pontual para momentos difíceis, sem necessidade de acompanhamento contínuo.',
    descricaoCompleta:
      'Atendimento breve, em até três encontros, para acolher situações pontuais. Ao final, a equipe orienta sobre os próximos passos, se forem necessários.',
    modalidade: 'Online',
    pacotes: TODOS_OS_PACOTES,
    status: 'Sem vagas',
    previsaoRetorno: null,
    novo: false,
  },
  {
    id: 'serv-3',
    nome: 'Grupo sobre ansiedade e estresse',
    universidadeId: 'uni-2',
    categoria: 'Psicologia',
    descricaoCurta: 'Encontros em grupo para aprender formas de lidar com a ansiedade no dia a dia.',
    descricaoCompleta:
      'Grupo com até 10 participantes e oito encontros quinzenais. Os encontros são conduzidos por estudantes de Psicologia, com supervisão de professores.',
    modalidade: 'Online',
    pacotes: TODOS_OS_PACOTES,
    status: 'Ativo',
    previsaoRetorno: null,
    novo: true,
  },
  {
    id: 'serv-4',
    nome: 'Consulta de nutrição',
    universidadeId: 'uni-2',
    categoria: 'Nutrição',
    descricaoCurta: 'Avaliação nutricional e plano alimentar feito para a sua rotina.',
    descricaoCompleta:
      'Consulta com avaliação de hábitos e medidas, seguida de um plano alimentar. Inclui um retorno em até 30 dias para ajustes.',
    modalidade: 'Presencial',
    pacotes: TODOS_OS_PACOTES,
    status: 'Ativo',
    previsaoRetorno: null,
    novo: false,
  },
  {
    id: 'serv-5',
    nome: 'Reeducação alimentar em grupo',
    universidadeId: 'uni-4',
    categoria: 'Nutrição',
    descricaoCurta: 'Encontros práticos sobre compras, rótulos e marmitas saudáveis.',
    descricaoCompleta:
      'Programa em grupo com quatro encontros sobre escolhas alimentares no dia a dia. Os temas incluem leitura de rótulos, planejamento de compras e preparo de marmitas.',
    modalidade: 'Online',
    pacotes: TODOS_OS_PACOTES,
    status: 'Pausado',
    previsaoRetorno: '2026-12-01', // data no formato AAAA-MM-DD
    novo: false,
  },
  {
    id: 'serv-6',
    nome: 'Avaliação fisioterapêutica',
    universidadeId: 'uni-1',
    categoria: 'Fisioterapia',
    descricaoCurta: 'Avaliação de postura e movimentos, com orientação de exercícios.',
    descricaoCompleta:
      'Avaliação completa de postura, força e mobilidade na clínica-escola de Fisioterapia, com uma lista de exercícios para fazer em casa.',
    modalidade: 'Presencial',
    pacotes: TODOS_OS_PACOTES,
    status: 'Ativo',
    previsaoRetorno: null,
    novo: false,
  },
  {
    id: 'serv-7',
    nome: 'Fisioterapia para dor nas costas',
    universidadeId: 'uni-3',
    categoria: 'Fisioterapia',
    descricaoCurta: 'Sessões para aliviar dores na coluna causadas pela rotina de trabalho.',
    descricaoCompleta:
      'Até oito sessões de fisioterapia com foco em dores na coluna. Os atendimentos são feitos por estudantes, com supervisão de professores.',
    modalidade: 'Presencial',
    pacotes: TODOS_OS_PACOTES,
    status: 'Ativo',
    previsaoRetorno: null,
    novo: true,
  },
  {
    id: 'serv-8',
    nome: 'Ginástica laboral orientada',
    universidadeId: 'uni-4',
    categoria: 'Fisioterapia',
    descricaoCurta: 'Exercícios curtos para fazer durante o expediente, com orientação online.',
    descricaoCompleta:
      'Aulas online de 15 minutos com alongamentos e exercícios para fazer no trabalho, conduzidas por estudantes de Fisioterapia.',
    modalidade: 'Online',
    pacotes: TODOS_OS_PACOTES,
    status: 'Pausado',
    previsaoRetorno: null, // pausado sem data de retorno
    novo: false,
  },
  {
    id: 'serv-9',
    nome: 'Avaliação odontológica e limpeza',
    universidadeId: 'uni-2',
    categoria: 'Odontologia',
    descricaoCurta: 'Consulta de rotina com avaliação dos dentes e limpeza profissional.',
    descricaoCompleta:
      'Consulta na clínica de Odontologia com avaliação geral, limpeza e orientação de higiene bucal. Se for preciso, a equipe indica os próximos tratamentos.',
    modalidade: 'Presencial',
    pacotes: TODOS_OS_PACOTES,
    status: 'Ativo',
    previsaoRetorno: null,
    novo: false,
  },
  {
    id: 'serv-10',
    nome: 'Tratamento de cáries',
    universidadeId: 'uni-4',
    categoria: 'Odontologia',
    descricaoCurta: 'Restaurações simples feitas na clínica-escola de Odontologia.',
    descricaoCompleta:
      'Tratamento de cáries com restaurações simples. É preciso ter feito uma avaliação odontológica antes.',
    modalidade: 'Presencial',
    pacotes: TODOS_OS_PACOTES,
    status: 'Sem vagas',
    previsaoRetorno: null,
    novo: false,
  },
  {
    id: 'serv-11',
    nome: 'Orientação jurídica ao consumidor',
    universidadeId: 'uni-1',
    categoria: 'Assessoria jurídica',
    descricaoCurta: 'Dúvidas sobre compras, contratos de serviço e cobranças indevidas.',
    descricaoCompleta:
      'Atendimento no Núcleo de Prática Jurídica para orientar sobre direitos do consumidor. Os atendimentos são feitos por estudantes de Direito, com supervisão de professores.',
    modalidade: 'Presencial ou online',
    pacotes: TODOS_OS_PACOTES,
    status: 'Ativo',
    previsaoRetorno: null,
    novo: false,
  },
  {
    id: 'serv-12',
    nome: 'Orientação jurídica em direito de família',
    universidadeId: 'uni-3',
    categoria: 'Assessoria jurídica',
    descricaoCurta: 'Orientação sobre pensão, guarda e outras questões de família.',
    descricaoCompleta:
      'Primeira orientação sobre questões de família, com explicação dos caminhos possíveis. Os atendimentos são feitos por estudantes de Direito, com supervisão de professores.',
    modalidade: 'Presencial',
    pacotes: TODOS_OS_PACOTES,
    status: 'Ativo',
    previsaoRetorno: null,
    novo: false,
  },
];
