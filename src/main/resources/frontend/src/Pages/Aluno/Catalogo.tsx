import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <-- IMPORTANTE para os links
import estilos from './Catalogo.module.css';

// Importando ícones
import { Clock, BookOpen, Users, Star } from 'react-feather';

// --- (INÍCIO) Simulação de API ---
const mockCatalogoData = [
  {
    id: 1, // O ID que vai para a URL
    title: 'Introdução ao React',
    description: 'Domine os fundamentos do React para iniciantes.',
    duration: 20,
    lessons: 15,
    enrolled: 1250,
    rating: 4.8,
    tags: ['React', 'Javascript', 'Frontend'],
    image: 'https://images.unsplash.com/photo-1633356122544-f13432450afa?w=400&q=80',
  },
  {
    id: 2,
    title: 'Node.js Avançado',
    description: 'Tópicos avançados de Node.js e backend.',
    duration: 25,
    lessons: 25,
    enrolled: 950,
    rating: 4.9,
    tags: ['Node.js', 'Javascript', 'Backend'],
    image: 'https://images.unsplash.com/photo-1632882765352-355e692f6164?w=400&q=80',
  },
  {
    id: 3,
    title: 'Python para Data Science',
    description: 'Análise de dados com Python, Pandas e Numpy.',
    duration: 35,
    lessons: 32,
    enrolled: 980,
    rating: 4.7,
    tags: ['Python', 'Data Science', 'Pandas'],
    image: 'https://images.unsplash.com/photo-1526379095098-d9a9f9bf2f2c?w=400&q=80',
  },
  {
    id: 4,
    title: 'UI/UX Design Completo',
    description: 'Design de interfaces e experiência do usuário.',
    duration: 45,
    lessons: 30,
    enrolled: 1200,
    rating: 4.9,
    tags: ['UI/UX', 'UX Design', 'Figma'],
    image: 'https://images.unsplash.com/photo-1581291518857-4e275080c941?w=400&q=80',
  },
  {
    id: 5,
    title: 'Marketing Digital Avançado',
    description: 'Tópicos avançados de marketing digital.',
    duration: 40,
    lessons: 28,
    enrolled: 750,
    rating: 4.6,
    tags: ['SEO', 'SEM', 'Google Ads'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
  },
  {
    id: 6,
    title: 'Gestão de Projetos Ágeis',
    description: 'Metodologias ágeis e gestão de projetos.',
    duration: 25,
    lessons: 18,
    enrolled: 850,
    rating: 4.8,
    tags: ['Scrum', 'Kanban', 'Agile'],
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&q=80',
  },
];

// Simulação de chamada de API
const fetchCatalogo = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCatalogoData);
    }, 500); // 0.5 segundo de loading
  });
};
// --- (FIM) Simulação de API ---

const Catalogo = () => {
  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCatalogo();
        setCursos(data);
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
      {/* Títulos */}
      <h1 className={estilos.pageTitle}>Catálogo de Cursos</h1>
      <p className={estilos.pageSubtitle}>
        Encontre o curso perfeito para sua carreira
      </p>

      {/* Grid de Cursos */}
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

              <div className={estilos.cardRating}>
                <Star size={16} className={estilos.starIcon} />
                <span>{curso.rating.toFixed(1)}</span>
              </div>

              <div className={estilos.cardTags}>
                {curso.tags.map((tag) => (
                  <span key={tag} className={estilos.tag}>{tag}</span>
                ))}
              </div>

              {/* O BOTÃO QUE LEVA PARA A PÁGINA DE DETALHES */}
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