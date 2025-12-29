import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MatriculaService from '../../Services/matriculaService';
import authService from '../../Services/authService';
import estilos from './MeusCursos.module.css';
import { BarChart2, Clock, Calendar } from 'react-feather';

const MeusCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const alunoId = authService.getAlunoId();
        console.log('🔍 Buscando cursos do aluno:', alunoId); // ✅ LOG

        if (!alunoId) {
          console.warn('⚠️ Nenhum alunoId encontrado no localStorage');
          setError('Usuário não autenticado. Faça login novamente.');
          setTimeout(() => {
            authService.logout();
            navigate('/login');
          }, 2000);
          return;
        }

        const data = await MatriculaService.listarCursosDoAluno(alunoId);
        console.log('📚 Matrículas encontradas:', data); // ✅ LOG
        console.log('📊 Quantidade de matrículas:', data?.length || 0); // ✅ LOG

        if (!data || data.length === 0) {
          console.log('ℹ️ Nenhuma matrícula encontrada');
          setCursos([]);
          setIsLoading(false);
          return;
        }

        const cursosFormatados = data.map(matricula => {
          console.log('🎓 Processando matrícula:', matricula); // ✅ LOG
          return {
            id: matricula.cursoId,
            title: matricula.nomecurso || 'Curso sem nome',
            status: matricula.status || 'Em Andamento',
            level: 'Não definido',
            duration: 0,
            enrollDate: new Date().toLocaleDateString('pt-BR'),
            progressPercent: 0,
            currentClasses: 0,
            totalClasses: 0,
            frequency: 100,
            performance: 0.0,
            averageGrade: 0.0
          };
        });

        console.log('✅ Cursos formatados:', cursosFormatados); // ✅ LOG
        setCursos(cursosFormatados);
      } catch (err) {
        console.error('❌ Erro ao carregar cursos:', err); // ✅ LOG
        console.error('❌ Detalhes do erro:', err.response || err.message);
        setError('Falha ao carregar seus cursos.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  if (isLoading) {
    return <div className={estilos.loadingMessage}>Carregando seus cursos...</div>;
  }

  if (error) {
    return <div className={estilos.errorMessage}>{error}</div>;
  }

  if (cursos.length === 0) {
    return (
      <div className={estilos.pageContainer}>
        <h1 className={estilos.pageTitle}>Meus Cursos</h1>
        <div className={estilos.emptyState}>
          <p>Você ainda não está matriculado em nenhum curso.</p>
          <button
            className={estilos.catalogoButton}
            onClick={() => navigate('/aluno/catalogo')}
          >
            Explorar Catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={estilos.pageContainer}>
      <h1 className={estilos.pageTitle}>Meus Cursos</h1>
      <p className={estilos.pageSubtitle}>
        Acompanhe seu progresso, boletim e frequência em todos os cursos
      </p>

      <div className={estilos.cursosList}>
        {cursos.map((curso) => (
          <div key={curso.id} className={estilos.courseCard}>
            <div className={estilos.cardHeader}>
              <h2 className={estilos.cardTitle}>{curso.title}</h2>
              <span
                className={`${estilos.cardStatus} ${
                  curso.status === 'Concluído' ? estilos.statusConcluido : ''
                }`}
              >
                {curso.status}
              </span>
            </div>

            <div className={estilos.metaData}>
              <span><BarChart2 size={14} /> {curso.level}</span>
              <span><Clock size={14} /> {curso.duration} horas</span>
              <span><Calendar size={14} /> Inscrito em {curso.enrollDate}</span>
            </div>

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

            <div className={estilos.statsGrid}>
              <div className={estilos.statItem}>
                <span className={estilos.statValue}>{curso.frequency}%</span>
                <p className={estilos.statLabel}>Frequência</p>
              </div>
              <div className={estilos.statItem}>
                <span className={estilos.statValue}>
                  {curso.performance.toFixed(1)}
                </span>
                <p className={estilos.statLabel}>Desempenho</p>
              </div>
              <div className={estilos.statItem}>
                <span className={estilos.statValue}>
                  {curso.averageGrade.toFixed(1)}
                </span>
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