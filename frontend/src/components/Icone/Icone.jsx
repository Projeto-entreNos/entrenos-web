import {
  AppWindow,
  ArrowLeft,
  Briefcase,
  Check,
  ChevronDown,
  Circle,
  CircleX,
  Coins,
  Eye,
  EyeOff,
  Info,
  Languages,
  LoaderCircle,
  Lock,
  Mail,
  MailCheck,
  Monitor,
  Package,
  Scale,
  TriangleAlert,
  Wallet,
  X,
} from 'lucide-react';

// Nomes em português para os ícones do lucide-react (https://lucide.dev/icons)
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
  voltar: ArrowLeft,
  email: Mail,
  'email-enviado': MailCheck,
  cadeado: Lock,
  // Landing
  janela: AppWindow,
  pacote: Package,
  moedas: Coins,
  carteira: Wallet,
  maleta: Briefcase,
  idiomas: Languages,
  monitor: Monitor,
  balanca: Scale,
};

// Sem "rotulo", o ícone é decorativo e fica escondido dos leitores de tela
export default function Icone({ nome, tamanho = 24, rotulo, className }) {
  const Componente = ICONES[nome];

  if (!Componente) {
    console.warn(`Icone: nome "${nome}" não existe.`);
    return null;
  }

  return (
    <Componente
      size={tamanho}
      strokeWidth={1.5}
      className={className}
      aria-hidden={rotulo ? undefined : true}
      aria-label={rotulo}
      role={rotulo ? 'img' : undefined}
      focusable="false"
    />
  );
}
