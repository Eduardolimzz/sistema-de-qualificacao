import React from 'react';
import { NavLink } from 'react-router-dom';
import estilos from './MenuLateralProfessor.module.css';
import { Home, Users, CheckSquare, Calendar, BarChart2 } from 'react-feather';

export default function MenuLateralProfessor() {
  const goTop = () => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const root = document.getElementById('root');
      if (root) root.scrollTop = 0;
    } catch {}
  };
  return (
    <aside className={estilos.menuLateral}>
      <nav className={estilos.nav}>
        <ul>
          <li>
            <NavLink onClick={goTop} to="/professor/dashboard" className={({ isActive }) => isActive ? `${estilos.item} ${estilos.active}` : estilos.item}>
              <Home size={18} className={estilos.icon} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink onClick={goTop} to="/professor/alunos" className={({ isActive }) => isActive ? `${estilos.item} ${estilos.active}` : estilos.item}>
              <Users size={18} className={estilos.icon} />
              <span>Meus Alunos</span>
            </NavLink>
          </li>
          <li>
            <NavLink onClick={goTop} to="/professor/avaliacoes" className={({ isActive }) => isActive ? `${estilos.item} ${estilos.active}` : estilos.item}>
              <CheckSquare size={18} className={estilos.icon} />
              <span>Avaliações</span>
            </NavLink>
          </li>
          <li>
            <NavLink onClick={goTop} to="/professor/eventos" className={({ isActive }) => isActive ? `${estilos.item} ${estilos.active}` : estilos.item}>
              <Calendar size={18} className={estilos.icon} />
              <span>Eventos</span>
            </NavLink>
          </li>
          <li>
            <NavLink onClick={goTop} to="/professor/relatorios" className={({ isActive }) => isActive ? `${estilos.item} ${estilos.active}` : estilos.item}>
              <BarChart2 size={18} className={estilos.icon} />
              <span>Relatórios</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}


