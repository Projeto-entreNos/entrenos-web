import Icone from '../Icone/Icone';
import './Aviso.css';

const ICONE_POR_TIPO = {
  informacao: 'informacao',
  sucesso: 'sucesso',
  aviso: 'aviso',
  erro: 'erro',
};

// tipo: "informacao" | "sucesso" | "aviso" | "erro"
export default function Aviso({ tipo = 'informacao', titulo, children }) {
  return (
    <div className={`aviso aviso--${tipo}`} role={tipo === 'erro' ? 'alert' : 'status'}>
      <Icone nome={ICONE_POR_TIPO[tipo]} tamanho={24} className="aviso__icone" />
      <div className="aviso__conteudo">
        {titulo && <p className="aviso__titulo">{titulo}</p>}
        {children && <div className="aviso__texto">{children}</div>}
      </div>
    </div>
  );
}
