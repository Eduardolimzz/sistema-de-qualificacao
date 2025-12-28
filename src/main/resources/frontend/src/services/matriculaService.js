import api from './api';

const MatriculaAlunoService = {

  /**
   * Matricular aluno em um curso
   * @param {Object} data - { alunoId, cursoId }
   */
  matricular: async (data) => {
    // ✅ LOG para debug
    console.log('📝 Dados sendo enviados para matrícula:', data);

    // ✅ Validação
    if (!data.alunoId || !data.cursoId) {
      throw new Error('alunoId e cursoId são obrigatórios');
    }

    try {
      const payload = {
        alunoId: data.alunoId,
        cursoId: data.cursoId,
        status: data.status || 'ATIVO' // ✅ Adicionar status padrão
      };

      console.log('📤 Payload final:', payload);

      // ✅ CORRIGIDO: Adicionar  na rota
      const response = await api.post('/matriculas', payload);

      console.log('✅ Resposta da matrícula:', response.data);

      return response.data;
    } catch (error) {
      console.error('❌ Erro ao matricular aluno:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
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
      // ✅ CORRIGIDO: Adicionar
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
      // ✅ CORRIGIDO: Adicionar
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
      // ✅ CORRIGIDO: Adicionar
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
      // ✅ CORRIGIDO: Adicionar
      const response = await api.get(`/matriculas/curso/${cursoId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar alunos do curso:', error);
      throw error;
    }
  },

  /**
   * Listar matrículas por status
   * @param {string} status - ex: "ATIVO", "CONCLUIDO", "CANCELADO"
   */
  listarPorStatus: async (status) => {
    try {
      // ✅ CORRIGIDO: Adicionar
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
      // ✅ CORRIGIDO: Adicionar
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
      // ✅ CORRIGIDO: Adicionar
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

const MatriculaProfessorService = {

  matricular: async (data) => {
    try {
      // ✅ CORRIGIDO: Adicionar
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

  buscarMatricula: async (professorId, cursoId) => {
    try {
      // ✅ CORRIGIDO: Adicionar
      const response = await api.get(
        `/matriculasProfessor/professor/${professorId}/curso/${cursoId}`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar matrícula do professor:', error);
      throw error;
    }
  },

  listarCursosDoProfessor: async (professorId) => {
    try {
      // ✅ CORRIGIDO: Adicionar
      const response = await api.get(`/matriculasProfessor/professor/${professorId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar cursos do professor:', error);
      throw error;
    }
  },

  listarProfessoresDoCurso: async (cursoId) => {
    try {
      // ✅ CORRIGIDO: Adicionar
      const response = await api.get(`/matriculasProfessor/curso/${cursoId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar professores do curso:', error);
      throw error;
    }
  },

  atualizar: async (professorId, cursoId, data) => {
    try {
      // ✅ CORRIGIDO: Adicionar
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

  cancelar: async (professorId, cursoId) => {
    try {
      // ✅ CORRIGIDO: Adicionar
      await api.delete(
        `/matriculasProfessor/professor/${professorId}/curso/${cursoId}`
      );
    } catch (error) {
      console.error('Erro ao cancelar matrícula do professor:', error);
      throw error;
    }
  },
};

export { MatriculaAlunoService, MatriculaProfessorService };
export default MatriculaAlunoService;