import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icone from '../../components/Icone/Icone';
import PainelMarca from '../../components/PainelMarca/PainelMarca';
import AtalhosTeste from './AtalhosTeste';
import CartaoEmailEnviado from './CartaoEmailEnviado';
import FormularioEntrar from './FormularioEntrar';
import FormularioRecuperar from './FormularioRecuperar';
import './Login.css';

// Tela cheia, sem navbar: fica fora dos layouts.
// etapa: "entrar" | "recuperar" (esqueci minha senha) | "enviado" (link de recuperação enviado)
export default function Login() {
  const [etapa, setEtapa] = useState('entrar');
  const [emailRecuperacao, setEmailRecuperacao] = useState('');

  function voltarAoLogin() {
    setEtapa('entrar');
  }

  function aoEnviarLink(email) {
    setEmailRecuperacao(email);
    setEtapa('enviado');
  }

  let conteudo;
  if (etapa === 'recuperar') {
    conteudo = <FormularioRecuperar aoEnviar={aoEnviarLink} aoVoltar={voltarAoLogin} />;
  } else if (etapa === 'enviado') {
    conteudo = <CartaoEmailEnviado email={emailRecuperacao} aoVoltar={voltarAoLogin} />;
  } else {
    conteudo = (
      <>
        <FormularioEntrar aoEsquecerSenha={() => setEtapa('recuperar')} />
        {import.meta.env.DEV && <AtalhosTeste />}
      </>
    );
  }

  return (
    <div className="login">
      <PainelMarca
        titulo="Acesse os serviços das universidades parceiras."
        texto="Agende atendimentos e acompanhe os benefícios oferecidos pela sua empresa."
      />

      <main className="login__lado-formulario">
        <div className="login__barra-topo">
          {etapa === 'entrar' ? (
            <Link to="/" className="login__voltar">
              <Icone nome="voltar" tamanho={20} />
              Voltar ao site
            </Link>
          ) : (
            <button type="button" className="login__voltar" onClick={voltarAoLogin}>
              <Icone nome="voltar" tamanho={20} />
              Voltar ao login
            </button>
          )}
        </div>

        <div className="login__corpo">{conteudo}</div>
      </main>
    </div>
  );
}
