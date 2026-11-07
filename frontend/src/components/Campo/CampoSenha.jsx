import { useId, useState } from 'react';
import Icone from '../Icone/Icone';
import CampoBase from './CampoBase';
import { idsDescricao } from './idsDescricao';

/**
 * Campo de senha com botão de mostrar/ocultar (tipo Senha do Figma).
 * Recebe as mesmas props do Campo.
 */
export default function CampoSenha({ rotulo = 'Senha', ajuda, erro, desabilitado = false, id, ...resto }) {
  const idGerado = useId();
  const idCampo = id || idGerado;
  const [visivel, setVisivel] = useState(false);

  return (
    <CampoBase id={idCampo} rotulo={rotulo} ajuda={ajuda} erro={erro} desabilitado={desabilitado}>
      <div className="campo__caixa">
        <input
          id={idCampo}
          type={visivel ? 'text' : 'password'}
          className="campo__entrada campo__entrada--com-botao"
          disabled={desabilitado}
          aria-invalid={erro ? true : undefined}
          aria-describedby={idsDescricao(idCampo, { ajuda, erro })}
          {...resto}
        />
        <button
          type="button"
          className="campo__botao-icone"
          onClick={() => setVisivel(!visivel)}
          disabled={desabilitado}
          aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={visivel}
        >
          <Icone nome={visivel ? 'ocultar' : 'mostrar'} tamanho={20} />
        </button>
      </div>
    </CampoBase>
  );
}
