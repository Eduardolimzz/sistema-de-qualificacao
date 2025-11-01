import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfessorService from '../../Services/professorService';

type Tab = 'professores' | 'cursos';

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
  professorId?: string;
}

const CRUDAdmin = () => {
  const navigate = useNavigate();
  const [tabAtiva, setTabAtiva] = useState<Tab>('professores');
  
  // Estados de dados
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [busca, setBusca] = useState('');
  const [filtroNivel, setFiltroNivel] = useState<string>('todos');
  
  // Estados de formulários
  const [novoProfessor, setNovoProfessor] = useState({ nomeprofessor: '', emailprofessor: '', senhaprofessor: '' });
  const [novoCurso, setNovoCurso] = useState<{ nomeCurso: string; duracao: number; nivel: 'Básico' | 'Intermediário' | 'Avançado'; professorId: string }>({ nomeCurso: '', duracao: 0, nivel: 'Básico', professorId: '' });
  
  // Estados de edição
  const [editandoProfessor, setEditandoProfessor] = useState<Professor | null>(null);
  const [editandoCurso, setEditandoCurso] = useState<Curso | null>(null);

  useEffect(() => {
    carregarProfessores();
    carregarCursos();
  }, []);

  // Funções de carregamento
  const carregarProfessores = async () => {
    try {
      const dados = await ProfessorService.listarProfessores();
      setProfessores(dados);
    } catch (e) {
      console.error('Erro ao carregar professores:', e);
    }
  };

  const carregarCursos = async () => {
    try {
      const cursosMock: Curso[] = [
        { cursoId: '1', nomeCurso: 'React Básico', duracao: 40, nivel: 'Básico', professorId: '1' },
        { cursoId: '2', nomeCurso: 'Node.js Avançado', duracao: 60, nivel: 'Avançado', professorId: '2' },
        { cursoId: '3', nomeCurso: 'TypeScript Intermediário', duracao: 30, nivel: 'Intermediário', professorId: '1' },
      ];
      setCursos(cursosMock);
    } catch (e) {
      console.error('Erro ao carregar cursos:', e);
    }
  };

  // Funções de Professores
  const criarProfessor = async () => {
    try {
      console.log('Criando professor:', novoProfessor);
      const resultado = await ProfessorService.criarProfessor(novoProfessor);
      console.log('Professor criado:', resultado);
      setNovoProfessor({ nomeprofessor: '', emailprofessor: '', senhaprofessor: '' });
      carregarProfessores();
      alert('Professor criado com sucesso!');
    } catch (e: any) {
      console.error('Erro ao criar professor:', e);
      const mensagem = e.response?.data?.mensagem || e.message || 'Erro ao criar professor';
      alert(`Erro: ${mensagem}`);
    }
  };

  const editarProfessor = (professor: Professor) => {
    setEditandoProfessor(professor);
    setNovoProfessor({ nomeprofessor: professor.nomeprofessor, emailprofessor: professor.emailprofessor, senhaprofessor: '' });
  };

  const salvarEdicaoProfessor = async () => {
    if (!editandoProfessor) return;
    try {
      await ProfessorService.atualizarProfessor(editandoProfessor.professorId, novoProfessor);
      setEditandoProfessor(null);
      setNovoProfessor({ nomeprofessor: '', emailprofessor: '', senhaprofessor: '' });
      carregarProfessores();
    } catch (e) {
      console.error('Erro ao atualizar professor:', e);
    }
  };

  const deletarProfessor = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este professor?')) {
      try {
        await ProfessorService.deletarProfessor(id);
        carregarProfessores();
      } catch (e) {
        console.error('Erro ao deletar professor:', e);
      }
    }
  };

  const verDetalhesProfessor = (professorId: string) => {
    navigate(`/admin/professor/${professorId}`);
  };

  // Funções de Cursos
  const criarCurso = async () => {
    try {
      const novoCursoCompleto: Curso = {
        cursoId: Date.now().toString(),
        ...novoCurso,
        professorId: novoCurso.professorId || undefined
      };
      setCursos([...cursos, novoCursoCompleto]);
      setNovoCurso({ nomeCurso: '', duracao: 0, nivel: 'Básico', professorId: '' });
    } catch (e) {
      console.error('Erro ao criar curso:', e);
      alert('Erro ao criar curso');
    }
  };

  const editarCurso = (curso: Curso) => {
    setEditandoCurso(curso);
    setNovoCurso({ nomeCurso: curso.nomeCurso, duracao: curso.duracao, nivel: curso.nivel, professorId: curso.professorId || '' });
  };

  const salvarEdicaoCurso = async () => {
    if (!editandoCurso) return;
    try {
      setCursos(cursos.map(c => c.cursoId === editandoCurso.cursoId ? { ...editandoCurso, ...novoCurso } : c));
      setEditandoCurso(null);
      setNovoCurso({ nomeCurso: '', duracao: 0, nivel: 'Básico', professorId: '' });
    } catch (e) {
      console.error('Erro ao atualizar curso:', e);
    }
  };

  const deletarCurso = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este curso?')) {
      try {
        setCursos(cursos.filter(c => c.cursoId !== id));
      } catch (e) {
        console.error('Erro ao deletar curso:', e);
      }
    }
  };

  const verDetalhesCurso = (cursoId: string) => {
    navigate(`/admin/curso/${cursoId}`);
  };

  // Filtros
  const professoresFiltrados = professores.filter(
    (p) =>
      p.nomeprofessor.toLowerCase().includes(busca.toLowerCase()) ||
      p.emailprofessor.toLowerCase().includes(busca.toLowerCase())
  );

  const cursosFiltrados = cursos.filter(
    (c) => {
      const matchBusca = c.nomeCurso.toLowerCase().includes(busca.toLowerCase());
      const matchNivel = filtroNivel === 'todos' || c.nivel === filtroNivel;
      return matchBusca && matchNivel;
    }
  );

  const getProfessorNome = (professorId?: string) => {
    if (!professorId) return 'Não atribuído';
    const professor = professores.find(p => p.professorId === professorId);
    return professor?.nomeprofessor || 'Não atribuído';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">⚙️ Gerenciamento Completo</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-700">
        <button
          onClick={() => setTabAtiva('professores')}
          className={`px-6 py-3 font-semibold ${
            tabAtiva === 'professores'
              ? 'border-b-2 border-blue-500 text-blue-400'
              : 'text-gray-400 hover:text-blue-400'
          }`}
        >
          👨‍🏫 Professores ({professores.length})
        </button>
        <button
          onClick={() => setTabAtiva('cursos')}
          className={`px-6 py-3 font-semibold ${
            tabAtiva === 'cursos'
              ? 'border-b-2 border-blue-500 text-blue-400'
              : 'text-gray-400 hover:text-blue-400'
          }`}
        >
          🎓 Cursos ({cursos.length})
        </button>
      </div>

      {/* Busca */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="🔍 Buscar..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 max-w-md px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500"
        />
        {tabAtiva === 'cursos' && (
          <select
            value={filtroNivel}
            onChange={(e) => setFiltroNivel(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500"
          >
            <option value="todos">Todos os níveis</option>
            <option value="Básico">Básico</option>
            <option value="Intermediário">Intermediário</option>
            <option value="Avançado">Avançado</option>
          </select>
        )}
      </div>

      {/* Tab de Professores */}
      {tabAtiva === 'professores' && (
        <div className="space-y-6">
          {/* Formulário */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">
              {editandoProfessor ? '✏️ Editar Professor' : '➕ Adicionar Professor'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Nome"
                value={novoProfessor.nomeprofessor}
                onChange={(e) => setNovoProfessor({ ...novoProfessor, nomeprofessor: e.target.value })}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              />
              <input
                type="email"
                placeholder="Email"
                value={novoProfessor.emailprofessor}
                onChange={(e) => setNovoProfessor({ ...novoProfessor, emailprofessor: e.target.value })}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              />
              <input
                type="password"
                placeholder="Senha"
                value={novoProfessor.senhaprofessor}
                onChange={(e) => setNovoProfessor({ ...novoProfessor, senhaprofessor: e.target.value })}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={editandoProfessor ? salvarEdicaoProfessor : criarProfessor}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editandoProfessor ? '💾 Salvar' : '➕ Adicionar'}
              </button>
              {editandoProfessor && (
                <button
                  onClick={() => {
                    setEditandoProfessor(null);
                    setNovoProfessor({ nomeprofessor: '', emailprofessor: '', senhaprofessor: '' });
                  }}
                  className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  ❌ Cancelar
                </button>
              )}
            </div>
          </div>

          {/* Lista */}
          <div className="bg-gray-800 rounded-lg shadow-lg">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">📋 Lista de Professores</h2>
              <div className="space-y-2">
                {professoresFiltrados.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Nenhum professor encontrado</p>
                ) : (
                  professoresFiltrados.map((p) => (
                    <div key={p.professorId} className="flex justify-between items-center p-4 bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-750">
                      <div>
                        <p className="font-semibold text-lg text-white">{p.nomeprofessor}</p>
                        <p className="text-sm text-gray-400">{p.emailprofessor}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => verDetalhesProfessor(p.professorId)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">📄 Detalhes</button>
                        <button onClick={() => editarProfessor(p)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">✏️ Editar</button>
                        <button onClick={() => deletarProfessor(p.professorId)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">🗑️ Excluir</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab de Cursos */}
      {tabAtiva === 'cursos' && (
        <div className="space-y-6">
          {/* Formulário */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">
              {editandoCurso ? '✏️ Editar Curso' : '➕ Adicionar Curso'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Nome do Curso"
                value={novoCurso.nomeCurso}
                onChange={(e) => setNovoCurso({ ...novoCurso, nomeCurso: e.target.value })}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              />
              <input
                type="number"
                placeholder="Duração (horas)"
                value={novoCurso.duracao}
                onChange={(e) => setNovoCurso({ ...novoCurso, duracao: parseInt(e.target.value) || 0 })}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              />
              <select
                value={novoCurso.nivel}
                onChange={(e) => setNovoCurso({ ...novoCurso, nivel: e.target.value as 'Básico' | 'Intermediário' | 'Avançado' })}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              >
                <option value="Básico">Básico</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
              <select
                value={novoCurso.professorId}
                onChange={(e) => setNovoCurso({ ...novoCurso, professorId: e.target.value })}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              >
                <option value="">Selecionar Professor</option>
                {professores.map((p) => (
                  <option key={p.professorId} value={p.professorId}>
                    {p.nomeprofessor}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={editandoCurso ? salvarEdicaoCurso : criarCurso}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editandoCurso ? '💾 Salvar' : '➕ Adicionar'}
              </button>
              {editandoCurso && (
                <button
                  onClick={() => {
                    setEditandoCurso(null);
                    setNovoCurso({ nomeCurso: '', duracao: 0, nivel: 'Básico', professorId: '' });
                  }}
                  className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  ❌ Cancelar
                </button>
              )}
            </div>
          </div>

          {/* Lista de Cursos em Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursosFiltrados.length === 0 ? (
              <div className="col-span-full text-center py-8 bg-gray-800 rounded-lg shadow-lg">
                <p className="text-gray-400">Nenhum curso encontrado</p>
              </div>
            ) : (
              cursosFiltrados.map((c) => (
                <div key={c.cursoId} className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-white">{c.nomeCurso}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      c.nivel === 'Básico' ? 'bg-green-600 text-white' :
                      c.nivel === 'Intermediário' ? 'bg-yellow-500 text-white' :
                      'bg-red-600 text-white'
                    }`}>
                      {c.nivel}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">Duração:</span> {c.duracao} horas
                    </p>
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">Professor:</span> {getProfessorNome(c.professorId)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => verDetalhesCurso(c.cursoId)} className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">📄 Detalhes</button>
                    <button onClick={() => editarCurso(c)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">✏️</button>
                    <button onClick={() => deletarCurso(c.cursoId)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CRUDAdmin;

