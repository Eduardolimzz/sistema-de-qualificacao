import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import TopoProfessor from '../../componentes/TopoProfessor/TopoProfessor';
import MenuLateralProfessor from '../../componentes/MenuLateralProfessor/MenuLateralProfessor';

export default function ProfessorLayout() {
  const location = useLocation();

  // Sempre rola para o topo ao trocar de aba/rota dentro de /professor
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

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


