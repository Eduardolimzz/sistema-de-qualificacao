import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProfessorService from '../../Services/professorService';

interface Professor {
  professorId: string;
  nomeprofessor: string;
  emailprofessor: string;
  senhaprofessor: string;
}

interface Curso {
  cursoId: string;
  nomeCurso: string;
  duracao: number;
  nivel: 'Básico' | 'Intermediário' | 'Avançado';
}

const ProfessorDetalhes = () => {
  const { professorId } = useParams();
  const navigate = useNavigate();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [cursos, setCursos] = useState<Curso[]>([]);

  useEffect(() => {
    carregarDados();
  }, [professorId]);

  const carregarDados = async () => {
    try {
      if (!professorId) return;
      
      // Carregar dados do professor
      const dadosProfessor = await ProfessorService.buscarPorId(professorId);
      setProfessor(dadosProfessor);

      // Mock de cursos ministrados pelo professor
      // TODO: Substituir por API real quando disponível
      const cursosMock: Curso[] = [
        { cursoId: '1', nomeCurso: 'React Básico', duracao: 40, nivel: 'Básico' },
        { cursoId: '2', nomeCurso: 'TypeScript Intermediário', duracao: 30, nivel: 'Intermediário' },
      ];
      setCursos(cursosMock);
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
      alert('Professor não encontrado');
      navigate('/admin/crud');
    }
  };

  if (!professor) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <button
        onClick={() => navigate('/admin/crud')}
        className="mb-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
      >
        ← Voltar
      </button>

      <h1 className="text-3xl font-bold mb-6 text-white">👨‍🏫 Detalhes do Professor</h1>

      {/* Informações do Professor */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">📋 Informações</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Nome</p>
            <p className="text-lg font-semibold text-white">{professor.nomeprofessor}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="text-lg font-semibold text-blue-400">{professor.emailprofessor}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">ID</p>
            <p className="text-lg font-semibold text-gray-500">{professor.professorId}</p>
          </div>
        </div>
      </div>

      {/* Cursos Ministrados */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">🎓 Cursos Ministrados ({cursos.length})</h2>
        
        {cursos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Este professor ainda não ministra nenhum curso</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cursos.map((c) => (
              <div
                key={c.cursoId}
                className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-white">{c.nomeCurso}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    c.nivel === 'Básico' ? 'bg-green-600 text-white' :
                    c.nivel === 'Intermediário' ? 'bg-yellow-500 text-white' :
                    'bg-red-600 text-white'
                  }`}>
                    {c.nivel}
                  </span>
                </div>
                <p className="text-sm text-gray-300">
                  <span className="font-medium">Duração:</span> {c.duracao} horas
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Estatísticas */}
      {cursos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-900 p-6 rounded-lg">
            <p className="text-sm text-blue-300 font-medium">Total de Cursos</p>
            <p className="text-3xl font-bold text-blue-400">{cursos.length}</p>
          </div>
          <div className="bg-green-900 p-6 rounded-lg">
            <p className="text-sm text-green-300 font-medium">Total de Horas</p>
            <p className="text-3xl font-bold text-green-400">
              {cursos.reduce((total, curso) => total + curso.duracao, 0)}h
            </p>
          </div>
          <div className="bg-purple-900 p-6 rounded-lg">
            <p className="text-sm text-purple-300 font-medium">Média de Horas</p>
            <p className="text-3xl font-bold text-purple-400">
              {Math.round(cursos.reduce((total, curso) => total + curso.duracao, 0) / cursos.length)}h
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorDetalhes;

