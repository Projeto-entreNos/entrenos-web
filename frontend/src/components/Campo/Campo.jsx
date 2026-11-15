import { useId } from 'react';
import CampoBase from './CampoBase';
import { idsDescricao } from './idsDescricao';

// rotulo é obrigatório: é o nome acessível do campo
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
