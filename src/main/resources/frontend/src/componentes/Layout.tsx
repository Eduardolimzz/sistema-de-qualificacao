import { Outlet, useNavigate } from "react-router-dom";
import Topo from "./Topo/Topo";
import estilos from './Layout.module.css';

export default function Layout() {
  const navigate = useNavigate();
  
  return (
    <div className={estilos.layout_container}>
      <Topo />
      <aside className={estilos.sidebar}>
        <nav className={estilos.nav}>
          <div className={estilos.nav_item} onClick={() => navigate('/')}>
            <span className={estilos.nav_icon}>🏠</span>
            <span>Início</span>
          </div>
          <div className={estilos.nav_item} onClick={() => navigate('/cursos')}>
            <span className={estilos.nav_icon}>📚</span>
            <span>Catálogo</span>
          </div>
        </nav>
      </aside>
      <div className={estilos.content_wrapper}>
        <main className={estilos.main_content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
