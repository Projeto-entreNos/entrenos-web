import EmConstrucao from '../../components/EmConstrucao/EmConstrucao';

// TODO: implementar a tela (/ativar/:token). Tela cheia, sem navbar: fica fora dos layouts.
export default function AtivarConta() {
  return <EmConstrucao nome="Ativação de conta" rota="/ativar/:token" comMargem />;
}
