import { Outlet, Link } from 'react-router-dom';
import estilos from './Layout.module.css'
import Topo from './componentes/Topo/Topo';
import TopoAluno from './componentes/TopoAluno/TopoAluno';
import MenuLateralAluno from './componentes/MenuLateralAluno/MenuLateralAluno';



export default function Layout() {
  return (
    <div className={estilos.layoutContainer}> {/* Ou use uma classe Tailwind */}

        <TopoAluno /> {/* O topo fica sempre em cima */}

        <div className={estilos.contentWrapper}> {/* Wrapper para o menu e conteúdo principal */}
          <MenuLateralAluno /> {/* O menu lateral */}
          <main className={estilos.mainContent}> {/* O conteúdo da página */}
            <Outlet /> {/* Aqui a página ativa será renderizada */}
          </main>
        </div>
    </div>
  );
}