import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import Campo from '../../components/Campo/Campo';
import CampoSenha from '../../components/Campo/CampoSenha';
import Card from '../../components/Card/Card';
import { useAuth } from '../../context/AuthContext';
import { paginaInicial } from '../../rotas/paginaInicial';
import { validarEmail } from '../../utils/validarEmail';

const ID_CAMPO = {
  email: 'login-email',
  senha: 'login-senha',
};

function validarLogin({ email, senha }) {
  const erros = {};
  const erroEmail = validarEmail(email);
  if (erroEmail) erros.email = erroEmail;
  if (!senha) erros.senha = 'Informe sua senha.';
  return erros;
}

export default function FormularioEntrar({ aoEsquecerSenha }) {
  const { login, sessaoExpirada } = useAuth();
  const navegar = useNavigate();
  const local = useLocation();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState('');

  // Os erros só aparecem depois da primeira tentativa e somem assim que o campo é corrigido
  const erros = tentouEnviar ? validarLogin({ email, senha }) : {};

  async function enviar(evento) {
    evento.preventDefault();
    setTentouEnviar(true);
    setErroEnvio('');

    const errosAtuais = validarLogin({ email, senha });
    const primeiroComErro = Object.keys(errosAtuais)[0];
    if (primeiroComErro) {
      document.getElementById(ID_CAMPO[primeiroComErro]).focus();
      return;
    }

    setEnviando(true);
    try {
      const usuario = await login(email, senha);
      // Volta para a página que a pessoa tentou abrir, ou vai para a inicial do perfil
      navegar(local.state?.de || paginaInicial(usuario.perfil), { replace: true });
    } catch (falha) {
      setErroEnvio(`${falha.message} Verifique os dados e tente novamente.`);
      setEnviando(false);
    }
  }

  // Com e-mail ou senha incorretos, os dois campos ficam com a borda de erro
  const credenciaisInvalidas = erroEnvio ? true : undefined;

  return (
    <>
      <Card className="login__cartao">
        <header className="login__cabecalho">
          <h1 className="login__titulo">Entrar</h1>
          <p>Use seu e-mail corporativo e sua senha.</p>
        </header>

        {/* O Aviso de erro tem role="alert": o leitor de tela anuncia quando ele aparece */}
        {erroEnvio && <Aviso tipo="erro" titulo={erroEnvio} />}
        {sessaoExpirada && !erroEnvio && <Aviso tipo="aviso" titulo="Sua sessão terminou. Entre de novo para continuar." />}

        <form className="login__formulario" onSubmit={enviar} noValidate>
          <Campo
            id={ID_CAMPO.email}
            rotulo="E-mail"
            tipo="email"
            icone="email"
            placeholder="voce@empresa.com.br"
            autoComplete="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            erro={erros.email}
            aria-invalid={erros.email ? true : credenciaisInvalidas}
          />

          <CampoSenha
            id={ID_CAMPO.senha}
            icone="cadeado"
            placeholder="Digite sua senha"
            autoComplete="current-password"
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
            erro={erros.senha}
            aria-invalid={erros.senha ? true : credenciaisInvalidas}
          />

          <div className="login__linha-esqueci">
            <button type="button" className="login__link" onClick={aoEsquecerSenha}>
              Esqueci minha senha
            </button>
          </div>

          <Botao tipo="submit" tamanho="grande" larguraTotal carregando={enviando} textoCarregando="Entrando...">
            Entrar
          </Botao>
        </form>
      </Card>

      <p className="login__rodape">
        Sua empresa ainda não usa o EntreNós?{' '}
        <Link to={{ pathname: '/', hash: '#contato' }} className="login__link login__link--sublinhado">
          Solicite uma proposta
        </Link>
      </p>
      <p className="login__rodape">Colaborador: seu acesso chega por convite da sua empresa.</p>
    </>
  );
}
