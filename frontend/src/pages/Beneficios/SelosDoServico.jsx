import Selo from '../../components/Selo/Selo';
import { formatarMesAno } from '../../utils/datas';

export default function SelosDoServico({ servico }) {
  return (
    <>
      {servico.novo && <Selo tipo="sucesso">Novo</Selo>}
      {servico.status === 'Sem vagas' && <Selo tipo="aviso">Sem vagas no momento</Selo>}
      {servico.status === 'Pausado' && (
        <Selo tipo="neutro">
          {servico.previsaoRetorno ? `Pausado · volta em ${formatarMesAno(servico.previsaoRetorno)}` : 'Pausado'}
        </Selo>
      )}
    </>
  );
}
