import { useId } from 'react';
import CampoBase from './CampoBase';
import { idsDescricao } from './idsDescricao';

/**
 * Campo de texto de uma linha (componente "Campo de texto", tipo Texto, do Figma).
 * - rotulo: texto do label (obrigatório, por acessibilidade)
 * - ajuda: texto de ajuda abaixo do campo
 * - erro: mensagem de erro (substitui a ajuda e deixa a borda vermelha)
 * - tipo: type do input ("text", "email", "tel"...)
 * Demais props (value, onChange, placeholder, required...) vão direto para o <input>.
 */
export default function Campo({ rotulo, ajuda, erro, tipo = 'text', desabilitado = false, id, ...resto }) {
  const idGerado = useId();
  const idCampo = id || idGerado;

  return (
    <CampoBase id={idCampo} rotulo={rotulo} ajuda={ajuda} erro={erro} desabilitado={desabilitado}>
      <input
        id={idCampo}
        type={tipo}
        className="campo__entrada"
        disabled={desabilitado}
        aria-invalid={erro ? true : undefined}
        aria-describedby={idsDescricao(idCampo, { ajuda, erro })}
        {...resto}
      />
    </CampoBase>
  );
}
