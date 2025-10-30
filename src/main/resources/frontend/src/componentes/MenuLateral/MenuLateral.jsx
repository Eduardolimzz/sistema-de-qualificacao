import React from 'react';
import styles from './MenuLateral.module.css';
import HomeIcon from "../../assets/HomeIcon.svg";
import CatalogoIcon from "../../assets/CatalogoIcon.svg";


function MenuLateral() {
  return (
   <aside className={styles.menuLateral}>
         <nav className={styles['menuLateral-nav']}>
           <ul>
                <li className={styles.active}>
                    <img src={HomeIcon} className={styles.icon} alt="Início" />
                    <span>Início</span>
                </li>
                <li>
                    <img src={CatalogoIcon} className={styles.icon} alt="Catalogo" />
                    <span>Catálogo</span>
                </li>
           </ul>
        </nav>
   </aside>
  );
}

export default MenuLateral;