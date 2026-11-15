import { useState } from 'react';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import CaixaSelecao from '../../components/Campo/CaixaSelecao';
import CampoSenha from '../../components/Campo/CampoSenha';
import RegraSenha from '../../components/Campo/RegraSenha';
import Card from '../../components/Card/Card';
import { ativarConta } from '../../services/auth';
import { REGRAS_SENHA, validarAtivacao } from './validarSenha';

const ID_CAMPO = {
  senha: 'ativar-senha',
  confirmacao: 'ativar-confirmacao',
  termos: 'ativar-termos',
};
const ID_REGRAS = 'ativar-regras-senha';

export default function FormularioAtivacao({ token, convite, aoAtivar }) {
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState('');

  // Os erros só aparecem depois da primeira tentativa e somem assim que o campo é corrigido
  const erros = tentouEnviar ? validarAtivacao({ senha, confirmacao, aceitouTermos }) : {};

  function estadoDaRegra(regra) {
    if (regra.cumprida(senha)) return 'cumprida';
    return tentouEnviar ? 'erro' : 'pendente';
  }

  async function enviar(evento) {
    evento.preventDefault();
    setTentouEnviar(true);
    setErroEnvio('');

    const errosAtuais = validarAtivacao({ senha, confirmacao, aceitouTermos });
    const primeiroComErro = Object.keys(errosAtuais)[0];
    if (primeiroComErro) {
      document.getElementById(ID_CAMPO[primeiroComErro]).focus();
      return;
    }

    setEnviando(true);
    try {
      await ativarConta(token, { senha, aceitouTermos });
      aoAtivar();
    } catch (falha) {
      setErroEnvio(falha.message);
      setEnviando(false);
    }
  }

  return (
    <Card className="ativar-conta__cartao">
      <header className="ativar-conta__cabecalho">
        <h1 className="ativar-conta__titulo">Ative sua conta</h1>
        <p>A {convite.empresa} liberou benefícios para você. Crie sua senha para começar.</p>
      </header>

      <form className="ativar-conta__formulario" onSubmit={enviar} noValidate>
        <div className="ativar-conta__convite">
          <p className="ativar-conta__convite-legenda">Dados do convite (não podem ser alterados)</p>
          <p className="ativar-conta__convite-nome">{convite.nome}</p>
          <p>{convite.email}</p>
        </div>

        {/* O erro da senha não tem texto próprio: a borda fica vermelha e as regras abaixo mostram o que falta */}
        <CampoSenha
          id={ID_CAMPO.senha}
          rotulo="Senha"
          placeholder="Crie uma senha"
          autoComplete="new-password"
          value={senha}
          onChange={(evento) => setSenha(evento.target.value)}
          aria-invalid={erros.senha ? true : undefined}
          aria-describedby={ID_REGRAS}
        />

        <CampoSenha
          id={ID_CAMPO.confirmacao}
          rotulo="Confirmar senha"
          placeholder="Repita a senha"
          autoComplete="new-password"
          value={confirmacao}
          onChange={(evento) => setConfirmacao(evento.target.value)}
          erro={erros.confirmacao}
        />

        <div className="ativar-conta__regras" id={ID_REGRAS}>
          <p className="ativar-conta__regras-titulo">Sua senha deve ter:</p>
          <div className="ativar-conta__regras-lista">
            {REGRAS_SENHA.map((regra) => (
              <RegraSenha key={regra.id} estado={estadoDaRegra(regra)}>
                {regra.texto}
              </RegraSenha>
            ))}
          </div>
        </div>

        {/* TODO: apontar para as páginas de Termos de uso e Política de Privacidade quando existirem */}
        <CaixaSelecao
          id={ID_CAMPO.termos}
          ajuda="Obrigatório"
          erro={erros.termos}
          checked={aceitouTermos}
          onChange={(evento) => setAceitouTermos(evento.target.checked)}
        >
          Li e aceito os <a href="#termos-de-uso">Termos de uso</a> e a{' '}
          <a href="#politica-de-privacidade">Política de Privacidade</a>
        </CaixaSelecao>

        {erroEnvio && <Aviso tipo="erro" titulo={erroEnvio} />}

        <Botao tipo="submit" larguraTotal carregando={enviando} textoCarregando="Ativando...">
          Ativar conta
        </Botao>
      </form>
    </Card>
  );
}
