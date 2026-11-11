import { useState } from 'react';
import Abas from '../../components/Abas/Abas';
import AbasAdmin from '../../components/Abas/AbasAdmin';
import Aviso from '../../components/Aviso/Aviso';
import BarraProgresso from '../../components/BarraProgresso/BarraProgresso';
import Botao from '../../components/Botao/Botao';
import CaixaSelecao from '../../components/Campo/CaixaSelecao';
import Campo from '../../components/Campo/Campo';
import CampoSelecao from '../../components/Campo/CampoSelecao';
import CampoSenha from '../../components/Campo/CampoSenha';
import CampoTextoLongo from '../../components/Campo/CampoTextoLongo';
import RegraSenha from '../../components/Campo/RegraSenha';
import CardResumo from '../../components/Card/CardResumo';
import CardServico from '../../components/Card/CardServico';
import Carregando from '../../components/Carregando/Carregando';
import Esqueleto from '../../components/Carregando/Esqueleto';
import EstadoVazio from '../../components/EstadoVazio/EstadoVazio';
import Filtro from '../../components/Filtro/Filtro';
import Logo from '../../components/Logo/Logo';
import Modal from '../../components/Modal/Modal';
import NavbarLogada from '../../components/NavbarLogada/NavbarLogada';
import NavbarPublica from '../../components/NavbarPublica/NavbarPublica';
import PainelMarca from '../../components/PainelMarca/PainelMarca';
import Selo from '../../components/Selo/Selo';
import Tabela from '../../components/Tabela/Tabela';
import './Componentes.css';

// Vitrine dos componentes: rota /componentes, só em desenvolvimento

const CORES = [
  'esmeralda',
  'esmeralda-escuro',
  'folha',
  'grafite',
  'azul-abissal',
  'cinza-asfalto',
  'fundo-pagina',
  'branco',
  'borda',
  'esmeralda-10',
  'esmeralda-20',
  'folha-40',
  'azul-20',
  'aviso-texto',
  'aviso-fundo',
  'erro-texto',
  'erro-fundo',
];

const VARIANTES_BOTAO = [
  { variante: 'principal', nome: 'Principal' },
  { variante: 'secundario', nome: 'Secundário' },
  { variante: 'perigo', nome: 'Perigo' },
  { variante: 'texto', nome: 'Texto' },
];

const OPCOES_STATUS = [
  { valor: 'todos', rotulo: 'Status: todos' },
  { valor: 'ativo', rotulo: 'Ativo' },
  { valor: 'pausado', rotulo: 'Pausado' },
];

const CATEGORIAS = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'juridica', rotulo: 'Assessoria jurídica' },
  { valor: 'psicologia', rotulo: 'Psicologia' },
  { valor: 'nutricao', rotulo: 'Nutrição' },
];

const COLUNAS_TABELA = [
  { chave: 'nome', titulo: 'Colaborador' },
  { chave: 'email', titulo: 'E-mail' },
  { chave: 'convite', titulo: 'Convite enviado em' },
  {
    chave: 'status',
    titulo: 'Status',
    renderizar: (linha) => <Selo tipo={linha.tipoSelo}>{linha.status}</Selo>,
  },
  {
    chave: 'acao',
    titulo: 'Ação',
    alinhar: 'direita',
    renderizar: (linha) => (
      <Botao variante="texto" aria-label={`Remover ${linha.nome}`}>
        Remover
      </Botao>
    ),
  },
];

const LINHAS_TABELA = [
  { id: 1, nome: 'Ana Exemplo', email: 'ana@alfa.exemplo.com', convite: '02/09/2026', status: 'Ativo', tipoSelo: 'sucesso' },
  { id: 2, nome: 'Gabriela Exemplo', email: 'gabriela@alfa.exemplo.com', convite: '04/11/2026', status: 'Convidado', tipoSelo: 'neutro' },
  { id: 3, nome: 'Íris Exemplo', email: 'iris@alfa.exemplo.com', convite: '20/10/2026', status: 'Convite expirado', tipoSelo: 'aviso' },
];

