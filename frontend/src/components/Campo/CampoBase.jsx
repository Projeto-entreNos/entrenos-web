import Icone from '../Icone/Icone';
import './Campo.css';

/*
  Estrutura comum a todos os campos: rótulo em cima, entrada no meio e rodapé
  (ajuda ou erro) embaixo. Os campos específicos (Campo, CampoSenha, CampoTextoLongo,
  CampoSelecao) usam esta base para não repetir código.
*/

// sobreEscuro: textos claros para usar o campo sobre blocos azul-abissal (desligado por padrão)
export default function CampoBase({ id, rotulo, ajuda, erro, desabilitado, contador, sobreEscuro = false, children }) {
  const classes = [
    'campo',
    erro ? 'campo--erro' : '',
    desabilitado ? 'campo--desabilitado' : '',
    sobreEscuro ? 'campo--sobre-escuro' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <label htmlFor={id} className="campo__rotulo">
        {rotulo}
      </label>

      {children}

      {(ajuda || erro || contador) && (
        <div className="campo__rodape">
          {/* O erro substitui a ajuda, como no Figma */}
          {erro ? (
            <p id={`${id}-erro`} className="campo__erro">
              <Icone nome="erro" tamanho={16} />
              {erro}
            </p>
          ) : (
            ajuda && (
              <p id={`${id}-ajuda`} className="campo__ajuda">
                {ajuda}
              </p>
            )
          )}

          {contador && (
            <p id={`${id}-contador`} className="campo__contador">
              {contador}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
