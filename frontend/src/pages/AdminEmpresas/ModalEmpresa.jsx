import { useEffect, useId, useRef, useState } from 'react';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import Campo from '../../components/Campo/Campo';
import CampoSelecao from '../../components/Campo/CampoSelecao';
import Modal from '../../components/Modal/Modal';
import { formatarMoeda, mascararCnpj } from './formatar';
import { validarEmpresa } from './validarEmpresa';

const OPCOES_STATUS = [
  { valor: 'Proposta enviada', rotulo: 'Proposta enviada' },
  { valor: 'Aguardando pagamento', rotulo: 'Aguardando pagamento' },
  { valor: 'Ativo', rotulo: 'Ativo' },
  { valor: 'Encerrado', rotulo: 'Encerrado' },
];

function plural(quantidade, singular, varios) {
  return quantidade === 1 ? singular : varios;
}

function valoresIniciais(empresa) {
  if (!empresa) {
    return {
      nome: '',
      cnpj: '',
      responsavel: '',
      emailResponsavel: '',
      pacoteId: '',
      vagasContratadas: '',
      vigenciaInicio: '',
      vigenciaFim: '',
      statusContrato: 'Proposta enviada',
    };
  }

  return {
    nome: empresa.nome,
    cnpj: empresa.cnpj,
    responsavel: empresa.responsavel,
    emailResponsavel: empresa.emailResponsavel,
    pacoteId: empresa.pacote.id,
    vagasContratadas: String(empresa.vagasContratadas),
    vigenciaInicio: empresa.vigenciaInicio,
    vigenciaFim: empresa.vigenciaFim,
    statusContrato: empresa.statusContrato,
  };
}

// Estimativa: vagas × preço por colaborador do pacote. O valor final fica na proposta.
function ValorEstimado({ pacote, vagas }) {
  const temVagas = Number.isInteger(vagas) && vagas > 0;

  let valor = '—';
  let detalhe = 'Preencha o pacote e as vagas para calcular.';
  if (pacote && temVagas) {
    valor = `${formatarMoeda(vagas * pacote.precoPorColaborador)} por mês`;
    detalhe = `${vagas} ${plural(vagas, 'vaga', 'vagas')} × ${formatarMoeda(pacote.precoPorColaborador)} por colaborador`;
  } else if (pacote) {
    detalhe = 'Preencha as vagas para calcular.';
  } else if (temVagas) {
    detalhe = 'Selecione o pacote para calcular.';
  }

  return (
    <div className="admin-empresas__valor" aria-live="polite">
      <p className="admin-empresas__valor-rotulo">Valor estimado</p>
      <p className="admin-empresas__valor-numero">{valor}</p>
      <p className="admin-empresas__valor-detalhe">{detalhe}</p>
    </div>
  );
}

/*
  empresa: null para cadastrar uma nova.
  aoSalvar é async; se falhar, o modal continua aberto com o aviso de erro.
*/
export default function ModalEmpresa({ empresa, pacotes, aoFechar, aoSalvar }) {
  const idFormulario = useId();
  const refFormulario = useRef(null);
  const editando = Boolean(empresa);

  const [valores, setValores] = useState(() => valoresIniciais(empresa));
  const [erros, setErros] = useState({});
  const [tentativa, setTentativa] = useState(0); // muda a cada envio com erros
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState('');

  const totalErros = Object.keys(erros).length;
  const pacote = pacotes.find((item) => item.id === valores.pacoteId);

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

  function ligar(campo) {
    return {
      value: valores[campo],
      erro: erros[campo],
      onChange: (evento) => mudar(campo, evento.target.value),
      desabilitado: enviando,
    };
  }

  function fechar() {
    if (!enviando) aoFechar();
  }

  async function enviar(evento) {
    evento.preventDefault();

    const novosErros = validarEmpresa(valores, editando ? empresa.vagasOcupadas : 0);
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
        cnpj: valores.cnpj,
        responsavel: valores.responsavel.trim(),
        emailResponsavel: valores.emailResponsavel.trim().toLowerCase(),
        pacoteId: valores.pacoteId,
        vagasContratadas: Number(valores.vagasContratadas),
        vigenciaInicio: valores.vigenciaInicio,
        vigenciaFim: valores.vigenciaFim,
        statusContrato: valores.statusContrato,
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
      titulo={editando ? 'Editar empresa' : 'Nova empresa'}
      acoes={
        <>
          <Botao variante="secundario" onClick={fechar} desabilitado={enviando}>
            Cancelar
          </Botao>
          <Botao tipo="submit" form={idFormulario} carregando={enviando} textoCarregando="Salvando...">
            {editando ? 'Salvar alterações' : 'Salvar empresa'}
          </Botao>
        </>
      }
    >
      <form id={idFormulario} ref={refFormulario} className="admin-empresas__formulario" onSubmit={enviar} noValidate>
        {totalErros > 0 && (
          <Aviso tipo="erro" titulo="Corrija os campos destacados">
            Revise {plural(totalErros, 'o campo marcado', `os ${totalErros} campos marcados`)} em vermelho antes de
            salvar.
          </Aviso>
        )}

        {erroEnvio && (
          <Aviso tipo="erro" titulo="Não foi possível salvar">
            {erroEnvio} Tente novamente.
          </Aviso>
        )}

        <div className="admin-empresas__linha">
          <Campo rotulo="Nome da empresa" placeholder="Nome da empresa" {...ligar('nome')} />
          <Campo
            rotulo="CNPJ"
            placeholder="00.000.000/0000-00"
            inputMode="numeric"
            {...ligar('cnpj')}
            onChange={(evento) => mudar('cnpj', mascararCnpj(evento.target.value))}
          />
        </div>

        <div className="admin-empresas__linha">
          <Campo rotulo="Responsável" placeholder="Nome do responsável" {...ligar('responsavel')} />
          <Campo
            rotulo="E-mail do responsável"
            tipo="email"
            placeholder="email@empresa.com.br"
            autoComplete="off"
            {...ligar('emailResponsavel')}
          />
        </div>

        <div className="admin-empresas__linha">
          <CampoSelecao
            rotulo="Pacote"
            opcoes={[
              { valor: '', rotulo: 'Selecione o pacote' },
              ...pacotes.map((item) => ({ valor: item.id, rotulo: item.nome })),
            ]}
            {...ligar('pacoteId')}
          />
          <Campo rotulo="Vagas contratadas" tipo="number" min="1" placeholder="Ex.: 50" {...ligar('vagasContratadas')} />
        </div>

        <div className="admin-empresas__linha">
          <Campo rotulo="Início da vigência" tipo="date" {...ligar('vigenciaInicio')} />
          <Campo rotulo="Fim da vigência" tipo="date" {...ligar('vigenciaFim')} />
        </div>

        <div className="admin-empresas__linha">
          <CampoSelecao
            rotulo="Status do contrato"
            opcoes={OPCOES_STATUS}
            ajuda="Opções: Proposta enviada, Aguardando pagamento, Ativo ou Encerrado."
            {...ligar('statusContrato')}
          />
          <ValorEstimado pacote={pacote} vagas={Number(valores.vagasContratadas)} />
        </div>

        <Aviso tipo="informacao" titulo="Valor estimado">
          É uma estimativa: vagas × preço por colaborador do pacote. O valor final fica na proposta enviada.
        </Aviso>
      </form>
    </Modal>
  );
}
