import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MatriculaService from '../../Services/matriculaService';
import authService from '../../Services/authService';
import estilos from './Dashboard.module.css';

const Dashboard = () => {
  const navigate = useNavigate();

  // Estados
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estatísticas calculadas
  const [stats, setStats] = useState({
    totalCursos: 0,
    cursosCompletos: 0,
    horasEstudadas: 0
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setIsLoading(true);

      // 1. Carregar nome do usuário
      const nome = authService.getUserName();
      setNomeUsuario(nome && nome !== 'null' && nome !== 'undefined' ? nome : 'Aluno');

      // 2. Buscar matrículas do aluno
      const alunoId = authService.getAlunoId();

      if (!alunoId) {
        console.warn('⚠️ Nenhum alunoId encontrado');
        setError('Usuário não autenticado. Faça login novamente.');
        setTimeout(() => {
          authService.logout();
          navigate('/login');
        }, 2000);
        return;
      }

      const data = await MatriculaService.listarCursosDoAluno(alunoId);
      console.log('📚 Matrículas carregadas:', data);

      if (!data || data.length === 0) {
        setCursos([]);
        setStats({ totalCursos: 0, cursosCompletos: 0, horasEstudadas: 0 });
        setIsLoading(false);
        return;
      }

      // 3. Formatar cursos
      const cursosFormatados = data.map(matricula => ({
        id: matricula.cursoId,
        title: matricula.nomecurso || 'Curso sem nome',
        status: matricula.status || 'ATIVO',
        progress: 0, // TODO: Implementar progresso real quando backend estiver pronto
//         image: matricula.image || 'https://via.placeholder.com/400x200?text=Curso',
        duration: parseInt(matricula.duracao_curso) || 0
      }));

      // 4. Calcular estatísticas
      const totalCursos = cursosFormatados.length;
      const cursosCompletos = cursosFormatados.filter(c => c.status === 'CONCLUIDO').length;
      const horasEstudadas = cursosFormatados.reduce((total, curso) => total + curso.duration, 0);

      setCursos(cursosFormatados);
      setStats({
        totalCursos,
        cursosCompletos,
        horasEstudadas
      });

    } catch (err) {
      console.error('❌ Erro ao carregar dados do dashboard:', err);
      setError('Falha ao carregar dados.');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading
  if (isLoading) {
    return (
      <div className={estilos.dashboardContainer}>
        <div className={estilos.loadingMessage}>Carregando dados...</div>
      </div>
    );
  }

  // Erro
  if (error) {
    return (
      <div className={estilos.dashboardContainer}>
        <div className={estilos.errorMessage}>{error}</div>
      </div>
    );
  }

  // Estado vazio
  if (cursos.length === 0) {
    return (
      <div className={`${estilos.dashboardContainer} p-6`}>
        <h1 className={estilos.welcomeHeader}>Olá, {nomeUsuario}!</h1>
        <p className={estilos.welcomeSubheader}>Continue sua jornada de aprendizado</p>

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

  // Renderização normal com dados
  return (
    <div className={`${estilos.dashboardContainer} p-6`}>

      {/* Saudação */}
      <h1 className={estilos.welcomeHeader}>Olá, {nomeUsuario}!</h1>
      <p className={estilos.welcomeSubheader}>Continue sua jornada de aprendizado</p>

      {/* Estatísticas */}
      <div className={estilos.statsGrid}>
        <div className={estilos.statCard}>
          <p className={estilos.statTitle}>Cursos Inscritos</p>
          <p className={estilos.statValue}>{stats.totalCursos}</p>
        </div>
        <div className={estilos.statCard}>
          <p className={estilos.statTitle}>Concluídos</p>
          <p className={estilos.statValue}>{stats.cursosCompletos}</p>
        </div>
        <div className={estilos.statCard}>
          <p className={estilos.statTitle}>Horas de Conteúdo</p>
          <p className={estilos.statValue}>{stats.horasEstudadas}h</p>
        </div>
      </div>

      {/* Cursos em Andamento */}
      <h2 className={estilos.sectionTitle}>Cursos em Andamento</h2>

      <div className={estilos.coursesList}>
        {cursos
          .filter(curso => curso.status === 'ATIVO') // Só mostra cursos ativos
          .slice(0, 3) // Mostra no máximo 3 cursos
          .map((curso) => (
            <div key={curso.id} className={estilos.courseCard}>

              <img
                src={curso.image}
//                 alt={curso.title}
//                 className={estilos.courseImage}
                onError={(e) => {
//                   e.target.src = 'className={estilos.cardTitle}>{curso.title}';
                }}
              />

              <div className={estilos.courseInfo}>
                <h3 className={estilos.courseTitle}>{curso.title}</h3>
                <p className={estilos.progressLabel}>Progresso</p>

                <div className={estilos.progressContainer}>
                  <div className={estilos.progressBarContainer}>
                    <div
                      className={estilos.progressBarFill}
                      style={{ width: `${curso.progress}%` }}
                    ></div>
                  </div>
                  <span className={estilos.progressPercent}>{curso.progress}%</span>
                </div>
              </div>

              <button
                className={estilos.continueButton}
                onClick={() => navigate(`/aluno/catalogo/${curso.id}`)}
              >
                Continuar
              </button>
            </div>
          ))}
      </div>

      {/* Botão para ver todos os cursos */}
      {cursos.length > 3 && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            className={estilos.catalogoButton}
            onClick={() => navigate('/aluno/meus_cursos')}
          >
            Ver Todos os Cursos
          </button>
        </div>
      )}

    </div>
  );
};

export default Dashboard;