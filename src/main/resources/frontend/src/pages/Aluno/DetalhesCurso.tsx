import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CursoService from '../../Services/cursoService';
import MatriculaAlunoService from '../../Services/matriculaService';
import authService from '../../Services/authService';
import { Clock, BookOpen, Award, ArrowLeft } from 'react-feather';

// ============================================
// COMPONENTE DE DETALHES DO CURSO
// ============================================
// MOTIVO: Mostrar informações completas e permitir matrícula
// PESQUISE: "react useParams tutorial"

function DetalhesCurso() {
  // ============================================
  // 1. HOOKS DO REACT ROUTER
  // ============================================
  // FONTE: https://reactrouter.com/en/main/hooks/use-params

  const { cursoId } = useParams(); // Pega o ID da URL
  const navigate = useNavigate();

  // ============================================
  // 2. ESTADOS
  // ============================================

  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matriculando, setMatriculando] = useState(false);
  const [jaMatriculado, setJaMatriculado] = useState(false);

  // ============================================
  // 3. CARREGAR DADOS DO CURSO
  // ============================================

  useEffect(() => {
    carregarCurso();
    verificarMatricula();
  }, [cursoId]);

  const carregarCurso = async () => {
    try {
      setLoading(true);
      const dados = await CursoService.buscarCursoPorId(cursoId);
      setCurso(dados);
    } catch (err) {
      console.error('Erro ao carregar curso:', err);
      setError('Curso não encontrado');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 4. VERIFICAR SE JÁ ESTÁ MATRICULADO
  // ============================================

  const verificarMatricula = async () => {
    try {
      const alunoId = authService.getAlunoId();
      if (!alunoId) return;

      // Tenta buscar a matrícula existente
      await MatriculaAlunoService.buscarMatricula(alunoId, cursoId);
      setJaMatriculado(true);
    } catch (err) {
      // Se der erro 404, significa que não está matriculado
      setJaMatriculado(false);
    }
  };

  // ============================================
  // 5. FUNÇÃO DE MATRICULAR
  // ============================================
  // MOTIVO: Criar registro na tabela TB_MATRICULA_ALUNO
  // PESQUISE: "javascript async await try catch"

  const handleMatricular = async () => {
    // Verifica se está autenticado
    if (!authService.isAuthenticated()) {
      alert('⚠️ Você precisa fazer login para se matricular!');
      navigate('/login');
      return;
    }

    // Verifica se é aluno
    if (!authService.isAluno()) {
      alert('⚠️ Apenas alunos podem se matricular em cursos!');
      return;
    }

    const alunoId = authService.getAlunoId();

    if (!alunoId) {
      alert('⚠️ Erro ao identificar aluno. Faça login novamente.');
      return;
    }

    setMatriculando(true);

    try {
      // Chama o service de matrícula
      await MatriculaAlunoService.matricular({
        alunoId: alunoId,
        cursoId: cursoId,
      });

      alert('✅ Matrícula realizada com sucesso!');
      setJaMatriculado(true);

      // Redireciona para "Meus Cursos"
      navigate('/aluno/meus_cursos');

    } catch (error) {
      console.error('Erro ao matricular:', error);

      const mensagem =
        error.response?.data?.message ||
        error.response?.data?.mensagem ||
        'Erro ao realizar matrícula. Tente novamente.';

      alert(`❌ ${mensagem}`);
    } finally {
      setMatriculando(false);
    }
  };

  // ============================================
  // 6. RENDERIZAÇÃO CONDICIONAL
  // ============================================

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Carregando curso...</p>
      </div>
    );
  }

  if (error || !curso) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-xl text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate('/aluno/catalogo')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ← Voltar ao Catálogo
        </button>
      </div>
    );
  }

  // ============================================
  // 7. RENDERIZAÇÃO PRINCIPAL
  // ============================================

  return (
    <div className="container mx-auto p-6 max-w-4xl">

      {/* Botão Voltar */}
      <button
        onClick={() => navigate('/aluno/catalogo')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft size={20} />
        Voltar ao Catálogo
      </button>

      {/* Card do Curso */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">

        {/* Imagem (placeholder por enquanto) */}
        <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center px-4">
            {curso.nomecurso}
          </h1>
        </div>

        {/* Conteúdo */}
        <div className="p-8">

          {/* Metadados */}
          <div className="flex flex-wrap gap-6 mb-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <span>{curso.duracao_curso}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={20} />
              <span>{curso.nivel_curso}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={20} />
              <span>Certificado incluído</span>
            </div>
          </div>

          {/* Descrição */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Sobre o curso</h2>
            <p className="text-gray-700 leading-relaxed">
              {curso.description ||
                `Este curso de ${curso.nomecurso} é ideal para quem deseja aprender
                de forma prática e objetiva. Com duração de ${curso.duracao_curso},
                você terá acesso a todo o conteúdo necessário para dominar o assunto.`
              }
            </p>
          </div>

          {/* O que você vai aprender */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">O que você vai aprender</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Conceitos fundamentais e boas práticas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Exercícios práticos e projetos reais</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Certificado de conclusão</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Acesso vitalício ao conteúdo</span>
              </li>
            </ul>
          </div>

          {/* ============================================ */}
          {/* BOTÃO DE MATRÍCULA */}
          {/* ============================================ */}

          <div className="border-t pt-6">
            {jaMatriculado ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-700 font-semibold">
                  ✅ Você já está matriculado neste curso!
                </p>
                <button
                  onClick={() => navigate('/aluno/meus_cursos')}
                  className="mt-3 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Ver Meus Cursos
                </button>
              </div>
            ) : (
              <button
                onClick={handleMatricular}
                disabled={matriculando}
                className="w-full py-4 bg-blue-600 text-white text-lg font-bold rounded-lg
                         hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                         transition-colors"
              >
                {matriculando ? 'Matriculando...' : '🎓 Matricular-se Agora'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalhesCurso;