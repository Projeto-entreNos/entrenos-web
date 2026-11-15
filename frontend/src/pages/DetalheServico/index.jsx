import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import Card from '../../components/Card/Card';
import Esqueleto from '../../components/Carregando/Esqueleto';
import EstadoVazio from '../../components/EstadoVazio/EstadoVazio';
import Selo from '../../components/Selo/Selo';
import { useAuth } from '../../context/AuthContext';
import { buscarMinhaEmpresa } from '../../services/empresa';
import { buscarServico } from '../../services/servicos';
import {
  buscarSolicitacaoAberta,
  contarAtendimentosDoMes,
  criarSolicitacao,
} from '../../services/solicitacoes';
import SelosDoServico from '../Beneficios/SelosDoServico';
import CartaoLateral from './CartaoLateral';
import './DetalheServico.css';

const linkVoltar = (
  <div>
    <Botao variante="texto" para="/beneficios">
      Voltar aos benefícios
    </Botao>
  </div>
);

export default function DetalheServico() {
  const { id } = useParams();
  const { usuario } = useAuth();

  const [dados, setDados] = useState(null); // { servico, empresa, atendimentosUsados, solicitacaoAberta }
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0); // muda para carregar de novo

  useEffect(() => {
    // Evita atualizar a tela se a pessoa saiu dela antes da resposta chegar
    let ativo = true;

    Promise.all([
      buscarServico(id, usuario.empresaId),
      buscarMinhaEmpresa(usuario.empresaId),
      contarAtendimentosDoMes(usuario.id),
      buscarSolicitacaoAberta(id, usuario.id),
    ])
      .then(([servico, empresa, atendimentosUsados, solicitacaoAberta]) => {
        if (!ativo) return;
        setDados({ servico, empresa, atendimentosUsados, solicitacaoAberta });
        setErro('');
      })
      .catch((falha) => {
        if (ativo) setErro(falha.message);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [id, usuario.empresaId, usuario.id, tentativa]);

  function tentarDeNovo() {
    setCarregando(true);
    setErro('');
    setTentativa((valor) => valor + 1);
  }

  // Se falhar, o erro sobe para o modal, que mostra a mensagem e continua aberto
  async function enviarSolicitacao(mensagem) {
    const resposta = await criarSolicitacao({
      servicoId: dados.servico.id,
      mensagem,
      usuarioId: usuario.id,
    });
    setDados((atual) => ({
      ...atual,
      atendimentosUsados: atual.atendimentosUsados + 1,
      solicitacaoAberta: resposta,
    }));
  }

  if (carregando) {
    return (
      <div className="detalhe">
        {linkVoltar}
        <p className="somente-leitor-tela" role="status">
          Carregando o serviço...
        </p>
        <div className="detalhe__colunas">
          <div className="detalhe__coluna">
            <Esqueleto tipo="card" />
            <Esqueleto tipo="card" />
          </div>
          <div className="detalhe__coluna">
            <Esqueleto tipo="card" />
          </div>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="detalhe">
        {linkVoltar}
        <Aviso tipo="erro" titulo="Não foi possível carregar o serviço">
          {erro} Tente novamente.
        </Aviso>
        <div>
          <Botao variante="secundario" onClick={tentarDeNovo}>
            Tentar novamente
          </Botao>
        </div>
      </div>
    );
  }

  // Serviço que não existe ou não faz parte do pacote da empresa
  if (!dados.servico) {
    return (
      <div className="detalhe detalhe--nao-encontrado">
        <EstadoVazio
          titulo="Serviço não encontrado"
          texto="Esse serviço pode ter sido removido ou o link está incorreto."
          acao={
            <Botao variante="secundario" para="/beneficios">
              Voltar aos benefícios
            </Botao>
          }
        />
      </div>
    );
  }

  const { servico, empresa, atendimentosUsados, solicitacaoAberta } = dados;

  return (
    <div className="detalhe">
      {linkVoltar}

      <header className="detalhe__cabecalho">
        <div className="detalhe__selos">
          <Selo tipo="neutro">{servico.categoria}</Selo>
          <SelosDoServico servico={servico} />
        </div>
        <h1 className="detalhe__titulo">{servico.nome}</h1>
        <p className="detalhe__universidade">{servico.universidade.nome}</p>
      </header>

      <div className="detalhe__colunas">
        <div className="detalhe__coluna">
          <Card como="section" className="detalhe__card" aria-labelledby="titulo-sobre">
            <h2 id="titulo-sobre" className="detalhe__card-titulo">
              Sobre o serviço
            </h2>
            <p>{servico.descricaoCompleta}</p>
          </Card>

          <Card como="section" className="detalhe__card" aria-labelledby="titulo-condicoes">
            <h2 id="titulo-condicoes" className="detalhe__card-titulo">
              Condições
            </h2>
            <dl className="detalhe__lista">
              <div>
                <dt>Modalidade</dt>
                <dd>{servico.modalidade}</dd>
              </div>
              <div>
                <dt>Observações</dt>
                <dd>{servico.observacoes}</dd>
              </div>
            </dl>
          </Card>
        </div>

        <div className="detalhe__coluna">
          <CartaoLateral
            servico={servico}
            empresa={empresa}
            atendimentosUsados={atendimentosUsados}
            solicitacaoAberta={solicitacaoAberta}
            aoEnviar={enviarSolicitacao}
          />

          <Card como="section" className="detalhe__card" aria-labelledby="titulo-como-funciona">
            <h2 id="titulo-como-funciona" className="detalhe__card-titulo">
              Como funciona a solicitação
            </h2>
            <ol className="detalhe__passos">
              <li>
                <span className="detalhe__passo-numero" aria-hidden="true">1</span>
                Você envia a solicitação.
              </li>
              <li>
                <span className="detalhe__passo-numero" aria-hidden="true">2</span>
                A universidade recebe seu pedido por e-mail.
              </li>
              <li>
                <span className="detalhe__passo-numero" aria-hidden="true">3</span>
                A universidade entra em contato para combinar o atendimento.
              </li>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}
