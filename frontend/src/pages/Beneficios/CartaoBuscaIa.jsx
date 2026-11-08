import Botao from '../../components/Botao/Botao';
import CampoTextoLongo from '../../components/Campo/CampoTextoLongo';

const MINIMO_CARACTERES = 8;
const LIMITE_CARACTERES = 300;

function textoDaCota(buscasRestantes) {
  if (buscasRestantes === 0) return 'Você não tem mais buscas hoje';
  if (buscasRestantes === 1) return 'Você ainda tem 1 busca hoje';
  return `Você ainda tem ${buscasRestantes} buscas hoje`;
}

// Enter quebra linha; Ctrl+Enter (Cmd+Enter no Mac) envia a busca
export default function CartaoBuscaIa({ texto, aoMudarTexto, aoBuscar, buscando, buscasRestantes }) {
  const semBuscas = buscasRestantes === 0;
  const podeBuscar = texto.trim().length >= MINIMO_CARACTERES && !buscando && !semBuscas;

  function aoEnviar(evento) {
    evento.preventDefault();
    if (podeBuscar) aoBuscar();
  }

  function aoPressionarTecla(evento) {
    if (evento.key === 'Enter' && (evento.ctrlKey || evento.metaKey)) {
      evento.preventDefault();
      if (podeBuscar) aoBuscar();
    }
  }

  return (
    <section className="beneficios__busca" aria-labelledby="titulo-busca-ia">
      <h2 id="titulo-busca-ia" className="beneficios__busca-titulo">
        Diga o que você procura e <span className="beneficios__destaque-folha">a gente indica</span>
      </h2>

      <form className="beneficios__busca-formulario" onSubmit={aoEnviar}>
        <CampoTextoLongo
          sobreEscuro
          rotulo="O que você procura?"
          ajuda="Descreva o que você procura de forma geral. Não inclua nome, documentos ou diagnósticos."
          placeholder="Ex.: quero ajuda para melhorar minha postura no trabalho"
          limite={LIMITE_CARACTERES}
          value={texto}
          onChange={(evento) => aoMudarTexto(evento.target.value)}
          onKeyDown={aoPressionarTecla}
          desabilitado={semBuscas}
        />

        <div className="beneficios__busca-acao">
          <Botao
            tipo="submit"
            variante="principal-escuro"
            carregando={buscando}
            textoCarregando="Buscando..."
            desabilitado={!podeBuscar}
          >
            Buscar com IA
          </Botao>
          <p className="beneficios__busca-cota">{textoDaCota(buscasRestantes)}</p>
        </div>
      </form>
    </section>
  );
}
