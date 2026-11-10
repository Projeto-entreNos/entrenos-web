import { NavLink } from 'react-router-dom';
import './Abas.css';

const ITENS = [
  { rotulo: 'Empresas', para: '/admin/empresas' },
  { rotulo: 'Serviços', para: '/admin/servicos' },
  { rotulo: 'Solicitações', para: '/admin/solicitacoes' },
];

// Abas das telas de admin: cada aba é uma rota (o NavLink marca a atual com aria-current="page")
export default function AbasAdmin() {
  return (
    <nav aria-label="Seções do painel administrativo">
      <ul className="abas__lista">
        {ITENS.map((item) => (
          <li key={item.para}>
            <NavLink to={item.para} className="abas__aba">
              {item.rotulo}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
