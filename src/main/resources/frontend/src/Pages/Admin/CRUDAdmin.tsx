import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfessorService from '../../Services/professorService';
import AlunoService from '../../Services/AlunoService';
import CursoService from '../../Services/CursoService';

type Tab = 'aluno' | 'professores' | 'cursos';

interface Professor {
  professorId: string;
  nomeprofessor: string;
  emailprofessor: string;
  senhaprofessor: string;
}

interface Curso {
  cursoId: string;
  nomecurso: string;
  duracao_curso: string;
  nivel_curso: string;
}

interface Aluno {
  alunoId: string;
  nomealuno: string;
  emailaluno: string;
}

const CRUDAdmin = () => {
  const navigate = useNavigate();
  const [tabAtiva, setTabAtiva] = useState<Tab>('aluno');

  const [professores, setProfessores] = useState<Professor[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);

  const [busca, setBusca] = useState('');
  const [filtroNivel, setFiltroNivel] = useState<string>('todos');

  const [novoProfessor, setNovoProfessor] = useState({ nomeprofessor: '', emailprofessor: '', senhaprofessor: '' });
  const [novoCurso, setNovoCurso] = useState({ nomecurso: '', duracao_curso: '', nivel_curso: 'Básico' , professorId: ''});
  const [novoAluno, setNovoAluno] = useState({ nomealuno: '', emailaluno: '', senhaaluno: '' });

  const [editandoProfessor, setEditandoProfessor] = useState<Professor | null>(null);
  const [editandoCurso, setEditandoCurso] = useState<Curso | null>(null);
  const [editandoAluno, setEditandoAluno] = useState<Aluno | null>(null);

  useEffect(() => {
    carregarProfessores();
    carregarCursos();
    carregarAlunos();
  }, []);

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
      const dados = await CursoService.carregarCursos();
      setCursos(dados);
    } catch (e) {
      console.error('Erro ao carregar cursos:', e);
    }
  };

  const carregarAlunos = async () => {
    try {
      const dados = await AlunoService.carregarAlunos();
      setAlunos(dados);
    } catch (e) {
      console.error('Erro ao carregar alunos:', e);
    }
  };

  const criarProfessor = async () => {
    if (!novoProfessor.nomeprofessor || !novoProfessor.emailprofessor || !novoProfessor.senhaprofessor) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    try {
      console.log('Criando professor:', novoProfessor);
      const resultado = await ProfessorService.criarProfessor(novoProfessor);
      console.log('Professor criado:', resultado);
      setNovoProfessor({ nomeprofessor: '', emailprofessor: '', senhaprofessor: '' });
      carregarProfessores();
      alert('Professor criado com sucesso!');
    } catch (e: any) {
      console.error('Erro ao criar professor:', e);
      const mensagem = e.response?.data?.mensagem || e.response?.data?.message || e.message || 'Erro ao criar professor';
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

  const criarCurso = async () => {

     if (!novoCurso.professorId) {
         alert('⚠️ Você precisa selecionar um professor para criar o curso!');
         return;
        }
    try {
      await CursoService.criarCurso(novoCurso);
      setNovoCurso({ nomecurso: '', duracao_curso: '', nivel_curso: 'Básico', professorId: ''  });
      carregarCursos();
      alert('Curso criado com sucesso!');
    } catch (e) {
      console.error('Erro ao criar curso:', e);
      alert('Erro ao criar curso');
    }
  };

  const editarCurso = (curso: Curso) => {
    setEditandoCurso(curso);
    setNovoCurso({ nomecurso: curso.nomecurso, duracao_curso: curso.duracao_curso, nivel_curso: curso.nivel_curso, professorId: curso.professorId || '' });
  };

  const salvarEdicaoCurso = async () => {
    if (!editandoCurso) return;

      if (!novoCurso.professorId) {
        alert('⚠️ Você precisa selecionar um professor!');
        return;
      }

    try {
      await CursoService.atualizarCurso(editandoCurso.cursoId, novoCurso);
      setEditandoCurso(null);
      setNovoCurso({ nomecurso: '', duracao_curso: '', nivel_curso: 'Básico', professorId: '' });
      carregarCursos();
      alert('Curso atualizado com sucesso!');
    } catch (e) {
      console.error('Erro ao atualizar curso:', e);
      alert('Erro ao atualizar curso');
    }
  };

  const deletarCurso = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este curso?')) {
      try {
        await CursoService.deletarCurso(id);
        carregarCursos();
        alert('Curso excluído com sucesso!');
      } catch (e) {
        console.error('Erro ao deletar curso:', e);
        alert('Erro ao deletar curso');
      }
    }
  };

  const verDetalhesCurso = (cursoId: string) => {
    navigate(`/admin/curso/${cursoId}`);
  };

  const criarAluno = async () => {
    if (!novoAluno.nomealuno || !novoAluno.emailaluno || !novoAluno.senhaaluno) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    try {
      const dto = {
        nome: novoAluno.nomealuno,
        email: novoAluno.emailaluno,
        senha: novoAluno.senhaaluno
      };
      await AlunoService.criarAluno(dto);
      setNovoAluno({ nomealuno: '', emailaluno: '', senhaaluno: '' });
      carregarAlunos();
      alert('Aluno criado com sucesso!');
    } catch (e: any) {
      console.error('Erro ao criar aluno:', e);
      const mensagemErro = e.response?.data?.mensagem || e.response?.data?.message || e.message || 'Erro ao criar aluno';
      alert(`Erro: ${mensagemErro}`);
    }
  };

  const editarAluno = (aluno: Aluno) => {
    setEditandoAluno(aluno);
    setNovoAluno({ nomealuno: aluno.nomealuno, emailaluno: aluno.emailaluno, senhaaluno: '' });
  };

  const salvarEdicaoAluno = async () => {
    if (!editandoAluno) return;
    try {
      const dto = {
        nome: novoAluno.nomealuno,
        senha: novoAluno.senhaaluno
      };
      await AlunoService.atualizarAluno(editandoAluno.alunoId, dto);
      setEditandoAluno(null);
      setNovoAluno({ nomealuno: '', emailaluno: '', senhaaluno: '' });
      carregarAlunos();
    } catch (e) {
      console.error('Erro ao atualizar aluno:', e);
    }
  };

  const deletarAluno = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        await AlunoService.deletarAluno(id);
        carregarAlunos();
      } catch (e) {
        console.error('Erro ao deletar aluno:', e);
      }
    }
  };

  const professoresFiltrados = professores.filter(
    (p) =>
      p.nomeprofessor.toLowerCase().includes(busca.toLowerCase()) ||
      p.emailprofessor.toLowerCase().includes(busca.toLowerCase())
  );

  const cursosFiltrados = cursos.filter(
    (c) => {
      const matchBusca = c.nomecurso.toLowerCase().includes(busca.toLowerCase());
      const matchNivel = filtroNivel === 'todos' || c.nivel_curso === filtroNivel;
      return matchBusca && matchNivel;
    }
  );

  const alunosFiltrados = alunos.filter(
    (a) =>
      a.nomealuno.toLowerCase().includes(busca.toLowerCase()) ||
      a.emailaluno.toLowerCase().includes(busca.toLowerCase())
  );

  const getProfessorNome = (professorId?: string) => {
    if (!professorId) return 'Não atribuído';
    const professor = professores.find(p => p.professorId === professorId);
    return professor?.nomeprofessor || 'Não atribuído';
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    padding: 16,
    color: '#e5e7eb',
    boxShadow: '0 1px 2px rgba(0,0,0,0.4)'
  };

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px',
    backgroundColor: '#111827',
    border: '1px solid #1f2937',
    borderRadius: 6,
    color: '#e5e7eb',
    fontSize: 14
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 12px',
    borderRadius: 8,
    background: '#111827',
    color: '#e5e7eb',
    border: '1px solid #1f2937',
    fontSize: 15,
    cursor: 'pointer'
  };

  return (
    <div style={{ padding: 20, color: '#e5e7eb' }}>
      <h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 800, margin: '8px 0 18px 0' }}>Gerenciamento Completo</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, borderBottom: '1px solid #373E47', paddingBottom: 8 }}>
        <button
          onClick={() => setTabAtiva('aluno')}
          style={{
            padding: '8px 16px',
            fontWeight: 600,
            color: tabAtiva === 'aluno' ? '#60A5FA' : '#9CA3AF',
            borderBottom: tabAtiva === 'aluno' ? '2px solid #3B82F6' : '2px solid transparent',
            background: 'transparent',
            border: 'none',
            borderBottomStyle: 'solid',
            cursor: 'pointer'
          }}
        >
          🧑‍🎓 Alunos ({alunos.length})
        </button>
        <button
          onClick={() => setTabAtiva('professores')}
          style={{
            padding: '8px 16px',
            fontWeight: 600,
            color: tabAtiva === 'professores' ? '#60A5FA' : '#9CA3AF',
            borderBottom: tabAtiva === 'professores' ? '2px solid #3B82F6' : '2px solid transparent',
            background: 'transparent',
            border: 'none',
            borderBottomStyle: 'solid',
            cursor: 'pointer'
          }}
        >
          👨‍🏫 Professores ({professores.length})
        </button>
        <button
          onClick={() => setTabAtiva('cursos')}
          style={{
            padding: '8px 16px',
            fontWeight: 600,
            color: tabAtiva === 'cursos' ? '#60A5FA' : '#9CA3AF',
            borderBottom: tabAtiva === 'cursos' ? '2px solid #3B82F6' : '2px solid transparent',
            background: 'transparent',
            border: 'none',
            borderBottomStyle: 'solid',
            cursor: 'pointer'
          }}
        >
          🎓 Cursos ({cursos.length})
        </button>
      </div>

      {/* Busca */}
      <div style={{ marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Buscar..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            flex: 1,
            minWidth: 200,
            maxWidth: 400,
            ...inputStyle
          }}
        />
        {tabAtiva === 'cursos' && (
          <select
            value={filtroNivel}
            onChange={(e) => setFiltroNivel(e.target.value)}
            style={inputStyle}
          >
            <option value="todos">Todos os níveis</option>
            <option value="Básico">Básico</option>
            <option value="Intermediário">Intermediário</option>
            <option value="Avançado">Avançado</option>
          </select>
        )}
      </div>

      {/* --- ABA ALUNOS --- */}
      {tabAtiva === 'aluno' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Formulário de Aluno */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
              {editandoAluno ? '✏️ Editar Aluno' : '➕ Adicionar Aluno'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
              <input
                type="text"
                placeholder="Nome"
                value={novoAluno.nomealuno}
                onChange={(e) => setNovoAluno({ ...novoAluno, nomealuno: e.target.value })}
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Email"
                value={novoAluno.emailaluno}
                onChange={(e) => setNovoAluno({ ...novoAluno, emailaluno: e.target.value })}
                style={{ ...inputStyle, opacity: editandoAluno ? 0.5 : 1 }}
                disabled={!!editandoAluno}
              />
              <input
                type="password"
                placeholder={editandoAluno ? 'Nova Senha (opcional)' : 'Senha'}
                value={novoAluno.senhaaluno}
                onChange={(e) => setNovoAluno({ ...novoAluno, senhaaluno: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button
                onClick={editandoAluno ? salvarEdicaoAluno : criarAluno}
                style={buttonStyle}
              >
                {editandoAluno ? '💾 Salvar' : '➕ Adicionar'}
              </button>
              {editandoAluno && (
                <button
                  onClick={() => {
                    setEditandoAluno(null);
                    setNovoAluno({ nomealuno: '', emailaluno: '', senhaaluno: '' });
                  }}
                  style={buttonStyle}
                >
                  ❌ Cancelar
                </button>
              )}
            </div>
          </div>

          {/* Lista de Alunos */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>📋 Lista de Alunos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {alunosFiltrados.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#9ca3af', padding: '32px 0' }}>Nenhum aluno encontrado</p>
              ) : (
                alunosFiltrados.map((a) => (
                  <div key={a.alunoId} style={{ ...cardStyle, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 16 }}>{a.nomealuno}</p>
                      <p style={{ fontSize: 14, color: '#9ca3af' }}>{a.emailaluno}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => editarAluno(a)} style={buttonStyle}>✏️ Editar</button>
                      <button onClick={() => deletarAluno(a.alunoId)} style={{ ...buttonStyle, background: '#dc2626' }}>🗑️ Excluir</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab de Professores */}
      {tabAtiva === 'professores' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Formulário */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
              {editandoProfessor ? '✏️ Editar Professor' : '➕ Adicionar Professor'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
              <input
                type="text"
                placeholder="Nome"
                value={novoProfessor.nomeprofessor}
                onChange={(e) => setNovoProfessor({ ...novoProfessor, nomeprofessor: e.target.value })}
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Email"
                value={novoProfessor.emailprofessor}
                onChange={(e) => setNovoProfessor({ ...novoProfessor, emailprofessor: e.target.value })}
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Senha"
                value={novoProfessor.senhaprofessor}
                onChange={(e) => setNovoProfessor({ ...novoProfessor, senhaprofessor: e.target.value })}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button
                onClick={editandoProfessor ? salvarEdicaoProfessor : criarProfessor}
                style={buttonStyle}
              >
                {editandoProfessor ? '💾 Salvar' : '➕ Adicionar'}
              </button>
              {editandoProfessor && (
                <button
                  onClick={() => {
                    setEditandoProfessor(null);
                    setNovoProfessor({ nomeprofessor: '', emailprofessor: '', senhaprofessor: '' });
                  }}
                  style={buttonStyle}
                >
                  ❌ Cancelar
                </button>
              )}
            </div>
          </div>

          {/* Lista */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>📋 Lista de Professores</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {professoresFiltrados.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#9ca3af', padding: '32px 0' }}>Nenhum professor encontrado</p>
              ) : (
                professoresFiltrados.map((p) => (
                  <div key={p.professorId} style={{ ...cardStyle, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 16 }}>{p.nomeprofessor}</p>
                      <p style={{ fontSize: 14, color: '#9ca3af' }}>{p.emailprofessor}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => verDetalhesProfessor(p.professorId)} style={buttonStyle}>📄 Detalhes</button>
                      <button onClick={() => editarProfessor(p)} style={buttonStyle}>✏️ Editar</button>
                      <button onClick={() => deletarProfessor(p.professorId)} style={{ ...buttonStyle, background: '#dc2626' }}>🗑️ Excluir</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab de Cursos */}
      {tabAtiva === 'cursos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Formulário */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
              {editandoCurso ? '✏️ Editar Curso' : '➕ Adicionar Curso'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Nome do Curso"
                value={novoCurso.nomecurso}
                onChange={(e) => setNovoCurso({ ...novoCurso, nomecurso: e.target.value })}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="Duração (ex: 40h)"
                value={novoCurso.duracao_curso}
                onChange={(e) => setNovoCurso({ ...novoCurso, duracao_curso: e.target.value })}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              />
              <select
                value={novoCurso.nivel_curso}
                onChange={(e) => setNovoCurso({ ...novoCurso, nivel_curso: e.target.value })}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              >
                <option value="Básico">Básico</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
              <select
                value={novoCurso.professorId}
                onChange={(e) => setNovoCurso({ ...novoCurso, professorId: e.target.value })}
                style={inputStyle}
              >
                <option value="">Selecionar Professor</option>
                {professores.map((p) => (
                  <option key={p.professorId} value={p.professorId}>
                    {p.nomeprofessor}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button
                onClick={editandoCurso ? salvarEdicaoCurso : criarCurso}
                style={buttonStyle}
              >
                {editandoCurso ? '💾 Salvar' : '➕ Adicionar'}
              </button>
              {editandoCurso && (
                <button
                  onClick={() => {
                    setEditandoCurso(null);
                    setNovoCurso({ nomecurso: '', duracao_curso: '', nivel_curso: 'Básico' });
                  }}
                  style={buttonStyle}
                >
                  ❌ Cancelar
                </button>
              )}
            </div>
          </div>

          {/* Lista de Cursos em Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24 }}>
            {cursosFiltrados.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '32px 0', ...cardStyle }}>
                <p style={{ color: '#9ca3af' }}>Nenhum curso encontrado</p>
              </div>
            ) : (
              cursosFiltrados.map((c) => (
                <div key={c.cursoId} className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-white">{c.nomecurso}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      c.nivel_curso === 'Básico' ? 'bg-green-600 text-white' :
                      c.nivel_curso === 'Intermediário' ? 'bg-yellow-500 text-white' :
                      'bg-red-600 text-white'
                    }`}>
                      {c.nivel_curso}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">Duração:</span> {c.duracao_curso}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                    <button onClick={() => verDetalhesCurso(c.cursoId)} style={{ ...buttonStyle, flex: 1 }}>📄 Detalhes</button>
                    <button onClick={() => editarCurso(c)} style={buttonStyle}>✏️</button>
                    <button onClick={() => deletarCurso(c.cursoId)} style={{ ...buttonStyle, background: '#dc2626' }}>🗑️</button>
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
