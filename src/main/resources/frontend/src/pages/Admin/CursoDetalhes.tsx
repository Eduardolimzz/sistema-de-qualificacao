import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Curso {
  cursoId: string;
  nomeCurso: string;
  duracao: number;
  nivel: 'Básico' | 'Intermediário' | 'Avançado';
  professorId?: string;
}

interface Aluno {
  alunoId: string;
  nomealuno: string;
  emailaluno: string;
}

interface Professor {
  professorId: string;
  nomeprofessor: string;
  emailprofessor: string;
}

const CursoDetalhes = () => {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState<Curso | null>(null);
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);

  useEffect(() => {
    carregarDados();
  }, [cursoId]);

  const carregarDados = async () => {
    try {
      if (!cursoId) return;
      
      // Mock de dados do curso
      const cursoMock: Curso = {
        cursoId: cursoId,
        nomeCurso: 'React Básico',
        duracao: 40,
        nivel: 'Básico',
        professorId: '1'
      };
      setCurso(cursoMock);

      // Mock de professor
      const professorMock: Professor = {
        professorId: '1',
        nomeprofessor: 'João Silva',
        emailprofessor: 'joao@example.com'
      };
      setProfessor(professorMock);

      // Mock de alunos matriculados
      const alunosMock: Aluno[] = [
        { alunoId: '1', nomealuno: 'Maria Santos', emailaluno: 'maria@example.com' },
        { alunoId: '2', nomealuno: 'Pedro Oliveira', emailaluno: 'pedro@example.com' },
        { alunoId: '3', nomealuno: 'Ana Costa', emailaluno: 'ana@example.com' },
      ];
      setAlunos(alunosMock);
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
      alert('Curso não encontrado');
      navigate('/admin/crud');
    }
  };

  if (!curso) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'Básico': return 'bg-green-600 text-white';
      case 'Intermediário': return 'bg-yellow-500 text-white';
      case 'Avançado': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <button
        onClick={() => navigate('/admin/crud')}
        className="mb-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
      >
        ← Voltar
      </button>

      <h1 className="text-3xl font-bold mb-6 text-white">🎓 Detalhes do Curso</h1>

      {/* Informações do Curso */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-semibold text-white">{curso.nomeCurso}</h2>
          <span className={`px-3 py-1 rounded text-sm font-medium ${getNivelColor(curso.nivel)}`}>
            {curso.nivel}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-400">Duração</p>
            <p className="text-lg font-semibold text-white">{curso.duracao} horas</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">ID do Curso</p>
            <p className="text-lg font-semibold text-gray-500">{curso.cursoId}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Professor Responsável */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">👨‍🏫 Professor Responsável</h2>
          {professor ? (
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-400">Nome</p>
                <p className="font-semibold text-white">{professor.nomeprofessor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-semibold text-blue-400">{professor.emailprofessor}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Nenhum professor atribuído</p>
          )}
        </div>

        {/* Estatísticas */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">📊 Estatísticas</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-900 p-4 rounded-lg">
              <p className="text-sm text-blue-300 font-medium">Alunos Matriculados</p>
              <p className="text-3xl font-bold text-blue-400">{alunos.length}</p>
            </div>
            <div className="bg-green-900 p-4 rounded-lg">
              <p className="text-sm text-green-300 font-medium">Taxa de Ocupação</p>
              <p className="text-3xl font-bold text-green-400">85%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alunos Matriculados */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">
          👥 Alunos Matriculados ({alunos.length})
        </h2>
        
        {alunos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Nenhum aluno matriculado neste curso</p>
          </div>
        ) : (
          <div className="space-y-2">
            {alunos.map((aluno) => (
              <div
                key={aluno.alunoId}
                className="flex justify-between items-center p-4 bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-750"
              >
                <div>
                  <p className="font-semibold text-white">{aluno.nomealuno}</p>
                  <p className="text-sm text-gray-400">{aluno.emailaluno}</p>
                </div>
                <span className="text-sm text-green-400 font-medium">✓ Matriculado</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CursoDetalhes;

