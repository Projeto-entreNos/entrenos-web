import iconeAtendimentoOnline from '../../assets/icones/atendimento-online.svg';
import iconeEmail from '../../assets/icones/email.svg';
import iconeTelefone from '../../assets/icones/telefone.svg';
import iconeWhatsapp from '../../assets/icones/whatsapp.svg';
import Logo from '../../components/Logo/Logo';
import FormularioProposta from './FormularioProposta';

// Contatos fictícios (números reservados para exemplo)
const CANAIS = [
  { icone: iconeAtendimentoOnline, titulo: 'Atendimento online', texto: 'Chat no site, de segunda a sexta, das 8h às 18h' },
  { icone: iconeWhatsapp, titulo: 'WhatsApp', texto: '(11) 90000-0000' },
  { icone: iconeTelefone, titulo: 'Telefone', texto: '(11) 4000-0000' },
  // O ícone de e-mail do Figma vem sem o círculo de fundo: o CSS desenha o círculo
  { icone: iconeEmail, titulo: 'E-mail', texto: 'contato@entrenos.com.br', comFundo: true },
];

export default function SecaoContato() {
  return (
    <section id="contato" className="landing-contato" aria-labelledby="landing-contato-titulo">
      <div className="container landing-contato__grade">
        <div className="landing-contato__canais">
          <div className="landing-contato__cabecalho">
            <div className="landing-contato__logo">
              <Logo fundo="escuro" tamanho="grande" />
            </div>
            <h2 id="landing-contato-titulo" className="landing-contato__titulo">
              Fale com a gente
            </h2>
            <p className="landing__texto-grande">Tire dúvidas sobre os pacotes ou peça uma proposta para a sua empresa.</p>
          </div>

          <ul className="landing-contato__lista">
            {CANAIS.map((canal) => (
              <li key={canal.titulo} className="landing-contato__canal">
                <span className={`landing-contato__icone ${canal.comFundo ? 'landing-contato__icone--com-fundo' : ''}`}>
                  <img src={canal.icone} alt="" />
                </span>
                <span className="landing-contato__textos">
                  <span className="landing-contato__canal-titulo">{canal.titulo}</span>
                  <span>{canal.texto}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <FormularioProposta />
      </div>
    </section>
  );
}
