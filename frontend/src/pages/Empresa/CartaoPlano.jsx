import BarraProgresso from '../../components/BarraProgresso/BarraProgresso';
import Card from '../../components/Card/Card';
import Selo from '../../components/Selo/Selo';
import { formatarData } from '../../utils/datas';
import { LINK_FALAR_COM_ENTRENOS } from './contato';

const TIPO_DO_SELO = {
  'Proposta enviada': 'neutro',
  'Aguardando pagamento': 'aviso',
  Ativo: 'sucesso',
  Encerrado: 'erro',
};

// vagasUsadas: tamanho atual da lista de colaboradores (muda ao convidar ou remover)
export default function CartaoPlano({ empresa, vagasUsadas }) {
  const { pacote, statusContrato, vagasContratadas } = empresa;
  const restantes = Math.max(0, vagasContratadas - vagasUsadas);
  // Antes do início do contrato, a vigência aparece como prevista
  const contratoComecou = statusContrato === 'Ativo' || statusContrato === 'Encerrado';

  return (
    <Card como="section" className="cartao-plano" aria-labelledby="cartao-plano-titulo">
      <div className="cartao-plano__plano">
        <p id="cartao-plano-titulo" className="cartao-plano__rotulo">
          Seu plano
        </p>
        <p className="cartao-plano__pacote">Pacote {pacote.nome}</p>
        <div className="cartao-plano__contrato">
          <Selo tipo={TIPO_DO_SELO[statusContrato]}>{statusContrato}</Selo>
          <p className="cartao-plano__vigencia">
            {contratoComecou ? 'Vigência' : 'Vigência prevista'}: {formatarData(empresa.vigenciaInicio)} a{' '}
            {formatarData(empresa.vigenciaFim)}
          </p>
        </div>
      </div>

      <div className="cartao-plano__vagas">
        <BarraProgresso
          valor={vagasContratadas ? (vagasUsadas / vagasContratadas) * 100 : 0}
          legenda={`${vagasUsadas} de ${vagasContratadas} vagas usadas`}
        />
        <p className="cartao-plano__restantes">
          {restantes === 1 ? 'Resta 1 vaga.' : `Restam ${restantes} vagas.`}
        </p>
      </div>

      <a href={LINK_FALAR_COM_ENTRENOS} className="botao botao--secundario botao--grande">
        Falar com o EntreNós
      </a>
    </Card>
  );
}
