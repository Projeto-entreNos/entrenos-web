import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import Card from '../../components/Card/Card';
import Carregando from '../../components/Carregando/Carregando';
import Icone from '../../components/Icone/Icone';
import PainelMarca from '../../components/PainelMarca/PainelMarca';
import { buscarConvite } from '../../services/auth';
import CartaoResultado from './CartaoResultado';
import FormularioAtivacao from './FormularioAtivacao';
import './AtivarConta.css';

// Tela cheia, sem navbar: fica fora dos layouts
export default function AtivarConta() {
  const { token } = useParams();

  const [convite, setConvite] = useState(null); // { nome, email, empresa, status }
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0); // muda para carregar de novo
  const [ativada, setAtivada] = useState(false);

  useEffect(() => {
    // Evita atualizar a tela se a pessoa saiu dela antes da resposta chegar
    let ativo = true;

    buscarConvite(token)
      .then((resposta) => {
        if (!ativo) return;
        setConvite(resposta);
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
  }, [token, tentativa]);

  function tentarDeNovo() {
    setCarregando(true);
    setErro('');
    setTentativa((valor) => valor + 1);
  }

  let conteudo;
  if (carregando) {
    conteudo = <Carregando texto="Carregando seu convite..." />;
  } else if (erro) {
    conteudo = (
      <Card className="ativar-conta__cartao">
        <h1 className="somente-leitor-tela">Ative sua conta</h1>
        <Aviso tipo="erro" titulo="Não foi possível abrir o seu convite">
          {erro}
        </Aviso>
        <Botao variante="secundario" larguraTotal onClick={tentarDeNovo}>
          Tentar novamente
        </Botao>
      </Card>
    );
  } else if (ativada) {
    conteudo = (
      <CartaoResultado
        tipo="sucesso"
        titulo="Conta ativada!"
        texto="Entre com seu e-mail e a senha que você acabou de criar."
        acao={
          <Botao para="/login" larguraTotal>
            Ir para o login
          </Botao>
        }
      />
    );
  } else if (convite.status !== 'Convidado') {
    conteudo = (
      <CartaoResultado
        tipo="aviso"
        titulo="Convite expirado"
        texto="Este convite expirou ou já foi usado. Peça um novo convite ao responsável pela sua empresa."
        acao={
          <Botao variante="secundario" para="/login" larguraTotal>
            Ir para o login
          </Botao>
        }
      />
    );
  } else {
    conteudo = <FormularioAtivacao token={token} convite={convite} aoAtivar={() => setAtivada(true)} />;
  }

  return (
    <div className="ativar-conta">
      <PainelMarca
        titulo="Acesse os serviços das universidades parceiras."
        texto="Ative sua conta para solicitar os serviços que a sua empresa oferece."
      />

      <main className="ativar-conta__lado-formulario">
        <div className="ativar-conta__barra-topo">
          <Link to="/login" className="ativar-conta__voltar">
            <Icone nome="voltar" tamanho={20} />
            Voltar ao login
          </Link>
        </div>

        <div className="ativar-conta__corpo">{conteudo}</div>
      </main>
    </div>
  );
}
