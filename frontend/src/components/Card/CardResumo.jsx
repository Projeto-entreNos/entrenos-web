import Card from './Card';

/**
 * Card de resumo: um número em destaque e uma legenda (ex.: "12 / Vagas usadas").
 */
export default function CardResumo({ numero, legenda }) {
  return (
    <Card className="card-resumo">
      <p className="card-resumo__numero">{numero}</p>
      <p className="card-resumo__legenda">{legenda}</p>
    </Card>
  );
}
