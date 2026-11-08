import { useEffect, useState } from 'react';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import Esqueleto from '../../components/Carregando/Esqueleto';
import { useAuth } from '../../context/AuthContext';
import { buscarMinhaEmpresa } from '../../services/empresa';
import { recomendarServicos } from '../../services/ia';
import { listarServicosDoPacote } from '../../services/servicos';
import { contarAtendimentosDoMes } from '../../services/solicitacoes';
import CartaoBuscaIa from './CartaoBuscaIa';
import { lerBuscasRestantes, registrarBusca } from './cotaBuscas';
import { primeiroNome } from './formatar';
import ListaServicos from './ListaServicos';
import ResultadoIa from './ResultadoIa';
import './Beneficios.css';

const MAXIMO_SUGESTOES = 3;

// A resposta da IA é validada: só serviços do pacote, Ativos, sem repetição, no máximo 3
function validarSugestoes(recomendacoes, servicos) {
  if (!Array.isArray(recomendacoes)) return [];

  const vistos = new Set();
  const validas = [];
  for (const recomendacao of recomendacoes) {
    const servico = servicos.find((item) => item.id === recomendacao.servicoId);
    if (servico && servico.status === 'Ativo' && !vistos.has(servico.id)) {
      vistos.add(servico.id);
      validas.push({ servico, motivo: recomendacao.motivo });
    }
  }
  return validas.slice(0, MAXIMO_SUGESTOES);
}

export default function Beneficios() {
  const { usuario } = useAuth();

  const [dados, setDados] = useState(null); // { empresa, servicos, atendimentosUsados }
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0); // muda para carregar de novo

  const [texto, setTexto] = useState('');
  const [estadoIa, setEstadoIa] = useState('ocioso');
  const [sugestoes, setSugestoes] = useState([]);
  const [buscasRestantes, setBuscasRestantes] = useState(() => lerBuscasRestantes(usuario.id));

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

  async function buscarComIa() {
    setEstadoIa('buscando');
    setSugestoes([]);
    try {
      const resposta = await recomendarServicos(texto.trim(), usuario.empresaId);
      // Só gasta a cota quando a IA respondeu (falha não conta)
      setBuscasRestantes(registrarBusca(usuario.id));
      const validas = validarSugestoes(resposta?.recomendacoes, dados.servicos);
      setSugestoes(validas);
      setEstadoIa(validas.length > 0 ? 'resultado' : 'sem-resultado');
    } catch {
      setEstadoIa('indisponivel');
    }
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

      <CartaoBuscaIa
        texto={texto}
        aoMudarTexto={setTexto}
        aoBuscar={buscarComIa}
        buscando={estadoIa === 'buscando'}
        buscasRestantes={buscasRestantes}
      />

      <ResultadoIa estado={estadoIa} sugestoes={sugestoes} semBuscas={buscasRestantes === 0} />

      <ListaServicos servicos={servicos} />
    </div>
  );
}
