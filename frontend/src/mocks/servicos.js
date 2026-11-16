/*
  DADOS DE EXEMPLO (fictícios).
  Categorias iguais às da landing page.
  Os dois pacotes dão acesso ao catálogo completo: todo serviço tem pacotes ['essencial', 'completo'].
  Status possíveis: 'Ativo', 'Sem vagas', 'Pausado'. Só 'Ativo' pode ser solicitado.
  Modalidade: 'Presencial', 'Online' ou 'Híbrido'; "local" é o detalhe opcional (texto curto).
  O selo "Novo" é calculado no service: serviço criado há até 30 dias (criadoEm).
  Os serviços "novos" são contados a partir de hoje, para o selo não sumir com o passar dos dias.
*/

import { dataDeHoje, somarDias } from '../utils/datas';

function diasAtras(dias) {
  return somarDias(dataDeHoje(), -dias);
}

export const categorias = [
  'Apoio contábil e financeiro',
  'Consultoria em gestão e negócios',
  'Apoio educacional e idiomas',
  'Capacitação em tecnologia básica',
  'Assessoria jurídica',
];

const TODOS_OS_PACOTES = ['essencial', 'completo'];

export const servicos = [
  {
    id: 'serv-1',
    nome: 'Consultoria de negócios',
    universidadeId: 'uni-3',
    categoria: 'Consultoria em gestão e negócios',
    descricaoCurta: 'Para quem quer abrir um pequeno negócio: planejamento, marketing digital e organização de caixa.',
    descricaoCompleta:
      'Consultoria com estudantes de Administração, com supervisão de professores. Ajuda a tirar a ideia do papel: plano de negócio, preço de venda, divulgação nas redes e controle do caixa.',
    modalidade: 'Híbrido',
    local: '',
    pacotes: TODOS_OS_PACOTES,
    status: 'Ativo',
    previsaoRetorno: null,
    criadoEm: '2026-03-02',
  },
  {
    id: 'serv-2',
    nome: 'Ajuda com a declaração do Imposto de Renda',
    universidadeId: 'uni-2',
    categoria: 'Apoio contábil e financeiro',
    descricaoCurta: 'Orientação para preencher e enviar a declaração anual do Imposto de Renda.',
    descricaoCompleta:
      'Atendimento no Núcleo de Apoio Contábil e Fiscal com estudantes de Ciências Contábeis, com supervisão de professores. Explica quem precisa declarar, quais documentos separar e como evitar a malha fina.',
    modalidade: 'Presencial',
    local: '',
    pacotes: TODOS_OS_PACOTES,
    status: 'Sem vagas',
    previsaoRetorno: null,
    criadoEm: '2026-03-02',
  },
  {
    id: 'serv-3',
    nome: 'Conversação em inglês',
    universidadeId: 'uni-4',
    categoria: 'Apoio educacional e idiomas',
    descricaoCurta: 'Encontros em grupo para praticar a conversação em inglês do dia a dia e do trabalho.',
    descricaoCompleta:
      'Turmas pequenas, separadas por nível, conduzidas por estudantes de Letras, com supervisão de professores. Os encontros são semanais e focam em situações reais, como reuniões, e-mails e viagens.',
    modalidade: 'Online',
    local: '',
    pacotes: TODOS_OS_PACOTES,
    status: 'Ativo',
    previsaoRetorno: null,
    criadoEm: diasAtras(10),
  },
  {
    id: 'serv-4',
    nome: 'Educação financeira',
    universidadeId: 'uni-2',
    categoria: 'Apoio contábil e financeiro',
    descricaoCurta: 'Orçamento doméstico, saída das dívidas e dúvidas fiscais básicas, com estudantes de contábeis.',
    descricaoCompleta:
      'Educação financeira pessoal com estudantes de ciências contábeis do NAF (Núcleo de Apoio Contábil e Fiscal), com supervisão de professores. Indicado para organizar o orçamento doméstico, planejar a saída das dívidas e tirar dúvidas fiscais básicas, como a declaração do Imposto de Renda.',
    modalidade: 'Presencial',
    local: 'Núcleo de Apoio Contábil e Fiscal',
    pacotes: TODOS_OS_PACOTES,
    status: 'Ativo',
    previsaoRetorno: null,
    criadoEm: diasAtras(10),
  },
  {
    id: 'serv-5',
    nome: 'Formalização de MEI',
    universidadeId: 'uni-3',
    categoria: 'Consultoria em gestão e negócios',
    descricaoCurta: 'Passo a passo para abrir um MEI, emitir nota fiscal e manter as obrigações em dia.',
    descricaoCompleta:
      'Orientação com estudantes de Administração, com supervisão de professores, para quem trabalha por conta própria. Explica as vantagens do MEI, como fazer o cadastro, emitir nota fiscal e pagar a guia mensal.',
    modalidade: 'Online',
    local: '',
    pacotes: TODOS_OS_PACOTES,
    status: 'Ativo',
    previsaoRetorno: null,
    criadoEm: '2026-03-02',
  },
  {
    id: 'serv-6',
    nome: 'Idiomas e reforço escolar',
    universidadeId: 'uni-4',
    categoria: 'Apoio educacional e idiomas',
    descricaoCurta: 'Oficinas de inglês e espanhol básico e reforço escolar para os filhos, com estudantes de Letras.',
    descricaoCompleta:
      'Oficinas de inglês e espanhol para iniciantes e reforço escolar para os filhos em português e redação. As aulas são dadas por estudantes de Letras e das licenciaturas, com supervisão de professores.',
    modalidade: 'Híbrido',
    local: '',
    pacotes: TODOS_OS_PACOTES,
    status: 'Ativo',
    previsaoRetorno: null,
    criadoEm: diasAtras(10),
  },
  {
    id: 'serv-7',
    nome: 'Marketing digital para pequenos negócios',
    universidadeId: 'uni-3',
    categoria: 'Consultoria em gestão e negócios',
    descricaoCurta: 'Como divulgar o seu negócio nas redes sociais e vender mais pela internet.',
    descricaoCompleta:
      'Oficina prática com estudantes de Administração, com supervisão de professores. Ensina a montar um perfil comercial, planejar postagens e atender clientes pelo WhatsApp para aumentar as vendas.',
    modalidade: 'Online',
    local: '',
    pacotes: TODOS_OS_PACOTES,
    status: 'Ativo',
    previsaoRetorno: null,
    criadoEm: diasAtras(10),
  },
  {
    id: 'serv-8',
    nome: 'Reforço escolar de matemática',
    universidadeId: 'uni-4',
    categoria: 'Apoio educacional e idiomas',
    descricaoCurta: 'Aulas de reforço de matemática para os filhos do ensino fundamental.',
    descricaoCompleta:
      'Aulas em pequenos grupos com estudantes das licenciaturas, com supervisão de professores, para revisar a matéria da escola e ajudar nas tarefas de casa.',
    modalidade: 'Presencial',
    local: '',
    pacotes: TODOS_OS_PACOTES,
    status: 'Pausado',
    previsaoRetorno: null, // pausado sem data de retorno
    criadoEm: '2026-03-02',
  },
  {
    id: 'serv-9',
    nome: 'Informática e planilhas',
    universidadeId: 'uni-1',
    categoria: 'Capacitação em tecnologia básica',
    descricaoCurta: 'Primeiros passos no computador, uso de planilhas e introdução ao mundo digital.',
    descricaoCompleta:
      'Oficinas de informática com estudantes dos cursos de tecnologia, com supervisão de professores. Inclui uso do computador, planilhas e serviços digitais do dia a dia, como e-mail e aplicativos. Turmas pequenas, separadas por nível.',
    modalidade: 'Presencial',
    local: 'Laboratório de informática',
    pacotes: TODOS_OS_PACOTES,
    status: 'Sem vagas',
    previsaoRetorno: null,
    criadoEm: '2026-03-02',
  },
  {
    id: 'serv-10',
    nome: 'Segurança na internet',
    universidadeId: 'uni-1',
    categoria: 'Capacitação em tecnologia básica',
    descricaoCurta: 'Como criar senhas fortes, reconhecer golpes e usar o celular e o computador com segurança.',
    descricaoCompleta:
      'Oficina com estudantes dos cursos de tecnologia, com supervisão de professores. Mostra como proteger contas, identificar golpes por mensagem e e-mail e fazer compras e pagamentos pela internet com segurança.',
    modalidade: 'Online',
    local: '',
    pacotes: TODOS_OS_PACOTES,
    status: 'Ativo',
    previsaoRetorno: null,
    criadoEm: '2026-03-02',
  },
  {
    id: 'serv-11',
    nome: 'Assessoria jurídica',
    universidadeId: 'uni-1',
    categoria: 'Assessoria jurídica',
    descricaoCurta: 'Orientação sobre dúvidas do dia a dia, como contratos, consumo e família.',
    descricaoCompleta:
      'Orientação jurídica feita por estudantes do Núcleo de Prática Jurídica, com supervisão de professores. Ajuda com dúvidas do dia a dia, como contratos, direitos do consumidor e questões de família.',
    modalidade: 'Híbrido',
    local: 'Online ou no Núcleo de Prática Jurídica',
    pacotes: TODOS_OS_PACOTES,
    status: 'Pausado',
    previsaoRetorno: '2027-02-01', // data no formato AAAA-MM-DD
    criadoEm: '2026-03-02',
  },
  {
    id: 'serv-12',
    nome: 'Orientação sobre direitos trabalhistas',
    universidadeId: 'uni-1',
    categoria: 'Assessoria jurídica',
    descricaoCurta: 'Dúvidas sobre carteira assinada, férias, rescisão e outros direitos do trabalhador.',
    descricaoCompleta:
      'Primeira orientação sobre direito do trabalho no Núcleo de Prática Jurídica, com estudantes de Direito e supervisão de professores. Explica direitos, prazos e os caminhos possíveis em cada caso.',
    modalidade: 'Híbrido',
    local: '',
    pacotes: TODOS_OS_PACOTES,
    status: 'Ativo',
    previsaoRetorno: null,
    criadoEm: '2026-03-02',
  },
];
