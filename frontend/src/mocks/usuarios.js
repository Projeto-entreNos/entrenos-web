/*
  DADOS DE EXEMPLO (fictícios). Não são pessoas nem empresas reais.
  Usuários de teste, um por perfil. Todos usam a senha "teste123".
  Só o service de autenticação (src/services/auth.js) lê este arquivo.
*/

export const usuarios = [
  {
    id: 'usr-1',
    nome: 'Ana Exemplo',
    email: 'colaborador@teste.entrenos',
    senha: 'teste123',
    perfil: 'colaborador',
    empresaId: 'emp-1',
    colaboradorId: 'col-1', // ligação com mocks/colaboradores.js
  },
  {
    id: 'usr-2',
    nome: 'Bruno Exemplo',
    email: 'empresa@teste.entrenos',
    senha: 'teste123',
    perfil: 'empresa',
    empresaId: 'emp-1',
  },
  {
    id: 'usr-3',
    nome: 'Carla Exemplo',
    email: 'admin@teste.entrenos',
    senha: 'teste123',
    perfil: 'admin',
    empresaId: null, // admin é da equipe EntreNós, não de uma empresa cliente
  },
];
