import React from 'react';
import { NavLink } from 'react-router-dom';
import estilos from './MenuLateralAdmin.module.css';
import { Users } from 'react-feather';

export default function MenuLateralAdmin() {
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
            <NavLink onClick={goTop} to="/admin/crud" className={({ isActive }) => isActive ? `${estilos.item} ${estilos.active}` : estilos.item}>
              <Users size={18} className={estilos.icon} />
              <span>Gerenciamento</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

