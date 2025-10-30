import React from 'react';
import styles from './CardCurso.module.css';

function CardCurso({
  image,
  title,
  description,
  duration,
  lessons,
  students,
  rating,
  tags
}) {
  return (
    <div className={styles['cardCurso-card']}>

      <img src={image} alt={title} className={styles['card-image']} />

      <div className={styles['card-content']}>
        <h3>{title}</h3>
        <p className={styles['card-description']}>{description}</p>

        <div className={styles['card-metadata']}>
          <span>{duration}h</span>
          <span>{lessons} aulas</span>
          <span>{students}</span>
        </div>
        <div className={styles['card-rating']}>
          {rating}
        </div>
        <div className={styles['card-tags']}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
        <button className={styles['btn-details']}>Ver Detalhes</button>
      </div>
    </div>
  );
}

export default CardCurso;