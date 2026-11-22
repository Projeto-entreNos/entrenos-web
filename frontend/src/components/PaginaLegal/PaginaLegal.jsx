import Aviso from '../Aviso/Aviso';
import Botao from '../Botao/Botao';
import './PaginaLegal.css';

// Estrutura comum de Termos de uso e Política de privacidade; children são as seções do texto
export default function PaginaLegal({ titulo, children }) {
  return (
    <div className="container pagina-legal">
      <Botao variante="texto" para="/" className="pagina-legal__voltar">
        Voltar ao início
      </Botao>

      <header className="pagina-legal__cabecalho">
        <h1 className="pagina-legal__titulo">{titulo}</h1>
        <p className="pagina-legal__data">Atualizado em novembro de 2026</p>
      </header>

      <div className="pagina-legal__texto">
        <Aviso tipo="informacao" titulo="Projeto acadêmico">
          O EntreNós é um MVP feito por estudantes para um projeto de curso. Não é um serviço comercial em
          funcionamento: use apenas dados fictícios.
        </Aviso>
        {children}
      </div>
    </div>
  );
}
