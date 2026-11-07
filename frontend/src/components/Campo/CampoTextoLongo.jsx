import { useId } from 'react';
import CampoBase from './CampoBase';
import { idsDescricao } from './idsDescricao';

/**
 * Área de texto com contador de caracteres (tipo "Área de texto" do Figma).
 * - limite: número máximo de caracteres (padrão 500)
 * - value e onChange: obrigatórios para o contador funcionar (campo controlado)
 * - textoContador: opcional, troca o texto do contador (ex.: "6 linhas").
 *   Sem ele, o contador mostra os caracteres ("120/500").
 */
export default function CampoTextoLongo({
  rotulo,
  ajuda,
  erro,
  limite = 500,
  value = '',
  desabilitado = false,
  sobreEscuro = false,
  textoContador,
  id,
  ...resto
}) {
  const idGerado = useId();
  const idCampo = id || idGerado;
  const contador = textoContador ?? `${value.length}/${limite}`;

  return (
    <CampoBase
      id={idCampo}
      rotulo={rotulo}
      ajuda={ajuda}
      erro={erro}
      desabilitado={desabilitado}
      contador={contador}
      sobreEscuro={sobreEscuro}
    >
      <textarea
        id={idCampo}
        className="campo__entrada campo__entrada--longa"
        value={value}
        maxLength={limite}
        disabled={desabilitado}
        aria-invalid={erro ? true : undefined}
        aria-describedby={idsDescricao(idCampo, { ajuda, erro, contador: true })}
        {...resto}
      />
    </CampoBase>
  );
}
