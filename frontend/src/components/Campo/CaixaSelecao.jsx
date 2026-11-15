import { useId } from 'react';
import Icone from '../Icone/Icone';
import './Campo.css';

export default function CaixaSelecao({ children, ajuda, erro, id, ...resto }) {
  const idGerado = useId();
  const idCampo = id || idGerado;
  const idAjuda = ajuda ? `${idCampo}-ajuda` : '';
  const idErro = erro ? `${idCampo}-erro` : '';
  const descricao = [idAjuda, idErro].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`caixa-selecao ${erro ? 'caixa-selecao--erro' : ''}`}>
      <div className="caixa-selecao__linha">
        {/* Input real invisível sobre a caixa desenhada: mantém clique, teclado e leitor de tela */}
        <span className="caixa-selecao__caixa">
          <input
            id={idCampo}
            type="checkbox"
            className="caixa-selecao__entrada"
            aria-invalid={erro ? true : undefined}
            aria-describedby={descricao}
            {...resto}
          />
          <span className="caixa-selecao__marca" aria-hidden="true">
            <Icone nome="sucesso" tamanho={16} />
          </span>
        </span>

        <div className="caixa-selecao__textos">
          <label htmlFor={idCampo} className="caixa-selecao__rotulo">
            {children}
          </label>
          {ajuda && (
            <p id={idAjuda} className="caixa-selecao__ajuda">
              {ajuda}
            </p>
          )}
        </div>
      </div>

      {erro && (
        <p id={idErro} className="campo__erro">
          <Icone nome="erro" tamanho={16} />
          {erro}
        </p>
      )}
    </div>
  );
}
