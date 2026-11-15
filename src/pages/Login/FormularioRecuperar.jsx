import { useEffect, useRef, useState } from 'react';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import Campo from '../../components/Campo/Campo';
import Card from '../../components/Card/Card';
import { recuperarSenha } from '../../services/auth';
import { validarEmail } from '../../utils/validarEmail';

const ID_EMAIL = 'recuperar-email';

export default function FormularioRecuperar({ aoEnviar, aoVoltar }) {
  const refTitulo = useRef(null);
  const [email, setEmail] = useState('');
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState('');

  // O título recebe o foco para o leitor de tela anunciar a troca de etapa
  useEffect(() => {
    refTitulo.current.focus();
  }, []);

  const erroEmail = tentouEnviar ? validarEmail(email) : '';

  async function enviar(evento) {
    evento.preventDefault();
    setTentouEnviar(true);
    setErroEnvio('');

    if (validarEmail(email)) {
      document.getElementById(ID_EMAIL).focus();
      return;
    }

    setEnviando(true);
    try {
      await recuperarSenha(email.trim());
      aoEnviar(email.trim());
    } catch (falha) {
      setErroEnvio(falha.message);
      setEnviando(false);
    }
  }

  return (
    <>
      <Card className="login__cartao">
        <header className="login__cabecalho">
          <h1 className="login__titulo" tabIndex={-1} ref={refTitulo}>
            Esqueceu sua senha?
          </h1>
          <p>Informe o e-mail cadastrado e enviaremos um link para você criar uma nova senha.</p>
        </header>

        <form className="login__formulario" onSubmit={enviar} noValidate>
          <Campo
            id={ID_EMAIL}
            rotulo="E-mail"
            tipo="email"
            icone="email"
            placeholder="voce@empresa.com.br"
            autoComplete="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            erro={erroEmail}
          />

          {/* O Aviso de erro tem role="alert": o leitor de tela anuncia quando ele aparece */}
          {erroEnvio && <Aviso tipo="erro" titulo={erroEnvio} />}

          <Botao tipo="submit" tamanho="grande" larguraTotal carregando={enviando}>
            Enviar link de recuperação
          </Botao>
        </form>
      </Card>

      <p className="login__rodape">
        Lembrou da senha?{' '}
        <button type="button" className="login__link login__link--sublinhado" onClick={aoVoltar}>
          Entrar
        </button>
      </p>
    </>
  );
}
