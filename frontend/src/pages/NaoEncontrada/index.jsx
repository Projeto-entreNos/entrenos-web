import Botao from '../../components/Botao/Botao';
import EstadoVazio from '../../components/EstadoVazio/EstadoVazio';
import './NaoEncontrada.css';

// Página 404: aparece quando o endereço não corresponde a nenhuma rota
export default function NaoEncontrada() {
  return (
    <div className="container nao-encontrada">
      <h1 className="somente-leitor-tela">Página não encontrada</h1>
      <EstadoVazio
        titulo="Página não encontrada"
        texto="O endereço pode estar errado ou a página pode ter mudado de lugar."
        acao={
          <Botao variante="secundario" para="/">
            Voltar ao início
          </Botao>
        }
      />
    </div>
  );
}
