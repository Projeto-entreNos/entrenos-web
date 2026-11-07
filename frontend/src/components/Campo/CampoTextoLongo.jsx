import { useId } from 'react';
import CampoBase from './CampoBase';
import { idsDescricao } from './idsDescricao';

/**
 * Área de texto com contador de caracteres (tipo "Área de texto" do Figma).
 * - limite: número máximo de caracteres (padrão 500)
 * - value e onChange: obrigatórios para o contador funcionar (campo controlado)
 */
export default function CampoTextoLongo({
  rotulo,
  ajuda,
  erro,
  limite = 500,
  value = '',
  desabilitado = false,
  sobreEscuro = false,
  id,
  ...resto
}) {
  const idGerado = useId();
  const idCampo = id || idGerado;
  const contador = `${value.length}/${limite}`;

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
