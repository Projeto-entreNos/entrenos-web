import Icone from '../Icone/Icone';
import './Selo.css';

// O estado nunca é indicado só pela cor: cada tipo tem um ícone
const ICONE_POR_TIPO = {
  sucesso: 'sucesso',
  aviso: 'aviso',
  erro: 'erro',
  neutro: 'informacao',
};

// tipo: "sucesso" | "aviso" | "erro" | "neutro"
export default function Selo({ tipo = 'neutro', children }) {
  return (
    <span className={`selo selo--${tipo}`}>
      <Icone nome={ICONE_POR_TIPO[tipo]} tamanho={14} />
      {children}
    </span>
  );
}
