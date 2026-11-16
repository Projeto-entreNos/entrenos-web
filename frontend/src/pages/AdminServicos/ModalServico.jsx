import { useEffect, useId, useRef, useState } from 'react';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import CaixaSelecao from '../../components/Campo/CaixaSelecao';
import Campo from '../../components/Campo/Campo';
import CampoSelecao from '../../components/Campo/CampoSelecao';
import CampoTextoLongo from '../../components/Campo/CampoTextoLongo';
import Modal from '../../components/Modal/Modal';
import { STATUS_SERVICO, mascararMesAno, paraDataDaApi, paraMesAno, validarServico } from './validarServico';

const MODALIDADES = ['Presencial', 'Online', 'Híbrido'];
const LIMITE_SOBRE = 1000;
const LIMITE_LOCAL = 60;

function valoresIniciais(servico) {
  if (!servico) {
    return {
      nome: '',
      categoria: '',
      universidadeId: '',
      modalidade: '',
      local: '',
      descricaoCurta: '',
      descricaoCompleta: '',
      pacotes: [],
      status: 'Ativo',
      previsaoRetorno: '',
    };
  }

  return {
    nome: servico.nome,
    categoria: servico.categoria,
    universidadeId: servico.universidade.id ?? '',
    modalidade: servico.modalidade ?? '',
    local: servico.local ?? '',
    descricaoCurta: servico.descricaoCurta ?? '',
    descricaoCompleta: servico.descricaoCompleta ?? '',
    pacotes: servico.pacotes,
    status: servico.status,
    previsaoRetorno: paraMesAno(servico.previsaoRetorno),
  };
}

