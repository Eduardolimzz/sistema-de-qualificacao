import React from 'react';
import styles from './MenuLateral.module.css';
import HomeIcon from "../../assets/HomeIcon.svg";
import CatalogoIcon from "../../assets/CatalogoIcon.svg";
import { NavLink } from 'react-router-dom';

import { Home, Book, Grid, Award, Calendar, BookOpen } from 'react-feather';

function MenuLateral() {
  return (
   <aside className={styles.menuLateral}>
         <nav className={styles['menuLateral-nav']}>
           <ul>
                <li>
                    <NavLink
                      to="/inicio"
                      className={({ isActive }) =>
                      isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
                      }
                      >
                      <img src={HomeIcon} className={styles.icon} alt="Início" />
                      <span>Início</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/catalogo"
                        className={({ isActive }) =>
                        isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
                        }
                        >
                        <img src={CatalogoIcon} className={styles.icon} alt="Catalogo" />
                        <span>Catálogo</span>
                    </NavLink>
                </li>
           </ul>
        </nav>
   </aside>
  );
}

export default MenuLateral;