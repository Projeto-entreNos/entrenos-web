import Botao from '../Botao/Botao';
import Selo from '../Selo/Selo';
import Card from './Card';

/**
 * - seloStatus: <Selo> extra, ex.: "Sem vagas" (opcional)
 */
export default function CardServico({
  categoria,
  titulo,
  universidade,
  descricao,
  novo = false,
  para,
  seloStatus,
  textoBotao = 'Ver detalhes',
}) {
  return (
    <Card como="article" className="card-servico">
      <div className="card-servico__topo">
        <Selo tipo="neutro">{categoria}</Selo>
        {novo && <Selo tipo="neutro">Novo</Selo>}
        {seloStatus}
      </div>

      <h3 className="card-servico__titulo">{titulo}</h3>
      <p className="card-servico__universidade">{universidade}</p>
      <p className="card-servico__descricao">{descricao}</p>

      <Botao variante="secundario" larguraTotal para={para} aria-label={`${textoBotao}: ${titulo}`}>
        {textoBotao}
      </Botao>
    </Card>
  );
}
