import React, { useState, useEffect } from 'react';
import CardCurso from '../CardCurso/CardCurso';
import ModalDetalhes from '../ModalDetalhes/ModalDetalhes';
import styles from './JuntaCursos.module.css';
import CursoService from '../../Services/CursoService'; // Importando o serviço

function JuntaCursos() {
  const [courses, setCourses] = useState([]); // Estado para os cursos do banco
  const [cursoSelecionado, setCursoSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);

  // Busca os dados reais do banco de dados ao carregar o componente
  useEffect(() => {
    const buscarCursosReais = async () => {
      try {
        const dados = await CursoService.carregarCursos();
        setCourses(dados);
      } catch (error) {
        console.error("Erro ao carregar cursos reais:", error);
      } finally {
        setLoading(false);
      }
    };

    buscarCursosReais();
  }, []);

  const handleVerDetalhes = (curso) => {
    setCursoSelecionado(curso);
  };

  const handleCloseModal = () => {
    setCursoSelecionado(null);
  };

  if (loading) {
    return <div className={styles.loading}>Carregando cursos...</div>;
  }

  return (
    <section className={styles.juntaCursos}>
      <h2>Cursos em destaque</h2>
      <p>Descubra nossos cursos mais populares e comece sua jornada de aprendizado hoje!</p>

      <div className={styles['cursos-grid']}>
        {courses.length > 0 ? (
          courses.map((course) => (
            <CardCurso
              key={course.cursoId} // Usando o ID real do banco
              image={course.imagem_url || 'https://via.placeholder.com/300x200'} // URL do banco ou fallback
              title={course.nomecurso}
              description={course.descricao || 'Sem descrição disponível'}
              duration={course.duracao_curso}
              // Os campos abaixo podem vir do banco ou serem valores padrão se não existirem na API
              lessons={course.total_aulas || 10}
              students={course.total_alunos || 0}
              rating={course.avaliacao || 5.0}
              tags={course.tags ? course.tags.split(',') : [course.nivel_curso]}
              onVerDetalhesClick={() => handleVerDetalhes(course)}
            />
          ))
        ) : (
          <p>Nenhum curso cadastrado no momento.</p>
        )}
      </div>

      <ModalDetalhes
        curso={cursoSelecionado}
        onClose={handleCloseModal}
      />
    </section>
  );
}

export default JuntaCursos;