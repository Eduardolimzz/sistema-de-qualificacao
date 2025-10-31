import React, { useState } from 'react';
import CardCurso from '../CardCurso/CardCurso';
import ModalDetalhes from '../ModalDetalhes/ModalDetalhes';
import styles from './JuntaCursos.module.css';
import reactImage from '../../assets/FotoReact.png';
import nodeImage from '../../assets/FotoNode.png';

function JuntaCursos() {
  const courses = [
    {
      image: reactImage,
      title: 'Introdução ao React',
      description: 'Fundamentos do React para iniciantes',
      fullDescription: 'Este curso cobre todos os fundamentos do React, incluindo hooks, componentes, estado, props e como criar uma aplicação de página única (SPA). Perfeito para quem está começando no frontend.',
      duration: 20,
      lessons: 15,
      students: 1250,
      rating: 4.8,
      tags: ['React', 'Javascript', 'Frontend'],
      professor: 'Juliana Silva',
            modulos: [
              'Módulo 1: Introdução e Setup',
              'Módulo 2: Componentes e Props',
              'Módulo 3: Estado e Hooks (useState, useEffect)',
              'Módulo 4: Renderização Condicional e Listas'
            ]
    },
    {
      image: nodeImage,
      title: 'Node.js Avançado',
      description: 'Node.js para desenvolvedores experientes',
      fullDescription: 'Aprenda a construir APIs robustas e escaláveis com Node.js. Este curso foca em performance, microserviços, testes automatizados e deploy de aplicações backend complexas.',
      duration: 40,
      lessons: 25,
      students: 850,
      rating: 4.9,
      tags: ['Node.js', 'Javascript', 'Backend'],
      professor: 'Ricardo Oliveira',
            modulos: [
              'Módulo 1: Arquitetura de Microserviços',
              'Módulo 2: Testes Avançados (TDD, BDD)',
              'Módulo 3: Performance, Caching e Redis',
              'Módulo 4: Deploy (Docker, Kubernetes)'
            ]
    }
  ];

  const [cursoSelecionado, setCursoSelecionado] = useState(null);

  const handleVerDetalhes = (curso) => {
    setCursoSelecionado(curso);
  };

  const handleCloseModal = () => {
    setCursoSelecionado(null);
  };

  return (
    <section className={styles.juntaCursos}>
      <h2>Cursos em destaque</h2>
      <p>Descubra nossos cursos mais populares e comece sua jornada de aprendizado hoje!</p>
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
            onVerDetalhesClick={() => handleVerDetalhes(course)}
          />
        ))}
      </div>

      <ModalDetalhes
        curso={cursoSelecionado}
        onClose={handleCloseModal}
      />
    </section>
  );
}

export default JuntaCursos;