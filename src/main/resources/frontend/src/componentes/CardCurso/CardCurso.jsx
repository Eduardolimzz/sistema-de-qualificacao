import React from 'react';
import styles from './CardCurso.module.css';
import ClockIcon from "../../assets/ClockIcon.svg";
import PlayIcon from "../../assets/PlayIcon.svg";
import UserIcon from "../../assets/UserIcon.svg";
import StarIcon from "../../assets/StarIcon.svg";

function CardCurso({
  image,
  title,
  description,
  duration,
  lessons,
  students,
  rating,
  tags,
  onVerDetalhesClick
}) {
  return (
    <div className={styles['cardCurso-card']}>

      <img src={image} alt={title} className={styles['card-image']} />

      <div className={styles['card-content']}>
        <h3>{title}</h3>
        <p className={styles['card-description']}>{description}</p>

        <div className={styles['card-metadata']}>
          <img src={ClockIcon} className={styles.icon} alt="Duração" />
          <span>{duration}</span>

          <img src={PlayIcon} className={styles.icon} alt="Aulas" />
          <span>{lessons} aulas</span>

          <img src={UserIcon} className={styles.icon} alt="Alunos" />
          <span>{students}</span>

          <img src={StarIcon} className={styles.icon} alt="Avaliação" />
          {rating}
        </div>

        <div className={styles['card-tags']}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>

        <button
          className={styles['btn-details']}
          onClick={onVerDetalhesClick}
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );
}

export default CardCurso;