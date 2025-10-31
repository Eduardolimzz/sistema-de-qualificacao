import { useState, useEffect } from 'react';
import estilos from './MeusCursos.module.css';

// Importando ícones
import { BarChart2, Clock, Calendar } from 'react-feather';

// --- (INÍCIO) Simulação de API ---
// No futuro, você vai apagar isso e fazer um fetch
const mockMeusCursosData = [
  {
    id: 1,
    title: 'Introdução ao React',
    status: 'Em Andamento',
    level: 'Iniciante',
    duration: 40,
    enrollDate: '14/01/2024',
    progressPercent: 72,
    currentClasses: 15,
    totalClasses: 20,
    frequency: 95,
    performance: 8.5,
    averageGrade: 8.2,
  },
  {
    id: 2,
    title: 'Desenvolvimento Web Avançado',
    status: 'Em Andamento',
    level: 'Intermediário',
    duration: 60,
    enrollDate: '31/01/2024',
    progressPercent: 45,
    currentClasses: 13,
    totalClasses: 30,
    frequency: 88,
    performance: 7.8,
    averageGrade: 7.9,
  },
  {
    id: 3,
    title: 'Data Science e Machine Learning',
    status: 'Concluído',
    level: 'Avançado',
    duration: 80,
    enrollDate: '09/01/2024',
    progressPercent: 100,
    currentClasses: 35,
    totalClasses: 35,
    frequency: 98,
    performance: 9.2,
    averageGrade: 9.1,
  },
];

// Simulação de chamada de API
const fetchMeusCursos = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMeusCursosData);
    }, 1000); // 1 segundo de loading
  });
};
// --- (FIM) Simulação de API ---


const MeusCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMeusCursos();
        setCursos(data);
      } catch (err) {
        setError('Falha ao carregar seus cursos.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return <div className={estilos.loadingMessage}>Carregando seus cursos...</div>;
  }

  if (error) {
    return <div className={estilos.errorMessage}>{error}</div>;
  }

  return (
    <div className={estilos.pageContainer}>

      {/* Títulos */}
      <h1 className={estilos.pageTitle}>Meus Cursos</h1>
      <p className={estilos.pageSubtitle}>
        Acompanhe seu progresso, boletim e frequência em todos os cursos
      </p>

      {/* Lista de Cursos */}
      <div className={estilos.cursosList}>
        {cursos.map((curso) => (
          <div key={curso.id} className={estilos.courseCard}>

            {/* Cabeçalho do Card */}
            <div className={estilos.cardHeader}>
              <h2 className={estilos.cardTitle}>{curso.title}</h2>
              <span
                className={`${estilos.cardStatus} ${curso.status === 'Concluído' ? estilos.statusConcluido : ''}`}
              >
                {curso.status}
              </span>
            </div>

            {/* Meta-dados (Nível, Duração, Data) */}
            <div className={estilos.metaData}>
              <span><BarChart2 size={14} /> {curso.level}</span>
              <span><Clock size={14} /> {curso.duration} horas</span>
              <span><Calendar size={14} /> Inscrito em {curso.enrollDate}</span>
            </div>

            {/* Seção de Progresso */}
            <div className={estilos.progressSection}>
              <div className={estilos.progressLabels}>
                <span>Progresso</span>
                <span>{curso.progressPercent}%</span>
              </div>
              <div className={estilos.progressBarContainer}>
                <div
                  className={estilos.progressBarFill}
                  style={{ width: `${curso.progressPercent}%` }}
                ></div>
              </div>
              <p className={estilos.progressText}>
                {curso.currentClasses} de {curso.totalClasses} aulas
              </p>
            </div>

            {/* Seção de Stats (Frequência, Desempenho, Média) */}
            <div className={estilos.statsGrid}>
              <div className={estilos.statItem}>
                <span className={estilos.statValue}>{curso.frequency}%</span>
                <p className={estilos.statLabel}>Frequência</p>
              </div>
              <div className={estilos.statItem}>
                <span className={estilos.statValue}>{curso.performance.toFixed(1)}</span>
                <p className={estilos.statLabel}>Desempenho</p>
              </div>
              <div className={estilos.statItem}>
                <span className={estilos.statValue}>{curso.averageGrade.toFixed(1)}</span>
                <p className={estilos.statLabel}>Média Geral</p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MeusCursos;