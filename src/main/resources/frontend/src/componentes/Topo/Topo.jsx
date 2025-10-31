import React from 'react';
import styles from './Topo.module.css';
import { Link } from 'react-router-dom';

function Topo() {
  return (
    <header className={styles.topo}>
      <div className={styles['logo-container']}>
          <img src="/LogoICEAA.png" alt="Fundação ICEAA" />
      </div>

      <div className={styles['topo-nav']}>
               <Link
                 to="/login"
                 className={styles['btn-login']}
               >
                 Entrar
               </Link>

               <Link
                 to="/cadastro"
                 className={styles['btn-signup']}
               >
                 Cadastrar
               </Link>
           </div>
    </header>
  );
}

export default Topo;