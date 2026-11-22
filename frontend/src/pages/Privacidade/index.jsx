import PaginaLegal from '../../components/PaginaLegal/PaginaLegal';

export default function Privacidade() {
  return (
    <PaginaLegal titulo="Política de privacidade">
      <section>
        <h2>Quais dados o sistema guarda</h2>
        <ul>
          <li>Empresa: nome, CNPJ, responsável e e-mail, pacote, vagas e situação do contrato.</li>
          <li>
            Colaborador: nome, e-mail, empresa, datas do convite e da ativação e o aceite dos termos. A senha é
            guardada só como um código que não pode ser revertido (hash), nunca como texto.
          </li>
          <li>Solicitações: o serviço escolhido, a mensagem, o status e as datas.</li>
          <li>Formulário da página inicial: nome, empresa, e-mail, número de colaboradores e mensagem.</li>
        </ul>
      </section>

      <section>
        <h2>A mensagem para a universidade</h2>
        <p>
          A mensagem que o colaborador escreve ao solicitar um serviço é só para a universidade. A equipe EntreNós
          (admin) não vê o conteúdo: vê apenas se existe uma mensagem. Não escreva documentos, dados bancários ou
          informações pessoais dos seus filhos.
        </p>
        <p>Neste MVP, os e-mails são simulados: nenhum e-mail sai de fato do sistema.</p>
      </section>

      <section>
        <h2>Quem vê o quê</h2>
        <ul>
          <li>Colaborador: os próprios dados e as próprias solicitações.</li>
          <li>
            Empresa: o contrato e a lista de colaboradores convidados (nome, e-mail e status). Não vê as solicitações
            de cada pessoa.
          </li>
          <li>Equipe EntreNós: empresas, serviços e solicitações, sem o conteúdo das mensagens.</li>
          <li>Universidade: recebe por e-mail as solicitações dos seus serviços.</li>
        </ul>
      </section>

      <section>
        <h2>Para que os dados são usados</h2>
        <p>
          Só para o sistema funcionar: entrar, convidar colaboradores, registrar solicitações e contar o limite do mês.
          Os dados não são vendidos nem usados para publicidade, e o site não usa ferramentas de rastreamento.
        </p>
      </section>

      <section>
        <h2>No seu navegador</h2>
        <p>
          Para manter você conectado, o navegador guarda o seu acesso até você sair ou até ele vencer, em no máximo 8
          horas.
        </p>
      </section>

      <section>
        <h2>Seus direitos (LGPD)</h2>
        <p>
          Você pode pedir acesso, correção ou exclusão dos seus dados ao RH da sua empresa ou à equipe EntreNós. Como
          este é um projeto acadêmico, use apenas dados fictícios.
        </p>
      </section>
    </PaginaLegal>
  );
}
