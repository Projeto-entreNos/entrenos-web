import { useId, useState } from 'react';
import Icone from '../Icone/Icone';
import CampoBase from './CampoBase';
import { idsDescricao } from './idsDescricao';

// icone (opcional): nome de um ícone do componente Icone, mostrado à esquerda do texto
export default function CampoSenha({ rotulo = 'Senha', ajuda, erro, desabilitado = false, id, icone, ...resto }) {
  const idGerado = useId();
  const idCampo = id || idGerado;
  const [visivel, setVisivel] = useState(false);

  return (
    <CampoBase id={idCampo} rotulo={rotulo} ajuda={ajuda} erro={erro} desabilitado={desabilitado}>
      <div className="campo__caixa">
        {icone && <Icone nome={icone} tamanho={20} className="campo__icone" />}
        <input
          id={idCampo}
          type={visivel ? 'text' : 'password'}
          className={`campo__entrada campo__entrada--com-botao${icone ? ' campo__entrada--com-icone' : ''}`}
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
