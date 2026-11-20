import { useEffect, useRef } from 'react';
import Botao from '../../components/Botao/Botao';
import Card from '../../components/Card/Card';
import Icone from '../../components/Icone/Icone';

// A redefinição de senha por e-mail fica fora do MVP: a equipe EntreNós troca a senha
export default function CartaoPedidoRecebido({ aoVoltar }) {
  const refTitulo = useRef(null);

  useEffect(() => {
    refTitulo.current.focus();
  }, []);

  return (
    <Card className="login__cartao">
      <span className="login__icone-status">
        <Icone nome="email-enviado" tamanho={28} />
      </span>

      <header className="login__cabecalho">
        <h1 className="login__titulo" tabIndex={-1} ref={refTitulo}>
          Recebemos seu pedido
        </h1>
        <p>Por enquanto, a troca de senha é feita pela equipe EntreNós: fale com o RH da sua empresa.</p>
      </header>

      <Botao tamanho="grande" larguraTotal onClick={aoVoltar}>
        Voltar ao login
      </Botao>
    </Card>
  );
}
