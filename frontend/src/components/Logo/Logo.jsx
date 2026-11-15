import logoFundoClaro from '../../assets/logo-fundo-claro.svg';
import logoFundoEscuro from '../../assets/logo-fundo-escuro.svg';
import './Logo.css';

/**
 * - fundo: "claro" (logo escura) | "escuro" (logo branca)
 * - tamanho: "normal" (102 x 36) | "grande" (179 x 63)
 */
export default function Logo({ fundo = 'claro', tamanho = 'normal' }) {
  const imagem = fundo === 'escuro' ? logoFundoEscuro : logoFundoClaro;

  return <img src={imagem} alt="EntreNós" className={`logo logo--${tamanho}`} />;
}
