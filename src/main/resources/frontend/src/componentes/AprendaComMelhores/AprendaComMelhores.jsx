import React from 'react';
import styles from './AprendaComMelhores.module.css';

function AprendaComMelhores() {
  return (
      <section className={styles['aprenda-section']}>
        <h1>Aprenda com os <span className={styles.highlight}>melhores</span></h1>
        <p>Transforme sua carreira...</p>
        <div className={styles['aprenda-buttons']}>
            <button className={styles['btn-primary']}>Explorar Cursos</button>
            <button className={styles['btn-secondary']}>Começar Agora</button>
        </div>
    </section>
  );
}

export default AprendaComMelhores;