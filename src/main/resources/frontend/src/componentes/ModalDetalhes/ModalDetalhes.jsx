import React from 'react';
import styles from './ModalDetalhes.module.css';

function ModalDetalhes({ curso, onClose }) {
  if (!curso) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>

        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <img src={curso.image} alt={curso.title} className={styles.modalImage} />
        <h2>{curso.title}</h2>
        <p>{curso.fullDescription}</p>

        <hr className={styles.divider} />

        <div className={styles.infoSection}>
          <strong>Professor(a):</strong> {curso.professor}
        </div>

        <div className={styles.infoSection}>
          <strong>Conteúdo do Curso:</strong>
          <ul className={styles.moduleList}>
            {curso.modulos && curso.modulos.map((modulo) => (
              <li key={modulo}>{modulo}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ModalDetalhes;