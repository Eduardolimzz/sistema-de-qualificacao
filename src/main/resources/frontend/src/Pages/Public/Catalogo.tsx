import React from 'react';
import MenuLateral from '../../componentes/MenuLateral/MenuLateral';
import Topo from '../../componentes/Topo/Topo';
import styles from './Catalogo.module.css';
import CursosCatalogo from '../../componentes/CursosCatalogo/CursosCatalogo';

const Catalogo = () => {
  return (
    <div className="Catalogo-container">
      <MenuLateral />
      <Topo />

     <div className={styles['main-content']}>

         <main>
            <CursosCatalogo />
         </main>
     </div>
    </div>
  );
};

export default Catalogo;