/*
  servico: null para cadastrar um novo.
  aoSalvar é async; se falhar, o modal continua aberto com o aviso de erro.
*/
export default function ModalServico({ servico, categorias, universidades, pacotes, aoFechar, aoSalvar }) {
  const idFormulario = useId();
  const refFormulario = useRef(null);
  const editando = Boolean(servico);

  const [valores, setValores] = useState(() => valoresIniciais(servico));
  const [erros, setErros] = useState({});
  const [tentativa, setTentativa] = useState(0); // muda a cada envio com erros
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState('');

  const pausado = valores.status === 'Pausado';

  // Depois de um envio com erros, o foco vai para o primeiro campo errado
  useEffect(() => {
    if (tentativa > 0) {
      refFormulario.current?.querySelector('[aria-invalid="true"]')?.focus();
    }
  }, [tentativa]);

  function mudar(campo, valor) {
    setValores((atual) => ({ ...atual, [campo]: valor }));
    setErroEnvio('');
  }

  // Atalho para ligar valor, mudança e erro de um campo
  function ligar(campo) {
    return {
      value: valores[campo],
      erro: erros[campo],
      onChange: (evento) => mudar(campo, evento.target.value),
      desabilitado: enviando,
    };
  }

  // Mantém a ordem dos pacotes (Essencial, Completo), qualquer que seja a ordem dos cliques
  function alternarPacote(pacoteId, marcado) {
    const escolhidos = marcado ? [...valores.pacotes, pacoteId] : valores.pacotes.filter((id) => id !== pacoteId);
    mudar(
      'pacotes',
      pacotes.map((pacote) => pacote.id).filter((id) => escolhidos.includes(id))
    );
  }

  function fechar() {
    if (!enviando) aoFechar();
  }

  async function enviar(evento) {
    evento.preventDefault();

    const novosErros = validarServico(valores);
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      setTentativa((valor) => valor + 1);
      return;
    }

    setEnviando(true);
    setErroEnvio('');
    try {
      await aoSalvar({
        nome: valores.nome.trim(),
        categoria: valores.categoria,
        universidadeId: valores.universidadeId,
        modalidade: valores.modalidade,
        local: valores.local.trim(),
        descricaoCurta: valores.descricaoCurta.trim(),
        descricaoCompleta: valores.descricaoCompleta.trim(),
        pacotes: valores.pacotes,
        status: valores.status,
        previsaoRetorno: pausado ? paraDataDaApi(valores.previsaoRetorno) : null,
      });
    } catch (falha) {
      setErroEnvio(falha.message);
      setEnviando(false);
    }
  }

  return (
    <Modal
      aberto
      largura="grande"
      aoFechar={fechar}
      titulo={editando ? 'Editar serviço' : 'Novo serviço'}
      acoes={
        <>
          <Botao variante="secundario" onClick={fechar} desabilitado={enviando}>
            Cancelar
          </Botao>
          <Botao tipo="submit" form={idFormulario} carregando={enviando} textoCarregando="Salvando...">
            {editando ? 'Salvar alterações' : 'Salvar serviço'}
          </Botao>
        </>
      }
    >
      <form id={idFormulario} ref={refFormulario} className="admin-servicos__formulario" onSubmit={enviar} noValidate>
        {erroEnvio && (
          <Aviso tipo="erro" titulo="Não foi possível salvar">
            {erroEnvio} Tente novamente.
          </Aviso>
        )}

        <div className="admin-servicos__linha">
          <Campo rotulo="Nome do serviço" placeholder="Ex.: Educação financeira" {...ligar('nome')} />
          <CampoSelecao
            rotulo="Categoria"
            opcoes={[
              { valor: '', rotulo: 'Selecione a categoria' },
              ...categorias.map((categoria) => ({ valor: categoria, rotulo: categoria })),
            ]}
            {...ligar('categoria')}
          />
        </div>

        <div className="admin-servicos__linha">
          <CampoSelecao
            rotulo="Universidade"
            opcoes={[
              { valor: '', rotulo: 'Selecione a universidade' },
              ...universidades.map((universidade) => ({ valor: universidade.id, rotulo: universidade.nome })),
            ]}
            ajuda="As universidades parceiras são cadastradas pela equipe do EntreNós."
            {...ligar('universidadeId')}
          />
          <CampoSelecao
            rotulo="Modalidade"
            opcoes={[
              { valor: '', rotulo: 'Selecione a modalidade' },
              ...MODALIDADES.map((modalidade) => ({ valor: modalidade, rotulo: modalidade })),
            ]}
            ajuda="Presencial, Online ou Híbrido."
            {...ligar('modalidade')}
          />
        </div>

        <Campo
          rotulo="Detalhe do local (opcional)"
          placeholder="Ex.: Núcleo de Apoio Contábil e Fiscal"
          maxLength={LIMITE_LOCAL}
          {...ligar('local')}
        />

        <Campo rotulo="Descrição curta" placeholder="Uma frase sobre o serviço" {...ligar('descricaoCurta')} />

        <CampoTextoLongo
          rotulo="Sobre o serviço"
          placeholder="Descreva o que o serviço oferece, como funciona e para quem é indicado."
          ajuda="A busca com IA usa esta descrição. Escreva de forma clara o que o serviço oferece."
          limite={LIMITE_SOBRE}
          {...ligar('descricaoCompleta')}
        />

        <div className={pausado ? 'admin-servicos__linha admin-servicos__linha--tres' : 'admin-servicos__linha'}>
          {/* Só o primeiro pacote mostra a mensagem; o CSS deixa a borda dos dois em vermelho */}
          <fieldset className={erros.pacotes ? 'admin-servicos__pacotes admin-servicos__pacotes--erro' : 'admin-servicos__pacotes'}>
            <legend className="campo__rotulo">Pacotes em que entra</legend>
            {pacotes.map((pacote, indice) => (
              <CaixaSelecao
                key={pacote.id}
                checked={valores.pacotes.includes(pacote.id)}
                onChange={(evento) => alternarPacote(pacote.id, evento.target.checked)}
                disabled={enviando}
                erro={indice === 0 ? erros.pacotes : undefined}
                aria-invalid={erros.pacotes ? true : undefined}
              >
                {pacote.nome}
              </CaixaSelecao>
            ))}
          </fieldset>

          <CampoSelecao
            rotulo="Status"
            opcoes={STATUS_SERVICO.map((status) => ({ valor: status, rotulo: status }))}
            ajuda="Ativo, Sem vagas ou Pausado."
            {...ligar('status')}
          />

          {pausado && (
            <Campo
              rotulo="Previsão de retorno (opcional)"
              placeholder="MM/AAAA"
              inputMode="numeric"
              {...ligar('previsaoRetorno')}
              onChange={(evento) => mudar('previsaoRetorno', mascararMesAno(evento.target.value))}
            />
          )}
        </div>

        <p className="admin-servicos__nota">
          Serviços pausados ou sem vagas continuam visíveis para o colaborador, mas não podem ser solicitados.
        </p>
      </form>
    </Modal>
  );
}
