import React from 'react';
import styles from './Topo.module.css';

function Topo() {
  return (
    <header className={styles.topo}>
      <div className={styles['logo-container']}>
          <img src="/LogoICEAA.png" alt="Fundação ICEAA" />
      </div>
      <div className={styles['topo-nav']}>
        <button className={styles['btn-login']}>Entrar</button>
        <button className={styles['btn-signup']}>Cadastrar</button>
      </div>
    </header>
  );
}

export default Topo;