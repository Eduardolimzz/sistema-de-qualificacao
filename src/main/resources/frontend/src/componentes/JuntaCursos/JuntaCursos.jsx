import React from 'react';
import CardCurso from '../CardCurso/CardCurso';
import styles from './JuntaCursos.module.css';
import reactImage from '../../assets/FotoReact.png';
import nodeImage from '../../assets/FotoNode.png';

function JuntaCursos() {
  const courses = [
    {
      image: reactImage,
      title: 'Introdução ao React',
      description: 'Fundamentos do React para iniciantes',
      duration: 20,
      lessons: 15,
      students: 1250,
      rating: 4.8,
      tags: ['React', 'Javascript', 'Frontend']
    },
    {
      image: nodeImage,
      title: 'Node.js Avançado',
      description: 'Node.js para desenvolvedores experientes',
      duration: 40,
      lessons: 25,
      students: 850,
      rating: 4.9,
      tags: ['Node.js', 'Javascript', 'Backend']
    }
  ];

  return (
    <section className={styles.juntaCursos}>
      <h2>Cursos em destaque</h2>
      <p>Descubra nossos cursos mais populares e comece sua jornada de aprendizado hoje</p>
      <div className={styles['cursos-grid']}>
        {courses.map((course) => (
          <CardCurso
            key={course.title}
            image={course.image}
            title={course.title}
            description={course.description}
            duration={course.duration}
            lessons={course.lessons}
            students={course.students}
            rating={course.rating}
            tags={course.tags}
          />
        ))}
      </div>
    </section>
  );
}

export default JuntaCursos;