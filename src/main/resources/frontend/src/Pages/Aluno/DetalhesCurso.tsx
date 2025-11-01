import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import estilos from './DetalhesCurso.module.css';
import Modal from '../../componentes/Modal/Modal'; // <-- Importa o Modal de Confirmação

// --- Simulação de API ---

// 1. GET /api/cursos/{cursoId} -> para pegar os detalhes
// 2. GET /api/alunos/meus-cursos -> para saber se o aluno já está matriculado)
const mockCursos = {
  '1': { id: 1, title: 'Introdução ao React', instructor: 'Dr. João Silva', description: 'Domine os fundamentos do React para iniciantes...', isEnrolled: false },
  '2': { id: 2, title: 'Node.js Avançado', instructor: 'Dra. Maria Santos', description: 'Tópicos avançados de Node.js e backend.', isEnrolled: true }, // Ex: já matriculado
  '3': { id: 3, title: 'Python para Data Science', instructor: 'Prof. Carlos Lima', description: 'Análise de dados com Python...', isEnrolled: false },
  '4': { id: 4, title: 'UI/UX Design Completo', instructor: 'Ana Pereira', description: 'Design de interfaces e experiência do usuário.', isEnrolled: false },
  '5': { id: 5, title: 'Marketing Digital Avançado', instructor: 'Bruno Costa', description: 'Tópicos avançados de marketing digital.', isEnrolled: false },
  '6': { id: 6, title: 'Gestão de Projetos Ágeis', instructor: 'Carla Dias', description: 'Metodologias ágeis e gestão de projetos.', isEnrolled: true }, // Ex: já matriculado
};

// Simula um fetch dos detalhes do curso
const fetchCursoDetails = (cursoId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCursos[cursoId] || null);
    }, 500);
  });
};

// Simula o POST de matrícula
const matricularNoCurso = (alunoId: string, cursoId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Aqui você chamaria o seu matriculaService.js
      console.log(`API CALL: POST /api/alunos/${alunoId}/cursos/${cursoId}`);
      resolve({ success: true, message: 'Matrícula realizada!' });
    }, 1000);
  });
};
// --- Fim da Simulação ---


const DetalhesCurso = () => {
  const { cursoId } = useParams(); // Pega o ID da URL (ex: /aluno/catalogo/1)
  const [curso, setCurso] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading do botão

  // Busca os dados do curso quando a página carrega
  useEffect(() => {
    if (!cursoId) return;

    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchCursoDetails(cursoId);
      setCurso(data);
      setIsLoading(false);
    };
    loadData();
  }, [cursoId]);

  // Função chamada ao confirmar o modal
  const handleMatricula = async () => {
    setIsSubmitting(true);

    // O ID do aluno viria do seu contexto de autenticação
    const alunoId = '12345'; // Hardcoded por enquanto

    try {
      // Chama a API (POST /api/alunos/{id}/cursos/{cursoId})
      await matricularNoCurso(alunoId, curso.id.toString());

      // Atualiza o estado local para "Matriculado"
      setCurso({ ...curso, isEnrolled: true });
      alert('Matrícula realizada com sucesso!');

    } catch (err) {
      console.error("Falha ao matricular", err);
      alert('Erro ao realizar matrícula.');
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  };

  // --- Renderização ---

  if (isLoading) {
    return <div className={estilos.loading}>Carregando...</div>;
  }

  if (!curso) {
    return <div className={estilos.error}>Curso não encontrado.</div>;
  }

  return (
    <div className={estilos.pageContainer}>
      <h1 className={estilos.cursoTitle}>{curso.title}</h1>
      <p className={estilos.cursoInstructor}>Instrutor: {curso.instructor}</p>

      {/* Aqui viria a descrição completa, ementa, etc. */}
      <div className={estilos.cursoContent}>
        <p>{curso.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.</p>
        {/* Você pode adicionar mais seções aqui, como "O que você vai aprender", "Ementa", etc. */}
      </div>

      {/* O Botão de Matrícula Condicional */}
      <div className={estilos.matriculaSection}>
        {curso.isEnrolled ? (
          <span className={estilos.matriculadoBadge}>
            Você já está matriculado
          </span>
        ) : (
          <button
            className={estilos.matricularButton}
            onClick={() => setIsModalOpen(true)} // <-- Abre o modal
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processando...' : 'Matricular-se'}
          </button>
        )}
      </div>

      {/* O Modal de Confirmação */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleMatricula}
        title="Confirmar Matrícula"
      >
        <p>
          Você tem certeza que deseja se matricular no curso
          <strong> "{curso.title}"</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default DetalhesCurso;