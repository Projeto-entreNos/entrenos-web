import { useEffect, useRef, useState } from 'react';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import Card from '../../components/Card/Card';
import Icone from '../../components/Icone/Icone';
import { recuperarSenha } from '../../services/auth';

export default function CartaoEmailEnviado({ email, aoVoltar }) {
  const refTitulo = useRef(null);
  const [reenviando, setReenviando] = useState(false);
  const [resultado, setResultado] = useState(null); // { tipo: "sucesso"|"erro", texto }

  useEffect(() => {
    refTitulo.current.focus();
  }, []);

  async function reenviar() {
    setReenviando(true);
    setResultado(null);
    try {
      await recuperarSenha(email);
      setResultado({ tipo: 'sucesso', texto: 'Enviamos um novo link.' });
    } catch (falha) {
      setResultado({ tipo: 'erro', texto: falha.message });
    } finally {
      setReenviando(false);
    }
  }

  return (
    <Card className="login__cartao">
      <span className="login__icone-status">
        <Icone nome="email-enviado" tamanho={28} />
      </span>

      <header className="login__cabecalho">
        <h1 className="login__titulo" tabIndex={-1} ref={refTitulo}>
          Verifique seu e-mail
        </h1>
        <p>
          Enviamos um link de recuperação para <strong className="login__email">{email}</strong>. O link é válido
          por 30 minutos.
        </p>
      </header>

      <Botao tamanho="grande" larguraTotal onClick={aoVoltar}>
        Voltar ao login
      </Botao>

      <div className="login__reenviar">
        <p>
          Não recebeu o e-mail?{' '}
          <button
            type="button"
            className="login__link login__link--sublinhado"
            onClick={reenviar}
            disabled={reenviando}
          >
            {reenviando ? 'Reenviando...' : 'Reenviar link'}
          </button>
        </p>
        <div aria-live="polite">{resultado && <Aviso tipo={resultado.tipo} titulo={resultado.texto} />}</div>
      </div>

      <p className="login__dica">Confira também a pasta de spam ou lixo eletrônico.</p>
    </Card>
  );
}
