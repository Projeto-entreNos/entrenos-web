import Botao from '../Botao/Botao';
import Selo from '../Selo/Selo';
import Card from './Card';

/**
 * Card de serviço (lista de benefícios).
 * - categoria, titulo, universidade, descricao: textos do card
 * - novo: mostra o selo "Novo"
 * - motivo: motivo da indicação da IA (opcional)
 * - para: rota do botão "Ver detalhes" (ex.: "/servicos/3")
 * - seloStatus: elemento <Selo> extra (ex.: "Sem vagas"), opcional
 * - textoBotao: texto do botão (padrão "Ver detalhes")
 */
export default function CardServico({
  categoria,
  titulo,
  universidade,
  descricao,
  novo = false,
  motivo,
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

      {motivo && <p className="card-servico__motivo">{motivo}</p>}

      <Botao variante="secundario" larguraTotal para={para} aria-label={`${textoBotao}: ${titulo}`}>
        {textoBotao}
      </Botao>
    </Card>
  );
}
