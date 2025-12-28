import React from 'react';
import MenuLateral from '../../componentes/MenuLateral/MenuLateral';
import Topo from '../../componentes/Topo/Topo';
import AprendaComMelhores from '../../componentes/AprendaComMelhores/AprendaComMelhores';
import JuntaCursos from '../../componentes/JuntaCursos/JuntaCursos';
import styles from './PaginaHome.module.css';

function PaginaHome() {
  return (
    <div className={styles['PaginaHome-container']}>
      <MenuLateral />
      <Topo />
      <div className={styles['main-content']}>

        <main>
          <AprendaComMelhores />
          <JuntaCursos />
        </main>
      </div>
    </div>
  );
}

export default PaginaHome;