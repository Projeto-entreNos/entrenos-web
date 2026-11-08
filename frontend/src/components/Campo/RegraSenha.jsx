import Icone from '../Icone/Icone';
import './Campo.css';

const ICONE_POR_ESTADO = {
  pendente: 'pendente',
  cumprida: 'sucesso',
  erro: 'erro',
};

// Estado em texto para leitores de tela: nunca indicado só pela cor
const TEXTO_ESTADO = {
  pendente: 'pendente',
  cumprida: 'cumprida',
  erro: 'não cumprida',
};

// estado: "pendente" | "cumprida" | "erro"
export default function RegraSenha({ estado = 'pendente', children }) {
  return (
    <p className={`regra-senha regra-senha--${estado}`}>
      <Icone nome={ICONE_POR_ESTADO[estado]} tamanho={18} />
      {children}
      <span className="somente-leitor-tela">: {TEXTO_ESTADO[estado]}</span>
    </p>
  );
}
