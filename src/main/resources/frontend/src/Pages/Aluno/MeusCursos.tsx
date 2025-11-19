import { useState, useEffect } from 'react';
import MatriculaService from '../../Services/matriculaService';
import estilos from './MeusCursos.module.css';
import { BarChart2, Clock, Calendar } from 'react-feather';

const MeusCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Pegar o ID do aluno logado
        const alunoId = localStorage.getItem('alunoId');

        if (!alunoId) {
          setError('Usuário não autenticado');
          return;
        }

        const data = await MatriculaService.listarMeusCursos(alunoId);

        // Formatar os dados
        const cursosFormatados = data.map(matricula => ({
          id: matricula.cursoId,
          title: matricula.nomecurso,
          status: matricula.status,
          level: matricula.curso?.nivel_curso || 'Não definido',
          duration: parseInt(matricula.curso?.duracao_curso) || 0,
          enrollDate: new Date().toLocaleDateString('pt-BR'), // você pode adicionar esse campo na entidade
          progressPercent: 0, // adicionar na entidade depois
          currentClasses: 0,
          totalClasses: matricula.curso?.lessons || 0,
          frequency: 100,
          performance: 0.0,
          averageGrade: 0.0
        }));

        setCursos(cursosFormatados);
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