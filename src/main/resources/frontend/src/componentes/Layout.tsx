import { Outlet, useNavigate } from "react-router-dom";
import Topo from "./Topo/Topo";
import estilos from './Layout.module.css';

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet /> {/* Aqui entram as páginas */}
      </main>
    </div>
  );
}
