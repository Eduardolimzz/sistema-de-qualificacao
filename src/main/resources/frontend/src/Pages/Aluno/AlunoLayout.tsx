import { Outlet } from 'react-router-dom';

import MenuLateralAluno from '../../componentes/MenuLateralAluno/MenuLateralAluno';
import TopoAluno from '../../componentes/TopoAluno/TopoAluno';

import estilos from './AlunoLayout.module.css';

const AlunoLayout = () => {
  return (
    // Container principal - agora é VERTICAL
    <div className={estilos.alunoLayoutContainer}>

      <TopoAluno />

      <div className={estilos.bodyContainer}>

        <MenuLateralAluno />

        {/* 2b. Conteúdo Principal */}
        <main className={estilos.mainContent}>
          <div className={estilos.pageContent}>
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default AlunoLayout;