import Icone from '../Icone/Icone';
import './Selo.css';

// Ícone de cada tipo, como no Figma (o estado nunca é indicado só pela cor)
const ICONE_POR_TIPO = {
  sucesso: 'sucesso',
  aviso: 'aviso',
  erro: 'erro',
  neutro: 'informacao',
};

/**
 * Selo de status em formato de pílula (ex.: "Ativo", "Sem vagas").
 * - tipo: "sucesso" | "aviso" | "erro" | "neutro"
 * - children: o texto do selo (obrigatório)
 * A largura se ajusta ao texto, que nunca quebra linha.
 */
export default function Selo({ tipo = 'neutro', children }) {
  return (
    <span className={`selo selo--${tipo}`}>
      <Icone nome={ICONE_POR_TIPO[tipo]} tamanho={14} />
      {children}
    </span>
  );
}
