import { useId } from 'react';
import Icone from '../Icone/Icone';
import CampoBase from './CampoBase';
import { idsDescricao } from './idsDescricao';

// rotulo é obrigatório: é o nome acessível do campo
// icone (opcional): nome de um ícone do componente Icone, mostrado à esquerda do texto
export default function Campo({ rotulo, ajuda, erro, tipo = 'text', desabilitado = false, id, icone, ...resto }) {
  const idGerado = useId();
  const idCampo = id || idGerado;

  const entrada = (
    <input
      id={idCampo}
      type={tipo}
      className={icone ? 'campo__entrada campo__entrada--com-icone' : 'campo__entrada'}
      disabled={desabilitado}
      aria-invalid={erro ? true : undefined}
      aria-describedby={idsDescricao(idCampo, { ajuda, erro })}
      {...resto}
    />
  );

  return (
    <CampoBase id={idCampo} rotulo={rotulo} ajuda={ajuda} erro={erro} desabilitado={desabilitado}>
      {icone ? (
        <div className="campo__caixa">
          <Icone nome={icone} tamanho={20} className="campo__icone" />
          {entrada}
        </div>
      ) : (
        entrada
      )}
    </CampoBase>
  );
}
