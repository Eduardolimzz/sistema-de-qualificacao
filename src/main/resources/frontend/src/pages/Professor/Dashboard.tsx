import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../Services/authService';
import { MatriculaProfessorService } from '../../Services/matriculaService';

const cardStyle: React.CSSProperties = {
  backgroundColor: '#1f2937',
  borderRadius: 8,
  padding: 16,
  color: '#e5e7eb',
  boxShadow: '0 1px 2px rgba(0,0,0,0.4)'
};

const statNumberStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  textAlign: 'center'
};

const smallMuted: React.CSSProperties = {
  fontSize: 14,
  color: '#9ca3af',
  textAlign: 'center'
};

export default function Dashboard() {
  const navigate = useNavigate();

  // Estados
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCursos: 0,
    totalAlunos: 0,
    totalAvaliacoes: 0,
    mediaNotas: 0
  });

  // Carrega dados ao montar
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);

      const professorId = authService.getProfessorId();

      if (!professorId) {
        console.error('Professor ID não encontrado');
        return;
      }

      // Busca cursos do professor
      const matriculas = await MatriculaProfessorService.listarCursosDoProfessor(professorId);

      // Processa os dados
      const cursosComDetalhes = matriculas.map(mat => ({
        id: mat.curso?.cursoId || mat.cursoId,
        nome: mat.curso?.nomecurso || 'Curso sem nome',
        nivel: mat.curso?.nivel_curso || 'Não definido',
        duracao: mat.curso?.duracao_curso || '0h',
        totalAlunos: 0, // Por enquanto zero, depois vamos buscar
        avaliacoes: 0,
        media: 0
      }));

      setCursos(cursosComDetalhes);

      // Calcula estatísticas
      setStats({
        totalCursos: cursosComDetalhes.length,
        totalAlunos: cursosComDetalhes.reduce((acc, c) => acc + c.totalAlunos, 0),
        totalAvaliacoes: cursosComDetalhes.reduce((acc, c) => acc + c.avaliacoes, 0),
        mediaNotas: cursosComDetalhes.length > 0
          ? cursosComDetalhes.reduce((acc, c) => acc + c.media, 0) / cursosComDetalhes.length
          : 0
      });

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        padding: 20,
        color: '#e5e7eb',
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <p style={{ fontSize: 20 }}>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: 20,
      color: '#e5e7eb',
      backgroundColor: '#0f172a',
      minHeight: '100vh',
      borderRadius: 8
    }}>

      {/* Título com nome do professor */}
      <h2 style={{
        textAlign: 'center',
        fontSize: 26,
        fontWeight: 800,
        margin: '8px 0 18px 0',
        color: '#60a5fa'
      }}>
        Olá, {authService.getUserName()}!
      </h2>

      {/* KPIs */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: 18,
        marginBottom: 32
      }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center' }}>
            Total de Cursos
          </div>
          <div style={statNumberStyle}>{stats.totalCursos}</div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center' }}>
            Total de Alunos
          </div>
          <div style={statNumberStyle}>{stats.totalAlunos}</div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center' }}>
            Avaliações
          </div>
          <div style={statNumberStyle}>{stats.totalAvaliacoes}</div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center' }}>
            Média de Notas
          </div>
          <div style={statNumberStyle}>
            {stats.mediaNotas > 0 ? stats.mediaNotas.toFixed(1) : '-'}
          </div>
        </div>
      </section>

      {/* Título cursos */}
      <h3 style={{
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 800,
        margin: '28px 0 14px 0',
        color: '#f3f4f6'
      }}>
        Cursos Ministrados
      </h3>

      {/* Mensagem se não tiver cursos */}
      {cursos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#1f2937',
          borderRadius: 8
        }}>
          <p style={{ fontSize: 18, color: '#9ca3af', marginBottom: 20 }}>
            Você ainda não está associado a nenhum curso.
          </p>
          <p style={{ fontSize: 14, color: '#6b7280' }}>
            Entre em contato com o administrador para ser associado a cursos.
          </p>
        </div>
      ) : (

        /* Cards de cursos */
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 24
        }}>
          {cursos.map((curso) => (
            <div key={curso.id} style={{ ...cardStyle, padding: 22 }}>
              <div style={{ fontWeight: 800, marginBottom: 8, fontSize: 18 }}>
                {curso.nome}
              </div>
              <div style={{ fontSize: 14, color: '#9ca3af' }}>{curso.nivel}</div>
              <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 10 }}>
                {curso.duracao}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
                marginTop: 8
              }}>
                <div style={{ background: '#111827', borderRadius: 6, padding: 8 }}>
                  <div style={smallMuted}>Alunos</div>
                  <div style={statNumberStyle}>{curso.totalAlunos}</div>
                </div>
                <div style={{ background: '#111827', borderRadius: 6, padding: 8 }}>
                  <div style={smallMuted}>Avaliações</div>
                  <div style={statNumberStyle}>{curso.avaliacoes}</div>
                </div>
                <div style={{ background: '#111827', borderRadius: 6, padding: 8 }}>
                  <div style={smallMuted}>Média</div>
                  <div style={statNumberStyle}>
                    {curso.media > 0 ? curso.media.toFixed(1) : '-'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button
                  onClick={() => navigate('/professor/relatorios')}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: 15,
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Relatórios
                </button>
                <button
                  onClick={() => navigate('/professor/alunos')}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: '#111827',
                    color: '#e5e7eb',
                    border: '1px solid #1f2937',
                    fontSize: 15,
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Alunos
                </button>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}