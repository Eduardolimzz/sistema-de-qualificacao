import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CursoService from '../../Services/cursoService';
import MatriculaService from '../../Services/matriculaService';
import authService from '../../Services/authService';
import estilos from './DetalhesCurso.module.css';
import Modal from '../../componentes/Modal/Modal';

const DetalhesCurso = () => {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [error, setError] = useState(null);

  // Busca os dados do curso e verifica se já está matriculado
  useEffect(() => {
    if (!cursoId) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        // 1. Buscar dados do curso
        const cursoData = await CursoService.buscarCursoPorId(cursoId);
        setCurso(cursoData);

        // 2. Verificar se o aluno já está matriculado
        const alunoId = authService.getAlunoId();
        if (alunoId) {
          try {
            const matriculas = await MatriculaService.listarPorAluno(alunoId);
            const jaMatriculado = matriculas.some(m => m.cursoId === cursoId);
            setIsEnrolled(jaMatriculado);
          } catch (err) {
            console.log('Erro ao verificar matrícula:', err);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar curso:', err);
        setError('Não foi possível carregar os detalhes do curso.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [cursoId]);

  // Função para matricular o aluno
  const handleMatricula = async () => {
    setIsSubmitting(true);

    try {
      const alunoId = authService.getAlunoId();

      if (!alunoId) {
        alert('Você precisa estar logado para se matricular!');
        navigate('/login');
        return;
      }

      // Fazer a matrícula
      await MatriculaService.matricular(alunoId, cursoId, 'Em Andamento');

      // Atualizar estado
      setIsEnrolled(true);
      alert('Matrícula realizada com sucesso!');

      // Opcional: redirecionar para Meus Cursos
      setTimeout(() => {
        navigate('/aluno/meus_cursos');
      }, 1500);

    } catch (err) {
      console.error('Erro ao matricular:', err);

      if (err.response?.status === 400) {
        alert('Você já está matriculado neste curso!');
        setIsEnrolled(true);
      } else {
        alert('Erro ao realizar matrícula. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  };

  // --- Renderização ---

  if (isLoading) {
    return <div className={estilos.loading}>Carregando...</div>;
  }

  if (error || !curso) {
    return <div className={estilos.error}>{error || 'Curso não encontrado.'}</div>;
  }

  return (
    <div className={estilos.pageContainer}>
      <h1 className={estilos.cursoTitle}>{curso.nomecurso}</h1>
      <p className={estilos.cursoInstructor}>
        Nível: {curso.nivel_curso} | Duração: {curso.duracao_curso}h
      </p>

      <div className={estilos.cursoContent}>
        <h3>Sobre o curso</h3>
        <p>{curso.description || 'Descrição não disponível.'}</p>

        <h3>O que você vai aprender</h3>
        <p>
          Este curso aborda os principais conceitos e práticas necessários para dominar
          {curso.nomecurso}. Você terá acesso a {curso.lessons} aulas práticas e teóricas.
        </p>

        <div className={estilos.cursoDados}>
          <div className={estilos.dadoItem}>
            <strong>Aulas:</strong> {curso.lessons}
          </div>
          <div className={estilos.dadoItem}>
            <strong>Duração:</strong> {curso.duracao_curso}h
          </div>
          <div className={estilos.dadoItem}>
            <strong>Alunos:</strong> {curso.enrolled}
          </div>
          <div className={estilos.dadoItem}>
            <strong>Avaliação:</strong> ⭐ {curso.rating?.toFixed(1) || 'N/A'}
          </div>
        </div>

        {curso.tags && (
          <div className={estilos.tags}>
            {curso.tags.split(',').map((tag, index) => (
              <span key={index} className={estilos.tag}>{tag.trim()}</span>
            ))}
          </div>
        )}
      </div>

      {/* Botão de Matrícula */}
      <div className={estilos.matriculaSection}>
        {isEnrolled ? (
          <div>
            <span className={estilos.matriculadoBadge}>
              ✅ Você já está matriculado
            </span>
            <button
              className={estilos.irParaCursoButton}
              onClick={() => navigate('/aluno/meus_cursos')}
            >
              Ir para Meus Cursos
            </button>
          </div>
        ) : (
          <button
            className={estilos.matricularButton}
            onClick={() => setIsModalOpen(true)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processando...' : 'Matricular-se'}
          </button>
        )}
      </div>

      {/* Modal de Confirmação */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleMatricula}
        title="Confirmar Matrícula"
      >
        <p>
          Você tem certeza que deseja se matricular no curso
          <strong> "{curso.nomecurso}"</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default DetalhesCurso;