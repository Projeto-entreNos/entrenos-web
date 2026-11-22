import { Link } from 'react-router-dom';
import PaginaLegal from '../../components/PaginaLegal/PaginaLegal';

export default function Termos() {
  return (
    <PaginaLegal titulo="Termos de uso">
      <section>
        <h2>O que é o EntreNós</h2>
        <p>
          Uma plataforma que conecta empresas a serviços de universidades parceiras. A empresa contrata um pacote e
          oferece os atendimentos como benefício aos colaboradores. Os atendimentos são feitos por alunos, com
          supervisão de professores.
        </p>
      </section>

      <section>
        <h2>Dados de exemplo</h2>
        <p>
          Todas as empresas, pessoas, universidades, e-mails e CNPJs que aparecem no sistema são inventados. Qualquer
          semelhança com dados reais é coincidência.
        </p>
      </section>

      <section>
        <h2>Como funciona o uso</h2>
        <ul>
          <li>A empresa convida os colaboradores por e-mail. Cada convidado ocupa uma vaga do contrato.</li>
          <li>O colaborador pode solicitar os serviços disponíveis, até o limite de atendimentos do mês do pacote.</li>
          <li>Uma solicitação pode ser cancelada enquanto está como &quot;Enviada&quot;.</li>
          <li>A equipe EntreNós cadastra os serviços e acompanha as solicitações.</li>
        </ul>
      </section>

      <section>
        <h2>Responsabilidades</h2>
        <p>
          Os atendimentos são combinados diretamente com a universidade. Por ser um projeto acadêmico, o sistema é
          oferecido como está, sem garantia de funcionamento contínuo.
        </p>
      </section>

      <section>
        <h2>Privacidade</h2>
        <p>
          Para saber quais dados o sistema guarda e quem pode vê-los, leia a{' '}
          <Link to="/privacidade">Política de privacidade</Link>.
        </p>
      </section>
    </PaginaLegal>
  );
}
