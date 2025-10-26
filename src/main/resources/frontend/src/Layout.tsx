import { Outlet, Link } from 'react-router-dom';
import estilos from './Layout.module.css'
import Topo from './componentes/Topo/Topo';
import MenuLateral from './componentes/MenuLateral/MenuLateral';



export default function Layout() {
  return (
    <div>
      <Topo />
       <MenuLateral />
      <main className={estilos.main}>
        <Outlet />
      </main>

    </div>
  );
}