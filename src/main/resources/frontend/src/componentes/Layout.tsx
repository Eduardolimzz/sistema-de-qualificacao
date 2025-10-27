import { Outlet } from "react-router-dom";
import Topo from "./Topo/Topo";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
        <Topo />
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet /> {/* Aqui entram as páginas */}
      </main>
    </div>
  );
}
