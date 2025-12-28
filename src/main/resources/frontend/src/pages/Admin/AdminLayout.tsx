import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import TopoAdmin from '../../componentes/TopoAdmin/TopoAdmin';
import MenuLateralAdmin from '../../componentes/MenuLateralAdmin/MenuLateralAdmin';

export default function AdminLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', backgroundColor: '#263445' }}>
      <TopoAdmin />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <MenuLateralAdmin />
        <main style={{ flexGrow: 1 }}>
          <div style={{ paddingTop: 110, paddingBottom: 32, paddingRight: 24, width: 'calc(100% - 230px)', marginLeft: 230 }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

