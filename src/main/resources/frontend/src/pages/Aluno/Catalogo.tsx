import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CursoService from '../../Services/cursoService';
import estilos from './Catalogo.module.css';
import { Clock, BookOpen, Users, Star } from 'react-feather';

const Catalogo = () => {
  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await CursoService.listarCursos();

        // Transformar os dados do backend para o formato esperado
        const cursosFormatados = data.map(curso => ({
          id: curso.cursoId,
          title: curso.nomecurso,
          description: curso.description || 'Sem descrição disponível',
          duration: parseInt(curso.duracao_curso) || 0,
          lessons: curso.lessons || 0,
          enrolled: curso.enrolled || 0,
          rating: curso.rating || 0, // ✅ Valor padrão se for null
          tags: curso.tags ? curso.tags.split(',').map(tag => tag.trim()) : [],
          image: curso.image || 'https://via.placeholder.com/400x200?text=Curso'
        }));

        setCursos(cursosFormatados);
      } catch (err) {
        setError('Falha ao carregar o catálogo de cursos.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return <div className={estilos.loadingMessage}>Carregando catálogo...</div>;
  }

  if (error) {
    return <div className={estilos.errorMessage}>{error}</div>;
  }

  return (
    <div className={estilos.pageContainer}>
      <h1 className={estilos.pageTitle}>Catálogo de Cursos</h1>
      <p className={estilos.pageSubtitle}>
        Encontre o curso perfeito para sua carreira
      </p>

      <div className={estilos.catalogoGrid}>
        {cursos.map((curso) => (
          <div key={curso.id} className={estilos.courseCard}>
            <img src={curso.image} alt={curso.title} className={estilos.cardImage} />

            <div className={estilos.cardContent}>
              <h2 className={estilos.cardTitle}>{curso.title}</h2>
              <p className={estilos.cardDescription}>{curso.description}</p>

              <div className={estilos.cardMeta}>
                <span><Clock size={14} /> {curso.duration}h</span>
                <span><BookOpen size={14} /> {curso.lessons} aulas</span>
                <span><Users size={14} /> {curso.enrolled}</span>
              </div>

              {/* ✅ Renderização condicional do rating */}
              {curso.rating > 0 && (
                <div className={estilos.cardRating}>
                  <Star size={16} className={estilos.starIcon} />
                  <span>{curso.rating.toFixed(1)}</span>
                </div>
              )}

              {curso.tags.length > 0 && (
                <div className={estilos.cardTags}>
                  {curso.tags.map((tag, index) => (
                    <span key={index} className={estilos.tag}>{tag}</span>
                  ))}
                </div>
              )}

              <div className={estilos.cardFooter}>
                <Link
                  to={`/aluno/catalogo/${curso.id}`}
                  className={estilos.detailsButton}
                >
                  Ver Detalhes
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalogo;