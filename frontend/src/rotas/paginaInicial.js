// Página para onde cada perfil vai depois do login (e quando tenta abrir uma rota sem permissão)
const PAGINA_INICIAL_POR_PERFIL = {
  colaborador: '/beneficios',
  empresa: '/empresa',
  admin: '/admin/empresas',
};

export function paginaInicial(perfil) {
  return PAGINA_INICIAL_POR_PERFIL[perfil] || '/';
}
