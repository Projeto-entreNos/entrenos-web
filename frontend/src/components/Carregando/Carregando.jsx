import Icone from '../Icone/Icone';
import './Carregando.css';

export default function Carregando({ texto = 'Carregando...' }) {
  return (
    <div className="carregando" role="status">
      <Icone nome="carregando" tamanho={24} className="carregando__icone" />
      <span>{texto}</span>
    </div>
  );
}
