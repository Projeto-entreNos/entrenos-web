import Icone from '../Icone/Icone';
import './Aviso.css';

const ICONE_POR_TIPO = {
  informacao: 'informacao',
  sucesso: 'sucesso',
  aviso: 'aviso',
  erro: 'erro',
};

/**
 * Cartão de aviso com ícone, título e texto.
 * - tipo: "informacao" | "sucesso" | "aviso" | "erro"
 * - titulo: texto em destaque
 * - children: texto do aviso
 * Erros usam role="alert" (o leitor de tela anuncia na hora);
 * os demais usam role="status" (anúncio educado, sem interromper).
 */
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
