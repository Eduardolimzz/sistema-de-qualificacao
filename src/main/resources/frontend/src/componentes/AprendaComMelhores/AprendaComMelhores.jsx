import React from 'react';
import styles from './AprendaComMelhores.module.css';
import { Link } from 'react-router-dom';

function AprendaComMelhores() {
  return (
      <section className={styles['aprenda-section']}>
        <h1>Aprenda com os <span className={styles.highlight}>melhores</span></h1>
        <p>Transforme sua carreira com nossos cursos online de alta qualidade. Aprenda no seu ritmo, com instrutores especialistas e certificação reconhecida.</p>

     <div className={styles['aprenda-buttons']}>
         <Link
           to="/catalogo"
           className={styles['btn-primary']}
         >
           Explorar Cursos
         </Link>

         <Link
           to="/login"
           className={styles['btn-secondary']}
         >
           Começar Agora
         </Link>
     </div>
    </section>
  );
}

export default AprendaComMelhores;