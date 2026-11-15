import { useEffect, useRef, useState } from 'react';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import CaixaSelecao from '../../components/Campo/CaixaSelecao';
import Campo from '../../components/Campo/Campo';
import CampoTextoLongo from '../../components/Campo/CampoTextoLongo';
import Card from '../../components/Card/Card';
import { enviarProposta } from '../../services/propostas';
import { validarEmail } from '../../utils/validarEmail';

const ID_CAMPO = {
  nome: 'proposta-nome',
  empresa: 'proposta-empresa',
  email: 'proposta-email',
  numeroColaboradores: 'proposta-colaboradores',
  mensagem: 'proposta-mensagem',
  aceitouPrivacidade: 'proposta-privacidade',
};

const DADOS_VAZIOS = {
  nome: '',
  empresa: '',
  email: '',
  numeroColaboradores: '',
  mensagem: '',
  aceitouPrivacidade: false,
};

// A ordem das chaves é a ordem dos campos: o foco vai para o primeiro com erro
function validarProposta(dados) {
  const erros = {};
  if (!dados.nome.trim()) erros.nome = 'Informe seu nome.';
  if (!dados.empresa.trim()) erros.empresa = 'Informe o nome da empresa.';
  const erroEmail = validarEmail(dados.email);
  if (erroEmail) erros.email = erroEmail;
  const numero = Number(dados.numeroColaboradores);
  if (!dados.numeroColaboradores) {
    erros.numeroColaboradores = 'Informe quantos colaboradores.';
  } else if (!Number.isInteger(numero) || numero < 1) {
    erros.numeroColaboradores = 'Use um número inteiro, a partir de 1.';
  }
  if (!dados.aceitouPrivacidade) erros.aceitouPrivacidade = 'Aceite a Política de Privacidade para continuar.';
  return erros;
}

export default function FormularioProposta() {
  const [dados, setDados] = useState(DADOS_VAZIOS);
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const refTituloSucesso = useRef(null);

  // Os erros só aparecem depois da primeira tentativa e somem assim que o campo é corrigido
  const erros = tentouEnviar ? validarProposta(dados) : {};

  useEffect(() => {
    if (mensagemSucesso) refTituloSucesso.current.focus();
  }, [mensagemSucesso]);

  function alterar(campo, valor) {
    setDados((anteriores) => ({ ...anteriores, [campo]: valor }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    setTentouEnviar(true);
    setErroEnvio('');

    const errosAtuais = validarProposta(dados);
    const primeiroComErro = Object.keys(errosAtuais)[0];
    if (primeiroComErro) {
      document.getElementById(ID_CAMPO[primeiroComErro]).focus();
      return;
    }

    setEnviando(true);
    try {
      const resposta = await enviarProposta({
        nome: dados.nome.trim(),
        empresa: dados.empresa.trim(),
        email: dados.email.trim(),
        numeroColaboradores: Number(dados.numeroColaboradores),
        mensagem: dados.mensagem.trim(),
        aceitouPrivacidade: dados.aceitouPrivacidade,
      });
      setMensagemSucesso(resposta.mensagem);
      setDados(DADOS_VAZIOS);
      setTentouEnviar(false);
    } catch (falha) {
      setErroEnvio(falha.message);
    } finally {
      setEnviando(false);
    }
  }

  if (mensagemSucesso) {
    return (
      <Card className="landing-proposta">
        <header className="landing-proposta__cabecalho">
          <h3 className="landing-proposta__titulo" tabIndex={-1} ref={refTituloSucesso}>
            Pedido enviado
          </h3>
        </header>
        <Aviso tipo="sucesso" titulo={mensagemSucesso} />
        <Botao variante="secundario" larguraTotal onClick={() => setMensagemSucesso('')}>
          Enviar outro pedido
        </Botao>
      </Card>
    );
  }

  return (
    <Card className="landing-proposta">
      <header className="landing-proposta__cabecalho">
        <h3 className="landing-proposta__titulo">Solicite uma proposta</h3>
        <p>Preencha os dados e nosso time entra em contato.</p>
      </header>

      <form className="landing-proposta__formulario" onSubmit={enviar} noValidate>
        <div className="landing-proposta__linha">
          <Campo
            id={ID_CAMPO.nome}
            rotulo="Nome"
            placeholder="Seu nome"
            autoComplete="name"
            value={dados.nome}
            onChange={(evento) => alterar('nome', evento.target.value)}
            erro={erros.nome}
          />
          <Campo
            id={ID_CAMPO.empresa}
            rotulo="Empresa"
            placeholder="Nome da empresa"
            autoComplete="organization"
            value={dados.empresa}
            onChange={(evento) => alterar('empresa', evento.target.value)}
            erro={erros.empresa}
          />
        </div>

        <div className="landing-proposta__linha">
          <Campo
            id={ID_CAMPO.email}
            rotulo="E-mail corporativo"
            tipo="email"
            placeholder="voce@empresa.com.br"
            autoComplete="email"
            value={dados.email}
            onChange={(evento) => alterar('email', evento.target.value)}
            erro={erros.email}
          />
          <Campo
            id={ID_CAMPO.numeroColaboradores}
            rotulo="Nº de colaboradores"
            tipo="number"
            inputMode="numeric"
            min="1"
            step="1"
            placeholder="50"
            value={dados.numeroColaboradores}
            onChange={(evento) => alterar('numeroColaboradores', evento.target.value)}
            erro={erros.numeroColaboradores}
          />
        </div>

        <CampoTextoLongo
          id={ID_CAMPO.mensagem}
          rotulo="Mensagem (opcional)"
          placeholder="Conte um pouco sobre o que sua empresa procura"
          value={dados.mensagem}
          onChange={(evento) => alterar('mensagem', evento.target.value)}
        />

        {/* TODO: apontar para a página de Política de Privacidade quando ela existir */}
        <CaixaSelecao
          id={ID_CAMPO.aceitouPrivacidade}
          ajuda="Obrigatório"
          erro={erros.aceitouPrivacidade}
          checked={dados.aceitouPrivacidade}
          onChange={(evento) => alterar('aceitouPrivacidade', evento.target.checked)}
        >
          Li e aceito a <a href="#politica-de-privacidade">Política de Privacidade</a> e autorizo o contato do
          time EntreNós.
        </CaixaSelecao>

        {/* O Aviso de erro tem role="alert": o leitor de tela anuncia quando ele aparece */}
        {erroEnvio && <Aviso tipo="erro" titulo={erroEnvio} />}

        <Botao tipo="submit" tamanho="grande" larguraTotal carregando={enviando}>
          Enviar mensagem
        </Botao>
      </form>
    </Card>
  );
}
