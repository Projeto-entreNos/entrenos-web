/*
  Cota diária de buscas com IA, guardada no navegador (localStorage) por usuário.
  Formato salvo: { data: "AAAA-MM-DD", usadas: 3 }. Se a data salva não for hoje, a cota zera.
  TODO: quando a API existir, a cota deve ser controlada também no back-end
  (o localStorage pode ser apagado pelo usuário).
*/

export const LIMITE_BUSCAS_DIA = 10;

function chave(usuarioId) {
  return `entrenos:buscas-ia:${usuarioId}`;
}

// Data de hoje no fuso do computador, no formato AAAA-MM-DD
function hoje() {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

function buscasUsadasHoje(usuarioId) {
  try {
    const salvo = JSON.parse(localStorage.getItem(chave(usuarioId)));
    return salvo && salvo.data === hoje() ? salvo.usadas : 0;
  } catch {
    return 0;
  }
}

export function lerBuscasRestantes(usuarioId) {
  return Math.max(0, LIMITE_BUSCAS_DIA - buscasUsadasHoje(usuarioId));
}

// Gasta uma busca e devolve quantas sobraram
export function registrarBusca(usuarioId) {
  const usadas = buscasUsadasHoje(usuarioId) + 1;
  try {
    localStorage.setItem(chave(usuarioId), JSON.stringify({ data: hoje(), usadas }));
  } catch {
    // Sem localStorage a cota vale só enquanto a página estiver aberta
  }
  return Math.max(0, LIMITE_BUSCAS_DIA - usadas);
}
