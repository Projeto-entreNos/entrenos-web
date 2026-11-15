/*
  DADOS DE EXEMPLO (fictícios). Pessoas inventadas, e-mails em domínio ".exemplo".
  Status: 'Convidado', 'Ativo', 'Convite expirado'. O convite vale 7 dias.
  Os convites em aberto da Alfa são contados a partir de hoje, para os status
  (e os links de ativação de teste) não mudarem com o passar dos dias.
  - Alfa (emp-1, contrato Ativo, 10 vagas): 7 colaboradores, 7 vagas ocupadas
  - Gama (emp-3, contrato Encerrado): 3 colaboradores
  - Beta (emp-2, aguardando pagamento): nenhum, porque ainda não pode convidar
  tokenConvite: código do link de ativação (/ativar/:token), só nos convites em aberto.
*/

import { dataDeHoje, somarDias } from '../utils/datas';

function diasAtras(dias) {
  return somarDias(dataDeHoje(), -dias);
}

export const colaboradores = [
  {
    id: 'col-1',
    nome: 'Ana Exemplo', // usuária de teste do perfil colaborador
    email: 'colaborador@teste.entrenos',
    empresaId: 'emp-1',
    status: 'Ativo',
    conviteEnviadoEm: '2026-09-02',
    ativadoEm: '2026-09-03',
  },
  {
    id: 'col-2',
    nome: 'Diego Exemplo',
    email: 'diego@alfa.exemplo.com',
    empresaId: 'emp-1',
    status: 'Ativo',
    conviteEnviadoEm: '2026-09-02',
    ativadoEm: '2026-09-04',
  },
  {
    id: 'col-3',
    nome: 'Elisa Exemplo',
    email: 'elisa@alfa.exemplo.com',
    empresaId: 'emp-1',
    status: 'Ativo',
    conviteEnviadoEm: '2026-09-02',
    ativadoEm: '2026-09-02',
  },
  {
    id: 'col-4',
    nome: 'Fábio Exemplo',
    email: 'fabio@alfa.exemplo.com',
    empresaId: 'emp-1',
    status: 'Ativo',
    conviteEnviadoEm: '2026-09-10',
    ativadoEm: '2026-09-12',
  },
  {
    id: 'col-5',
    nome: 'Gabriela Exemplo',
    email: 'gabriela@alfa.exemplo.com',
    empresaId: 'emp-1',
    status: 'Convidado',
    conviteEnviadoEm: diasAtras(1),
    tokenConvite: 'convite-gabriela',
    ativadoEm: null,
  },
  {
    id: 'col-6',
    nome: 'Heitor Exemplo',
    email: 'heitor@alfa.exemplo.com',
    empresaId: 'emp-1',
    status: 'Convidado',
    conviteEnviadoEm: diasAtras(2),
    tokenConvite: 'convite-heitor',
    ativadoEm: null,
  },
  {
    id: 'col-7',
    nome: 'Íris Exemplo',
    email: 'iris@alfa.exemplo.com',
    empresaId: 'emp-1',
    status: 'Convite expirado',
    conviteEnviadoEm: diasAtras(10), // mais de 7 dias
    tokenConvite: 'convite-iris',
    ativadoEm: null,
  },
  {
    id: 'col-8',
    nome: 'João Exemplo',
    email: 'joao@gama.exemplo.com',
    empresaId: 'emp-3',
    status: 'Ativo',
    conviteEnviadoEm: '2025-06-03',
    ativadoEm: '2025-06-03',
  },
  {
    id: 'col-9',
    nome: 'Karina Exemplo',
    email: 'karina@gama.exemplo.com',
    empresaId: 'emp-3',
    status: 'Ativo',
    conviteEnviadoEm: '2025-06-03',
    ativadoEm: '2025-06-05',
  },
  {
    id: 'col-10',
    nome: 'Lucas Exemplo',
    email: 'lucas@gama.exemplo.com',
    empresaId: 'emp-3',
    status: 'Convite expirado',
    conviteEnviadoEm: '2025-07-01',
    ativadoEm: null,
  },
];
