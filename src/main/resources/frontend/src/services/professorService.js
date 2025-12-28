import api from './api';

// ============================================
// SERVIÇO DE PROFESSORES
// ============================================
// ENDPOINT BASE: /api/professores

const ProfessorService = {

  /**
   * Criar novo professor (MÉTODO PADRONIZADO)
   * @param {Object} professorData - { nome, email, senha }
   */
  criar: async (professorData) => {
    try {
      const createDto = {
        nomeprofessor: professorData.nome,
        emailprofessor: professorData.email,
        senhaprofessor: professorData.senha,
      };

      const response = await api.post('/professores', createDto);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar professor:', error);
      throw error;
    }
  },

  /**
   * Alias para criar (compatibilidade com CRUDAdmin)
   * @param {Object} professorData - { nomeprofessor, emailprofessor, senhaprofessor }
   */
  criarProfessor: async (professorData) => {
    try {
      const response = await api.post('/professores', professorData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar professor:', error);
      throw error;
    }
  },

  /**
   * Buscar professor por ID
   * @param {string} id
   */
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/professores/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar professor:', error);
      throw error;
    }
  },

  /**
   * Listar todos os professores
   */
  listarProfessores: async () => {
    try {
      const response = await api.get('/professores');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar professores:', error);
      throw error;
    }
  },

  /**
   * Alias para listar (compatibilidade)
   */
  listar: async () => {
    return ProfessorService.listarProfessores();
  },

  /**
   * Atualizar professor
   * @param {string} id
   * @param {Object} professorData
   */
  atualizar: async (id, professorData) => {
    try {
      // Monta o DTO exatamente como o backend espera
      const updateDto = {
        nomeprofessor: professorData.nomeprofessor || professorData.nome,
      };

      // Só inclui senha se foi fornecida e não está vazia
      const senha = professorData.senhaprofessor || professorData.senha;
      if (senha && senha.trim() !== '') {
        updateDto.senhaprofessor = senha;
      }

      console.log('Enviando para backend:', updateDto);

      const response = await api.put(`/professores/${id}`, updateDto);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar professor:', error);
      throw error;
    }
  },

  /**
   * Alias para atualizar (compatibilidade)
   */
  atualizarProfessor: async (id, professorData) => {
    return ProfessorService.atualizar(id, professorData);
  },

  /**
   * Deletar professor
   * @param {string} id
   */
  deletar: async (id) => {
    try {
      await api.delete(`/professores/${id}`);
    } catch (error) {
      console.error('Erro ao deletar professor:', error);
      throw error;
    }
  },

  /**
   * Alias para deletar (compatibilidade com CRUDAdmin)
   */
  deletarProfessor: async (id) => {
    return ProfessorService.deletar(id);
  },
};

export default ProfessorService;