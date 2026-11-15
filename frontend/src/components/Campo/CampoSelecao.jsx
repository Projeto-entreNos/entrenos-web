import { useId } from 'react';
import Icone from '../Icone/Icone';
import CampoBase from './CampoBase';
import { idsDescricao } from './idsDescricao';

/**
 * - opcoes: [{ valor, rotulo }]
 * - ocultarRotulo: esconde o rótulo na tela e o mantém para leitores de tela
 */
export default function CampoSelecao({
  rotulo,
  opcoes = [],
  ajuda,
  erro,
  desabilitado = false,
  ocultarRotulo = false,
  id,
  ...resto
}) {
  const idGerado = useId();
  const idCampo = id || idGerado;

  return (
    <div className={ocultarRotulo ? 'campo-selecao--sem-rotulo' : undefined}>
      <CampoBase id={idCampo} rotulo={rotulo} ajuda={ajuda} erro={erro} desabilitado={desabilitado}>
        <div className="campo__caixa">
          <select
            id={idCampo}
            className="campo__entrada campo__entrada--selecao"
            disabled={desabilitado}
            aria-invalid={erro ? true : undefined}
            aria-describedby={idsDescricao(idCampo, { ajuda, erro })}
            {...resto}
          >
            {opcoes.map((opcao) => (
              <option key={opcao.valor} value={opcao.valor}>
                {opcao.rotulo}
              </option>
            ))}
          </select>
          <span className="campo__seta">
            <Icone nome="seta" tamanho={20} />
          </span>
        </div>
      </CampoBase>
    </div>
  );
}
