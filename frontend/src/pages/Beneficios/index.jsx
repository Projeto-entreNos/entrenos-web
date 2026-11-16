import { useEffect, useState } from 'react';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import Esqueleto from '../../components/Carregando/Esqueleto';
import { useAuth } from '../../context/AuthContext';
import { buscarMinhaEmpresa } from '../../services/empresa';
import { listarServicosDoPacote } from '../../services/servicos';
import { contarAtendimentosDoMes } from '../../services/solicitacoes';
import { primeiroNome } from './formatar';
import ListaServicos from './ListaServicos';
import './Beneficios.css';

export default function Beneficios() {
  const { usuario } = useAuth();

  const [dados, setDados] = useState(null); // { empresa, servicos, atendimentosUsados }
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0); // muda para carregar de novo

  useEffect(() => {
    // Evita atualizar a tela se a pessoa saiu dela antes da resposta chegar
    let ativo = true;

    Promise.all([
      buscarMinhaEmpresa(usuario.empresaId),
      listarServicosDoPacote(usuario.empresaId),
      contarAtendimentosDoMes(usuario.id),
    ])
      .then(([empresa, servicos, atendimentosUsados]) => {
        if (!ativo) return;
        setDados({ empresa, servicos, atendimentosUsados });
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
  }, [usuario.empresaId, usuario.id, tentativa]);

  function tentarDeNovo() {
    setCarregando(true);
    setErro('');
    setTentativa((valor) => valor + 1);
  }

  const titulo = (
    <h1 className="beneficios__ola">
      Olá, <span className="beneficios__nome">{primeiroNome(usuario.nome)}</span>
    </h1>
  );

  if (carregando) {
    return (
      <div className="beneficios">
        {titulo}
        <p className="somente-leitor-tela" role="status">
          Carregando seus benefícios...
        </p>
        <div className="beneficios__grade">
          <Esqueleto tipo="card" />
          <Esqueleto tipo="card" />
          <Esqueleto tipo="card" />
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="beneficios">
        {titulo}
        <Aviso tipo="erro" titulo="Não foi possível carregar seus benefícios">
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

  const { empresa, servicos, atendimentosUsados } = dados;
  const limiteAtendimentos = empresa.pacote.limiteAtendimentosMes;

  return (
    <div className="beneficios">
      <header className="beneficios__saudacao">
        {titulo}
        <p>
          {empresa.nome} · Pacote {empresa.pacote.nome}
        </p>
        <p>
          Atendimentos este mês: {atendimentosUsados} de {limiteAtendimentos}
        </p>
      </header>

      {atendimentosUsados >= limiteAtendimentos && (
        <Aviso tipo="aviso" titulo="Limite do mês atingido">
          Você usou os atendimentos deste mês. Eles renovam no dia 1º.
        </Aviso>
      )}

      <ListaServicos servicos={servicos} />
    </div>
  );
}
