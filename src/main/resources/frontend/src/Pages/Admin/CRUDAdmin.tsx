import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfessorService from '../../Services/professorService';
import styles from './CRUDAdmin.module.css'; 
import AlunoService from '../../Services/AlunoService'; // Corrigido de 'lunoService'

type Tab = 'aluno' | 'professores' | 'cursos';

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

// Função helper para juntar classes dinâmicas
function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ');

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
  const [novoCurso, setNovoCurso] = useState<{ nomeCurso: string; duracao: number; nivel: 'Básico' | 'Intermediário' | 'Avançado'; professorId: string }>({ nomeCurso: '', duracao: 0, nivel: 'Básico', professorId: '' });
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

  const carregarAlunos = async () => {
    try {
      const dados = await AlunoService.carregarAlunos();
      setAlunos(dados);
    } catch (e) {
      console.error('Erro ao carregar alunos:', e);
    }
  };

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

  const criarAluno = async () => {
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
      alert(`Erro: ${e.message || 'Erro ao criar aluno'}`);
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
      const matchBusca = c.nomeCurso.toLowerCase().includes(busca.toLowerCase());
      const matchNivel = filtroNivel === 'todos' || c.nivel === filtroNivel;
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


  // --- 2. O JSX  ---
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}> Gerenciamento Completo</h1>

      {/* Tabs */}
      <div className={styles.tabContainer}>
        <button
          onClick={() => setTabAtiva('aluno')}
          className={`px-6 py-3 font-semibold ${
            tabAtiva === 'aluno'
              ? 'border-b-2 border-blue-500 text-blue-400'
              : 'text-gray-400 hover:text-blue-400'
          }`}
        >
          🧑‍🎓 Alunos ({alunos.length})
        </button>
        <button
          onClick={() => setTabAtiva('professores')}
          className={classNames(
            styles.tabButton,
            tabAtiva === 'professores' && styles.tabActive
          )}
        >
          👨‍🏫 Professores ({professores.length})
        </button>
        <button
          onClick={() => setTabAtiva('cursos')}
          className={classNames(
            styles.tabButton,
            tabAtiva === 'cursos' && styles.tabActive
          )}
        >
          🎓 Cursos ({cursos.length})
        </button>
      </div>

      {/* Busca */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="🔍 Buscar..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className={styles.searchInput}
        />
        {tabAtiva === 'cursos' && (
          <select
            value={filtroNivel}
            onChange={(e) => setFiltroNivel(e.target.value)}
            className={styles.selectBox}
          >
            <option value="todos">Todos os níveis</option>
            <option value="Básico">Básico</option>
            <option value="Intermediário">Intermediário</option>
            <option value="Avançado">Avançado</option>
          </select>
        )}
      </div>

      {tabAtiva === 'aluno' && (
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">
              {editandoAluno ? '✏️ Editar Aluno' : '➕ Adicionar Aluno'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Nome"
                value={novoAluno.nomealuno}
                onChange={(e) => setNovoAluno({ ...novoAluno, nomealuno: e.target.value })}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              />
              <input
                type="email"
                placeholder="Email"
                value={novoAluno.emailaluno}
                onChange={(e) => setNovoAluno({ ...novoAluno, emailaluno: e.target.value })}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
                disabled={!!editandoAluno}
              />
              <input
                type="password"
                placeholder={editandoAluno ? 'Nova Senha (opcional)' : 'Senha'}
                value={novoAluno.senhaaluno}
                onChange={(e) => setNovoAluno({ ...novoAluno, senhaaluno: e.target.value })}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={editandoAluno ? salvarEdicaoAluno : criarAluno}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editandoAluno ? '💾 Salvar' : '➕ Adicionar'}
              </button>
              {editandoAluno && (
                <button
                  onClick={() => {
                    setEditandoAluno(null);
                    setNovoAluno({ nomealuno: '', emailaluno: '', senhaaluno: '' });
                  }}
                  className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  ❌ Cancelar
                </button>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">📋 Lista de Alunos</h2>
              <div className="space-y-2">
                {alunosFiltrados.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Nenhum aluno encontrado</p>
                ) : (
                  alunosFiltrados.map((a) => (
                    <div key={a.alunoId} className="flex justify-between items-center p-4 bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-750">
                      <div>
                        <p className="font-semibold text-lg text-white">{a.nomealuno}</p>
                        <p className="text-sm text-gray-400">{a.emailaluno}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => editarAluno(a)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">✏️ Editar</button>
                        <button onClick={() => deletarAluno(a.alunoId)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">🗑️ Excluir</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {tabAtiva === 'professores' && (
        <div className={styles.contentSection}>
          {/* Formulário */}
          <div className={styles.formCard}>
            <h2 className={styles.cardTitle}>
              {editandoProfessor ? '✏️ Editar Professor' : '➕ Adicionar Professor'}
            </h2>
            <div className={styles.formGrid3}>
              <input
                type="text"
                placeholder="Nome"
                value={novoProfessor.nomeprofessor}
                onChange={(e) => setNovoProfessor({ ...novoProfessor, nomeprofessor: e.target.value })}
                className={styles.formInput}
              />
              <input
                type="email"
                placeholder="Email"
                value={novoProfessor.emailprofessor}
                onChange={(e) => setNovoProfessor({ ...novoProfessor, emailprofessor: e.target.value })}
                className={styles.formInput}
              />
              <input
                type="password"
                placeholder={editandoProfessor ? 'Nova Senha (opcional)' : 'Senha'}
                value={novoProfessor.senhaprofessor}
                onChange={(e) => setNovoProfessor({ ...novoProfessor, senhaprofessor: e.target.value })}
                className={styles.formInput}
              />
            </div>
            <div className={styles.buttonGroup}>
              <button
                onClick={editandoProfessor ? salvarEdicaoProfessor : criarProfessor}
                className={classNames(styles.button, styles.buttonPrimary)}
              >
                {editandoProfessor ? '💾 Salvar' : '➕ Adicionar'}
              </button>
              {editandoProfessor && (
                <button
                  onClick={() => {
                    setEditandoProfessor(null);
                    setNovoProfessor({ nomeprofessor: '', emailprofessor: '', senhaprofessor: '' });
                  }}
                  className={classNames(styles.button, styles.buttonSecondary)}
                >
                  ❌ Cancelar
                </button>
              )}
            </div>
          </div>

          {/* Lista */}
          <div className={styles.listContainer}>
            <h2 className={styles.cardTitle}>📋 Lista de Professores</h2>
            <div className={styles.professorList}>
              {professoresFiltrados.length === 0 ? (
                <p className={styles.emptyMessage}>Nenhum professor encontrado</p>
              ) : (
                professoresFiltrados.map((p) => (
                  <div key={p.professorId} className={styles.professorItem}>
                    <div className={styles.itemInfo}>
                      <p className={styles.itemTitle}>{p.nomeprofessor}</p>
                      <p className={styles.itemSubtitle}>{p.emailprofessor}</p>
                    </div>
                    <div className={styles.itemActions}>
                      <button onClick={() => verDetalhesProfessor(p.professorId)} className={classNames(styles.button, styles.buttonSmall, styles.buttonSuccess)}>📄 Detalhes</button>
                      <button onClick={() => editarProfessor(p)} className={classNames(styles.button, styles.buttonSmall, styles.buttonPrimary)}>✏️ Editar</button>
                      <button onClick={() => deletarProfessor(p.professorId)} className={classNames(styles.button, styles.buttonSmall, styles.buttonDanger)}>🗑️ Excluir</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {tabAtiva === 'cursos' && (
        <div className={styles.contentSection}>
          {/* Formulário */}
          <div className={styles.formCard}>
            <h2 className={styles.cardTitle}>
              {editandoCurso ? '✏️ Editar Curso' : '➕ Adicionar Curso'}
            </h2>
            <div className={styles.formGrid4}>
              <input
                type="text"
                placeholder="Nome do Curso"
                value={novoCurso.nomeCurso}
                onChange={(e) => setNovoCurso({ ...novoCurso, nomeCurso: e.target.value })}
                className={styles.formInput}
              />
              <input
                type="number"
                placeholder="Duração (horas)"
                value={novoCurso.duracao}
                onChange={(e) => setNovoCurso({ ...novoCurso, duracao: parseInt(e.target.value) || 0 })}
                className={styles.formInput}
              />
              <select
                value={novoCurso.nivel}
                onChange={(e) => setNovoCurso({ ...novoCurso, nivel: e.target.value as 'Básico' | 'Intermediário' | 'Avançado' })}
                className={styles.formSelect}
              >
                <option value="Básico">Básico</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
              <select
                value={novoCurso.professorId}
                onChange={(e) => setNovoCurso({ ...novoCurso, professorId: e.target.value })}
                className={styles.formSelect}
              >
                <option value="">Selecionar Professor</option>
                {professores.map((p) => (
                  <option key={p.professorId} value={p.professorId}>
                    {p.nomeprofessor}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.buttonGroup}>
              <button
                onClick={editandoCurso ? salvarEdicaoCurso : criarCurso}
                className={classNames(styles.button, styles.buttonPrimary)}
              >
                {editandoCurso ? '💾 Salvar' : '➕ Adicionar'}
              </button>
              {editandoCurso && (
                <button
                  onClick={() => {
                    setEditandoCurso(null);
                    setNovoCurso({ nomeCurso: '', duracao: 0, nivel: 'Básico', professorId: '' });
                  }}
                  className={classNames(styles.button, styles.buttonSecondary)}
                >
                  ❌ Cancelar
                </button>
              )}
            </div>
          </div>

          {/* Lista de Cursos em Cards */}
          <div className={styles.courseGrid}>
            {cursosFiltrados.length === 0 ? (
              <div className={styles.emptyMessageCard}>
                <p>Nenhum curso encontrado</p>
              </div>
            ) : (
              cursosFiltrados.map((c) => (
                <div key={c.cursoId} className={styles.courseCard}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.itemTitle}>{c.nomeCurso}</h3>
                    <span className={classNames(
                      styles.badge,
                      c.nivel === 'Básico' && styles.badgeGreen,
                      c.nivel === 'Intermediário' && styles.badgeYellow,
                      c.nivel === 'Avançado' && styles.badgeRed
                    )}>
                      {c.nivel}
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    <p className={styles.cardText}>
                      <span className={styles.fontMedium}>Duração:</span> {c.duracao} horas
                    </p>
                    <p className={styles.cardText}>
                      <span className={styles.fontMedium}>Professor:</span> {getProfessorNome(c.professorId)}
                    </p>
                  </div>

                  <div className={styles.itemActions}>
                    <button onClick={() => verDetalhesCurso(c.cursoId)} className={classNames(styles.button, styles.buttonSmall, styles.buttonSuccess, styles.buttonFlex1)}>📄 Detalhes</button>
                    <button onClick={() => editarCurso(c)} className={classNames(styles.button, styles.buttonSmall, styles.buttonPrimary)}>✏️</button>
                    <button onClick={() => deletarCurso(c.cursoId)} className={classNames(styles.button, styles.buttonSmall, styles.buttonDanger)}>🗑️</button>
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