function Secao({ titulo, children, escura = false }) {
  return (
    <section className={`vitrine__secao ${escura ? 'vitrine__secao--escura' : ''}`}>
      <h2 className="vitrine__titulo-secao">{titulo}</h2>
      {children}
    </section>
  );
}

export default function Componentes() {
  const [textoLongo, setTextoLongo] = useState('');
  const [aceite, setAceite] = useState(false);
  const [categoria, setCategoria] = useState('todos');
  const [modalAberto, setModalAberto] = useState(null); // null | 'padrao' | 'perigo' | 'grande'

  return (
    <main className="container vitrine">
      <header className="vitrine__cabecalho">
        <h1>Componentes</h1>
        <p>
          Vitrine para comparar com o quadro “0 Base” do Figma. Só aparece em desenvolvimento.
          Estados de hover: passe o mouse.
        </p>
      </header>

      <Secao titulo="Cores">
        <ul className="vitrine__cores">
          {CORES.map((cor) => (
            <li key={cor} className="vitrine__amostra">
              <span className="vitrine__cor" style={{ background: `var(--cor-${cor})` }} />
              <code>--cor-{cor}</code>
            </li>
          ))}
        </ul>
      </Secao>

      <Secao titulo="Tipografia">
        <div className="vitrine__pilha">
          <p className="vitrine__texto-titulo-1">Título 1 · Poppins Medium 48</p>
          <p className="vitrine__texto-titulo-2">Título 2 · Poppins SemiBold 28</p>
          <p className="vitrine__texto-titulo-3">Título 3 · Poppins SemiBold 20</p>
          <p className="vitrine__texto-corpo">Corpo · Poppins Regular 16</p>
          <p className="vitrine__texto-rotulo">Rótulo · Medium 14</p>
          <p className="vitrine__texto-legenda">Legenda · Regular 14</p>
          <p className="vitrine__texto-sobretitulo">Sobretítulo · SemiBold 14</p>
          <p className="vitrine__texto-botao">Botão · Poppins Regular 20</p>
        </div>
      </Secao>

      <Secao titulo="Logo (fundo escuro e fundo claro)">
        <div className="vitrine__linha">
          <div className="vitrine__logo vitrine__logo--escuro">
            <Logo fundo="escuro" />
          </div>
          <div className="vitrine__logo">
            <Logo fundo="claro" />
          </div>
        </div>
      </Secao>

      <Secao titulo="Botão">
        <div className="vitrine__grade-botoes">
          <span />
          <span className="vitrine__legenda-coluna">Padrão</span>
          <span className="vitrine__legenda-coluna">Desabilitado</span>
          <span className="vitrine__legenda-coluna">Carregando</span>
          {VARIANTES_BOTAO.map(({ variante, nome }) => (
            <div key={variante} className="vitrine__linha-botao">
              <span className="vitrine__legenda-linha">{nome}</span>
              <Botao variante={variante}>Botão</Botao>
              <Botao variante={variante} desabilitado>
                Botão
              </Botao>
              <Botao variante={variante} carregando>
                Botão
              </Botao>
            </div>
          ))}
        </div>
        <div className="vitrine__bloco-escuro">
          <span className="vitrine__legenda-linha">Principal sobre escuro</span>
          <Botao variante="principal-escuro">Botão</Botao>
          <Botao variante="principal-escuro" desabilitado>
            Botão
          </Botao>
          <Botao variante="principal-escuro" carregando>
            Botão
          </Botao>
        </div>
        <div className="vitrine__linha">
          <Botao tamanho="grande">Tamanho grande (62 px)</Botao>
          <Botao variante="secundario" tamanho="grande">
            Secundário grande
          </Botao>
        </div>
      </Secao>

      <Secao titulo="Selo de status">
        <div className="vitrine__linha">
          <Selo tipo="sucesso">Ativo</Selo>
          <Selo tipo="aviso">Sem vagas</Selo>
          <Selo tipo="erro">Cancelada</Selo>
          <Selo tipo="neutro">Pausado</Selo>
        </div>
      </Secao>

      <Secao titulo="Campo de texto">
        <div className="vitrine__grade-campos">
          <Campo rotulo="Rótulo" ajuda="Texto de ajuda" placeholder="Digite aqui" />
          <Campo rotulo="Rótulo" erro="Texto de ajuda" defaultValue="Digite aqui" />
          <Campo rotulo="Rótulo" ajuda="Texto de ajuda" defaultValue="Digite aqui" desabilitado />
          <CampoSenha rotulo="Senha" ajuda="Texto de ajuda" placeholder="Digite sua senha" />
          <CampoSenha rotulo="Senha" erro="Senha incorreta" defaultValue="senha123" />
          <CampoSenha rotulo="Senha" ajuda="Texto de ajuda" defaultValue="senha123" desabilitado />
          <CampoTextoLongo
            rotulo="Mensagem"
            ajuda="Não escreva diagnósticos nem dados pessoais."
            placeholder="Digite aqui"
            value={textoLongo}
            onChange={(evento) => setTextoLongo(evento.target.value)}
          />
          <CampoTextoLongo rotulo="Mensagem" erro="Escreva uma mensagem." value="" onChange={() => {}} />
          <CampoSelecao rotulo="Status" opcoes={OPCOES_STATUS} ocultarRotulo />
        </div>
      </Secao>

      <Secao titulo="Regra da senha e caixa de seleção">
        <div className="vitrine__linha vitrine__linha--topo">
          <div className="vitrine__pilha">
            <RegraSenha estado="pendente">Mínimo de 8 caracteres</RegraSenha>
            <RegraSenha estado="cumprida">Mínimo de 8 caracteres</RegraSenha>
            <RegraSenha estado="erro">Mínimo de 8 caracteres</RegraSenha>
          </div>
          <div className="vitrine__caixa-selecao">
            <CaixaSelecao ajuda="Obrigatório" checked={aceite} onChange={(evento) => setAceite(evento.target.checked)}>
              Li e aceito os <a href="#termos">Termos de uso</a> e a <a href="#privacidade">Política de Privacidade</a>
            </CaixaSelecao>
          </div>
          <div className="vitrine__caixa-selecao">
            <CaixaSelecao ajuda="Obrigatório" erro="Aceite os termos para continuar.">
              Li e aceito os <a href="#termos">Termos de uso</a> e a <a href="#privacidade">Política de Privacidade</a>
            </CaixaSelecao>
          </div>
        </div>
      </Secao>

      <Secao titulo="Cartão de aviso">
        <div className="vitrine__grade-2">
          <Aviso tipo="informacao" titulo="Título do aviso">
            Texto do aviso com a informação importante para a pessoa.
          </Aviso>
          <Aviso tipo="sucesso" titulo="Título do aviso">
            Texto do aviso com a informação importante para a pessoa.
          </Aviso>
          <Aviso tipo="aviso" titulo="Título do aviso">
            Texto do aviso com a informação importante para a pessoa.
          </Aviso>
          <Aviso tipo="erro" titulo="Título do aviso">
            Texto do aviso com a informação importante para a pessoa.
          </Aviso>
        </div>
      </Secao>

      <Secao titulo="Card de resumo e card de serviço">
        <div className="vitrine__grade-cards">
          <CardResumo numero="7" legenda="Vagas ocupadas de 10" />
          <CardServico
            categoria="Psicologia"
            titulo="Atendimento psicológico individual"
            universidade="Universidade Horizonte Exemplo"
            descricao="Sessões semanais com estudantes de Psicologia, com supervisão de professores."
            para="/servicos/serv-1"
          />
          <CardServico
            categoria="Fisioterapia"
            novo
            titulo="Fisioterapia para dor nas costas"
            universidade="Faculdade Modelo do Sul"
            descricao="Sessões para aliviar dores na coluna causadas pela rotina de trabalho."
            motivo="Por que indicamos: combina com o que você descreveu."
            para="/servicos/serv-7"
          />
        </div>
      </Secao>

      <Secao titulo="Painel da marca (telas de acesso)">
        <div className="vitrine__painel-marca">
          <PainelMarca
            titulo="Acesse os serviços das universidades parceiras."
            texto="Ative sua conta para solicitar os serviços que a sua empresa oferece."
          />
        </div>
      </Secao>

      <Secao titulo="Navbar pública">
        <div className="vitrine__navbar">
          <NavbarPublica />
        </div>
      </Secao>

      <Secao titulo="Navbar logada (um menu por perfil)">
        <div className="vitrine__pilha">
          <div className="vitrine__navbar">
            <NavbarLogada usuario={{ nome: 'Ana Exemplo', perfil: 'colaborador' }} aoSair={() => {}} />
          </div>
          <div className="vitrine__navbar">
            <NavbarLogada usuario={{ nome: 'Bruno Exemplo', perfil: 'empresa' }} aoSair={() => {}} />
          </div>
          <div className="vitrine__navbar">
            <NavbarLogada usuario={{ nome: 'Carla Exemplo', perfil: 'admin' }} aoSair={() => {}} />
          </div>
        </div>
      </Secao>

      <Secao titulo="Abas e filtros">
        <div className="vitrine__pilha">
          <Abas
            rotulo="Exemplo de abas"
            abas={[
              { id: '1', rotulo: 'Primeira aba', conteudo: <p>Conteúdo da primeira aba.</p> },
              { id: '2', rotulo: 'Segunda aba', conteudo: <p>Conteúdo da segunda aba.</p> },
              { id: '3', rotulo: 'Terceira aba', conteudo: <p>Conteúdo da terceira aba.</p> },
            ]}
          />
          <Filtro rotulo="Filtrar por categoria" opcoes={CATEGORIAS} valor={categoria} aoMudar={setCategoria} />
          <p className="vitrine__legenda-linha">Abas do admin (cada aba abre uma tela; a atual fica marcada)</p>
          <AbasAdmin />
        </div>
      </Secao>

      <Secao titulo="Barra de progresso">
        <div className="vitrine__grade-campos">
          {[0, 25, 50, 75, 100].map((valor) => (
            <BarraProgresso key={valor} valor={valor} legenda="Etapa da solicitação" />
          ))}
        </div>
      </Secao>

      <Secao titulo="Tabela">
        <Tabela legenda="Colaboradores da empresa (exemplo)" colunas={COLUNAS_TABELA} linhas={LINHAS_TABELA} />
      </Secao>

      <Secao titulo="Modal">
        <div className="vitrine__linha">
          <Botao variante="secundario" onClick={() => setModalAberto('padrao')}>
            Abrir modal padrão
          </Botao>
          <Botao variante="perigo" onClick={() => setModalAberto('perigo')}>
            Abrir modal de perigo
          </Botao>
          <Botao variante="secundario" onClick={() => setModalAberto('grande')}>
            Abrir modal grande (760 px)
          </Botao>
        </div>
        <Modal
          aberto={modalAberto !== null}
          aoFechar={() => setModalAberto(null)}
          titulo="Título do modal"
          largura={modalAberto === 'grande' ? 'grande' : 'normal'}
          acoes={
            <>
              <Botao variante="secundario" onClick={() => setModalAberto(null)}>
                Cancelar
              </Botao>
              <Botao variante={modalAberto === 'perigo' ? 'perigo' : 'principal'} onClick={() => setModalAberto(null)}>
                Confirmar
              </Botao>
            </>
          }
        >
          <p>Conteúdo do modal com a explicação da ação que a pessoa vai confirmar.</p>
        </Modal>
      </Secao>

      <Secao titulo="Estado vazio e carregamento">
        <div className="vitrine__linha vitrine__linha--topo">
          <EstadoVazio
            titulo="Nada por aqui ainda"
            texto="Quando houver itens, eles vão aparecer nesta lista."
            acao={<Botao variante="secundario">Voltar ao início</Botao>}
          />
          <div className="vitrine__pilha vitrine__esqueletos">
            <Esqueleto tipo="card" />
            <Esqueleto tipo="linha" />
            <Carregando />
          </div>
        </div>
      </Secao>
    </main>
  );
}
