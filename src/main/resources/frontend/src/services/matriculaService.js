import api from './api';

// ============================================
// SERVIÇO DE MATRÍCULA DE ALUNOS
// ============================================
// MOTIVO: Alunos se matriculam em cursos
// ENDPOINT BASE: /api/matriculas
// PESQUISE: "composite primary key rest api"

const MatriculaAlunoService = {

  /**
   * Matricular aluno em um curso
   * @param {Object} data - { alunoId, cursoId }
   */
  matricular: async (data) => {
    try {
      // POST /api/matriculas
      const response = await api.post('/matriculas', {
        alunoId: data.alunoId,
        cursoId: data.cursoId,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao matricular aluno:', error);
      throw error;
    }
  },

  /**
   * Buscar matrícula específica
   * @param {string} alunoId
   * @param {string} cursoId
   */
  buscarMatricula: async (alunoId, cursoId) => {
    try {
      // GET /api/matriculas/aluno/{alunoId}/curso/{cursoId}
      // PESQUISE: "javascript template literals backticks"
      const response = await api.get(`/matriculas/aluno/${alunoId}/curso/${cursoId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar matrícula:', error);
      throw error;
    }
  },

  /**
   * Listar todas as matrículas
   */
  listarTodas: async () => {
    try {
      const response = await api.get('/matriculas');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar matrículas:', error);
      throw error;
    }
  },

  /**
   * Listar cursos de um aluno específico
   * @param {string} alunoId
   */
  listarCursosDoAluno: async (alunoId) => {
    try {
      // GET /api/matriculas/aluno/{alunoId}
      const response = await api.get(`/matriculas/aluno/${alunoId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar cursos do aluno:', error);
      throw error;
    }
  },

  /**
   * Listar alunos de um curso específico
   * @param {string} cursoId
   */
  listarAlunosDoCurso: async (cursoId) => {
    try {
      // GET /api/matriculas/curso/{cursoId}
      const response = await api.get(`/matriculas/curso/${cursoId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar alunos do curso:', error);
      throw error;
    }
  },

  /**
   * Listar matrículas por status
   * @param {string} status - ex: "ativa", "concluida", "cancelada"
   */
  listarPorStatus: async (status) => {
    try {
      const response = await api.get(`/matriculas/status/${status}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar matrículas por status:', error);
      throw error;
    }
  },

  /**
   * Atualizar status da matrícula
   * @param {string} alunoId
   * @param {string} cursoId
   * @param {Object} data - Dados para atualizar
   */
  atualizar: async (alunoId, cursoId, data) => {
    try {
      // PUT /api/matriculas/aluno/{alunoId}/curso/{cursoId}
      const response = await api.put(
        `/matriculas/aluno/${alunoId}/curso/${cursoId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar matrícula:', error);
      throw error;
    }
  },

  /**
   * Cancelar/Deletar matrícula
   * @param {string} alunoId
   * @param {string} cursoId
   */
  cancelar: async (alunoId, cursoId) => {
    try {
      // DELETE /api/matriculas/aluno/{alunoId}/curso/{cursoId}
      await api.delete(`/matriculas/aluno/${alunoId}/curso/${cursoId}`);
    } catch (error) {
      console.error('Erro ao cancelar matrícula:', error);
      throw error;
    }
  },
};

// ============================================
// SERVIÇO DE MATRÍCULA DE PROFESSORES
// ============================================
// MOTIVO: Professores também se matriculam/associam a cursos
// ENDPOINT BASE: /api/matriculasProfessor

const MatriculaProfessorService = {

  /**
   * Associar professor a um curso
   */
  matricular: async (data) => {
    try {
      const response = await api.post('/matriculasProfessor', {
        professorId: data.professorId,
        cursoId: data.cursoId,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao matricular professor:', error);
      throw error;
    }
  },

  /**
   * Buscar matrícula específica do professor
   */
  buscarMatricula: async (professorId, cursoId) => {
    try {
      const response = await api.get(
        `/matriculasProfessor/professor/${professorId}/curso/${cursoId}`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar matrícula do professor:', error);
      throw error;
    }
  },

  /**
   * Listar cursos de um professor
   */
  listarCursosDoProfessor: async (professorId) => {
    try {
      const response = await api.get(`/matriculasProfessor/professor/${professorId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar cursos do professor:', error);
      throw error;
    }
  },

  /**
   * Listar professores de um curso
   */
  listarProfessoresDoCurso: async (cursoId) => {
    try {
      const response = await api.get(`/matriculasProfessor/curso/${cursoId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar professores do curso:', error);
      throw error;
    }
  },

  /**
   * Atualizar matrícula do professor
   */
  atualizar: async (professorId, cursoId, data) => {
    try {
      const response = await api.put(
        `/matriculasProfessor/professor/${professorId}/curso/${cursoId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar matrícula do professor:', error);
      throw error;
    }
  },

  /**
   * Remover professor do curso
   */
  cancelar: async (professorId, cursoId) => {
    try {
      await api.delete(
        `/matriculasProfessor/professor/${professorId}/curso/${cursoId}`
      );
    } catch (error) {
      console.error('Erro ao cancelar matrícula do professor:', error);
      throw error;
    }
  },
};

// ============================================
// EXPORTAÇÃO
// ============================================
export { MatriculaAlunoService, MatriculaProfessorService };
export default MatriculaAlunoService;