import { useEffect, useRef } from 'react';
import Card from '../../components/Card/Card';
import Icone from '../../components/Icone/Icone';

// tipo: "sucesso" | "aviso". O título recebe o foco para o leitor de tela anunciar a mudança.
export default function CartaoResultado({ tipo, titulo, texto, acao }) {
  const refTitulo = useRef(null);

  useEffect(() => {
    refTitulo.current.focus();
  }, []);

  return (
    <Card className="ativar-conta__cartao ativar-conta__cartao--resultado">
      <span className={`ativar-conta__icone ativar-conta__icone--${tipo}`}>
        <Icone nome={tipo} tamanho={36} />
      </span>
      <header className="ativar-conta__cabecalho">
        <h1 className="ativar-conta__titulo" tabIndex={-1} ref={refTitulo}>
          {titulo}
        </h1>
        <p>{texto}</p>
      </header>
      {acao}
    </Card>
  );
}
