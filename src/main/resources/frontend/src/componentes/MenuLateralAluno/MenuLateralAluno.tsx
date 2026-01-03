import React from 'react';
import { NavLink } from 'react-router-dom';
import estilos from './MenuLateralAluno.module.css';

import { Home, Book, Grid, Award, Calendar, BookOpen } from 'react-feather';

export default function MenuLateralAluno() {
  return (
    <aside className={estilos.menuLateralContainer}>
      <nav className={estilos.navMenu}>
        <ul>
          <li>
            <NavLink
              to="/aluno/catalogo"
              className={({ isActive }) =>
                isActive ? `${estilos.menuItem} ${estilos.active}` : estilos.menuItem
              }
            >
              <Book size={18} className={estilos.icon} />
              <span>Catálogo</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/aluno/dashboard" // Rota do dashboard
              className={({ isActive }) =>
                isActive ? `${estilos.menuItem} ${estilos.active}` : estilos.menuItem
              }
            >
              <Grid size={18} className={estilos.icon} />
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* Link para Meus Cursos */}
          <li>
            <NavLink
              to="/aluno/meus_cursos"
              className={({ isActive }) =>
                isActive ? `${estilos.menuItem} ${estilos.active}` : estilos.menuItem
              }
            >
              <BookOpen size={18} className={estilos.icon} />
              <span>Meus Cursos</span>
            </NavLink>
          </li>

          {/* Link para Meus Avaliações */}
          <li>
            <NavLink
              to="/aluno/avaliacoes"
              className={({ isActive }) =>
                isActive ? `${estilos.menuItem} ${estilos.active}` : estilos.menuItem
              }
            >
              <BookOpen size={18} className={estilos.icon} />
              <span>Minhas Avaliações</span>
            </NavLink>
          </li>

          {/* Link para Certificados */}
          <li>
            <NavLink
              to="/aluno/certificados"
              className={({ isActive }) =>
                isActive ? `${estilos.menuItem} ${estilos.active}` : estilos.menuItem
              }
            >
              <Award size={18} className={estilos.icon} />
              <span>Certificados</span>
            </NavLink>
          </li>

          {/* Link para Eventos */}
          <li>
            <NavLink
              to="/aluno/eventos"
              className={({ isActive }) =>
                isActive ? `${estilos.menuItem} ${estilos.active}` : estilos.menuItem
              }
            >
              <Calendar size={18} className={estilos.icon} />
              <span>Eventos</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
    );
    }