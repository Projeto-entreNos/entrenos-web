import Card from './Card';

export default function CardResumo({ numero, legenda }) {
  return (
    <Card className="card-resumo">
      <p className="card-resumo__numero">{numero}</p>
      <p className="card-resumo__legenda">{legenda}</p>
    </Card>
  );
}
