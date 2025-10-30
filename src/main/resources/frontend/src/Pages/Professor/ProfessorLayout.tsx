import { Outlet } from 'react-router-dom';
import TopoProfessor from '../../componentes/TopoProfessor/TopoProfessor';
import MenuLateralProfessor from '../../componentes/MenuLateralProfessor/MenuLateralProfessor';

export default function ProfessorLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', backgroundColor: '#263445' }}>
      <TopoProfessor />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <MenuLateralProfessor />
        <main style={{ flexGrow: 1 }}>
          <div style={{ padding: 110, paddingLeft: 230 }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}


