import EmConstrucao from '../../components/EmConstrucao/EmConstrucao';

// Tela "Ativação de conta" (/ativar/:token).
// No Figma ("Ativacao-Padrão") ela é uma tela cheia, sem navbar, por isso fica fora dos layouts.
// Troque este conteúdo pela tela de verdade. A rota já está pronta em src/App.jsx.
export default function AtivarConta() {
  return <EmConstrucao nome="Ativação de conta" rota="/ativar/:token" comMargem />;
}
