import { Link } from 'react-router-dom';
import './Rodape.css';

export default function Rodape() {
  return (
    <footer className="rodape">
      <p>© 2026 EntreNós. Todos os direitos reservados.</p>
      <nav aria-label="Documentos" className="rodape__links">
        <Link to="/termos" className="rodape__link">
          Termos de uso
        </Link>
        <Link to="/privacidade" className="rodape__link">
          Política de privacidade
        </Link>
      </nav>
    </footer>
  );
}
