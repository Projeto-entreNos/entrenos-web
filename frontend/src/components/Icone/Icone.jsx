import {
  Check,
  ChevronDown,
  Circle,
  CircleX,
  Eye,
  EyeOff,
  Info,
  LoaderCircle,
  TriangleAlert,
  X,
} from 'lucide-react';

/*
  Ícones do projeto (biblioteca lucide-react, a mesma usada no Figma).
  Usamos nomes em português para a equipe não precisar decorar os nomes em inglês.
  Precisa de um ícone novo? Procure em https://lucide.dev/icons, importe acima
  e adicione aqui com um nome em português.
*/
const ICONES = {
  sucesso: Check,
  aviso: TriangleAlert,
  erro: CircleX,
  informacao: Info,
  fechar: X,
  seta: ChevronDown,
  mostrar: Eye,
  ocultar: EyeOff,
  carregando: LoaderCircle,
  pendente: Circle,
};

/**
 * Mostra um ícone.
 * - nome: chave do objeto ICONES (ex.: "sucesso").
 * - tamanho: em px (padrão 24).
 * - rotulo: texto para leitor de tela. Sem rótulo, o ícone é decorativo (escondido).
 */
export default function Icone({ nome, tamanho = 24, rotulo, className }) {
  const Componente = ICONES[nome];

  if (!Componente) {
    // Ajuda a achar erros de digitação durante o desenvolvimento
    console.warn(`Icone: nome "${nome}" não existe.`);
    return null;
  }

  return (
    <Componente
      size={tamanho}
      strokeWidth={1.5} // traço mais fino, igual aos ícones exportados do Figma
      className={className}
      aria-hidden={rotulo ? undefined : true}
      aria-label={rotulo}
      role={rotulo ? 'img' : undefined}
      focusable="false"
    />
  );
}
