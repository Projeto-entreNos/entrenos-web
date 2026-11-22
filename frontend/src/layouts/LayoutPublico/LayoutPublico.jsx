import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavbarPublica from '../../components/NavbarPublica/NavbarPublica';
import Rodape from '../../components/Rodape/Rodape';
import '../layouts.css';

export default function LayoutPublico() {
  const { hash, pathname } = useLocation();

  // O React Router não rola até âncoras: com "#secao" no endereço, rola até o elemento; sem "#", volta ao topo
  useEffect(() => {
    if (hash) {
      const elemento = document.getElementById(hash.slice(1));
      if (elemento) elemento.scrollIntoView();
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [hash, pathname]);

  return (
    <div className="layout-publico">
      <a href="#conteudo" className="pular-para-conteudo">
        Pular para o conteúdo
      </a>
      <NavbarPublica />
      <main id="conteudo" className="layout-publico__conteudo">
        <Outlet />
      </main>
      <Rodape />
    </div>
  );
}
