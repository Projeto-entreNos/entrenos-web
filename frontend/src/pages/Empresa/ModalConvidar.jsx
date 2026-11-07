import { useState } from 'react';
import Aviso from '../../components/Aviso/Aviso';
import Botao from '../../components/Botao/Botao';
import CampoTextoLongo from '../../components/Campo/CampoTextoLongo';
import Modal from '../../components/Modal/Modal';
import { convidarColaboradores } from '../../services/empresa';
import { LINK_FALAR_COM_ENTRENOS } from './contato';
import { verificarLista } from './verificarLista';

// Limite de caracteres do campo (cerca de 200 linhas)
const LIMITE_TEXTO = 10000;

function plural(quantidade, singular, varios) {
  return quantidade === 1 ? singular : varios;
}

/**
 * Modal "Convidar colaboradores" (Figma: Empresa-Modal Convidar colaboradores
 * e a variação com vagas insuficientes).
 * - empresa: resposta de buscarMinhaEmpresa (id e domínio)
 * - emailsDaEmpresa: e-mails já na empresa (em minúsculas), para achar duplicados
 * - vagasRestantes: vagas livres agora
 * - aoFechar e aoEnviar(resposta de convidarColaboradores)
 */
export default function ModalConvidar({ empresa, emailsDaEmpresa, vagasRestantes, aoFechar, aoEnviar }) {
  const [texto, setTexto] = useState('');
  const [resultado, setResultado] = useState(null); // resultado da última verificação
  const [erroCampo, setErroCampo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState('');

  const linhas = texto.split('\n').filter((linha) => linha.trim()).length;
  const validos = resultado ? resultado.validos.length : 0;
  const faltamVagas = resultado !== null && validos > vagasRestantes;
  const podeEnviar = resultado !== null && validos > 0 && !faltamVagas;

  function fechar() {
    if (!enviando) aoFechar();
  }

  // A lista mudou: a verificação antiga não vale mais
  function aoMudarTexto(evento) {
    setTexto(evento.target.value);
    setResultado(null);
    setErroCampo('');
    setErroEnvio('');
  }

  function verificar() {
    const novo = verificarLista(texto, emailsDaEmpresa, empresa.dominio);
    setErroEnvio('');

    if (novo.totalLinhas === 0) {
      setResultado(null);
      setErroCampo('Cole pelo menos um e-mail.');
      return;
    }

    setResultado(novo);
    if (novo.validos.length > vagasRestantes) {
      setErroCampo(
        `Só ${plural(vagasRestantes, 'resta 1 vaga', `restam ${vagasRestantes} vagas`)}, e a lista tem ${
          novo.validos.length
        } ${plural(novo.validos.length, 'e-mail válido', 'e-mails válidos')}.`
      );
    } else if (novo.validos.length === 0) {
      setErroCampo('Nenhum e-mail válido para convidar. Confira a lista abaixo.');
    } else {
      setErroCampo('');
    }
  }

  async function enviar() {
    setEnviando(true);
    setErroEnvio('');
    try {
      const resposta = await convidarColaboradores(
        empresa.id,
        resultado.validos.map(({ email, nome }) => ({ email, nome }))
      );
      aoEnviar(resposta);
    } catch (falha) {
      setErroEnvio(falha.message);
      setEnviando(false);
    }
  }

  return (
    <Modal
      aberto
      aoFechar={fechar}
      titulo="Convidar colaboradores"
      acoes={
        <>
          <Botao variante="secundario" onClick={fechar} desabilitado={enviando}>
            Cancelar
          </Botao>
          <Botao onClick={enviar} desabilitado={!podeEnviar} carregando={enviando}>
            Enviar convites
          </Botao>
        </>
      }
    >
      <div className="empresa__modal convite">
        <p>Cole os e-mails, um por linha. Se quiser, coloque o nome depois do e-mail, separado por vírgula.</p>

        <CampoTextoLongo
          rotulo="E-mails dos colaboradores"
          ajuda="Formato: e-mail, nome (o nome é opcional)"
          erro={erroCampo}
          placeholder={'ana@empresa.com.br, Ana Souza\nbruno@empresa.com.br'}
          value={texto}
          onChange={aoMudarTexto}
          limite={LIMITE_TEXTO}
          textoContador={`${linhas} ${plural(linhas, 'linha', 'linhas')}`}
          desabilitado={enviando}
        />

        <div>
          <Botao variante="secundario" onClick={verificar} desabilitado={enviando}>
            Verificar lista
          </Botao>
        </div>

        {/* O resultado aparece depois do clique: o leitor de tela anuncia o resumo */}
        <div aria-live="polite" className="convite__resultado">
          {resultado && (
            <>
              <div className="convite__resumo">
                <h3 className="convite__resumo-titulo">Resultado da verificação</h3>
                <dl className="convite__numeros">
                  <div className="convite__linha">
                    <dt>E-mails válidos</dt>
                    <dd>{validos}</dd>
                  </div>
                  <div className="convite__linha">
                    <dt>E-mails inválidos</dt>
                    <dd>{resultado.invalidos.length}</dd>
                  </div>
                  <div className="convite__linha">
                    <dt>Duplicados</dt>
                    <dd>{resultado.duplicados.length}</dd>
                  </div>
                  <div className="convite__linha">
                    <dt>Vagas restantes</dt>
                    <dd className={faltamVagas ? 'convite__numero--erro' : undefined}>{vagasRestantes}</dd>
                  </div>
                </dl>

                {resultado.invalidos.length > 0 && (
                  <div className="convite__detalhe">
                    <p className="convite__detalhe-titulo">Inválidos (não serão convidados)</p>
                    <ul>
                      {resultado.invalidos.map((item) => (
                        <li key={item.linha}>
                          Linha {item.linha}: <span className="empresa__email">{item.texto}</span>. {item.motivo}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {resultado.duplicados.length > 0 && (
                  <div className="convite__detalhe">
                    <p className="convite__detalhe-titulo">Duplicados (não serão convidados de novo)</p>
                    <ul>
                      {resultado.duplicados.map((item) => (
                        <li key={item.linha}>
                          Linha {item.linha}: <span className="empresa__email">{item.email}</span>. {item.motivo}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Só um alerta: não bloqueia o envio */}
              {resultado.outroDominio.length > 0 && !faltamVagas && (
                <Aviso tipo="informacao" titulo="Confira os domínios">
                  {plural(
                    resultado.outroDominio.length,
                    'Este e-mail não é',
                    `Estes ${resultado.outroDominio.length} e-mails não são`
                  )}{' '}
                  do domínio @{empresa.dominio}: <span className="empresa__email">{resultado.outroDominio.join(', ')}</span>.
                  Se estiver certo, pode enviar assim mesmo.
                </Aviso>
              )}

              {faltamVagas && (
                <>
                  <Aviso tipo="erro" titulo="Vagas insuficientes">
                    Remova {validos - vagasRestantes}{' '}
                    {plural(validos - vagasRestantes, 'e-mail', 'e-mails')} da lista ou peça a ampliação do pacote à
                    equipe EntreNós.
                  </Aviso>
                  <div>
                    <a href={LINK_FALAR_COM_ENTRENOS} className="botao botao--secundario botao--grande">
                      Falar com o EntreNós
                    </a>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {erroEnvio && (
          <Aviso tipo="erro" titulo="Não foi possível enviar os convites. Tente novamente.">
            {erroEnvio}
          </Aviso>
        )}
      </div>
    </Modal>
  );
}
