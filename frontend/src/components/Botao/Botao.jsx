import { Link } from 'react-router-dom';
import Icone from '../Icone/Icone';
import './Botao.css';

/**
 * Botão do projeto (componente "Botão" do Figma).
 *
 * - variante: "principal" | "secundario" | "perigo" | "texto" | "principal-escuro"
 *   ("principal-escuro" = ação principal sobre blocos azul-abissal)
 * - tamanho: "normal" (48 px) | "grande" (62 px, usado na navbar e no hero)
 * - carregando: mostra o indicador e o texto "Enviando..." e bloqueia o clique
 * - para: se informado, vira um link do React Router (ex.: para="/login")
 * - larguraTotal: ocupa toda a largura do pai
 *
 * Lembre: só um botão "principal" por tela.
 */
export default function Botao({
  children,
  variante = 'principal',
  tamanho = 'normal',
  tipo = 'button',
  carregando = false,
  textoCarregando = 'Enviando...',
  desabilitado = false,
  larguraTotal = false,
  para,
  onClick,
  className = '',
  ...resto
}) {
  const classes = [
    'botao',
    `botao--${variante}`,
    `botao--${tamanho}`,
    larguraTotal ? 'botao--largura-total' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const conteudo = carregando ? (
    <>
      <Icone nome="carregando" tamanho={24} className="botao__indicador" />
      <span>{textoCarregando}</span>
    </>
  ) : (
    children
  );

  // Link: usado para navegar (ex.: "Entrar" na navbar)
  if (para && !desabilitado) {
    return (
      <Link to={para} className={classes} {...resto}>
        {conteudo}
      </Link>
    );
  }

  return (
    <button
      type={tipo}
      className={classes}
      onClick={onClick}
      disabled={desabilitado || carregando}
      aria-busy={carregando || undefined}
      {...resto}
    >
      {conteudo}
    </button>
  );
}
