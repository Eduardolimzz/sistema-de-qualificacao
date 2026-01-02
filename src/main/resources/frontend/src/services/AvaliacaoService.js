import api from './api';

const AvaliacaoService = {

  /**
   * Criar nova avaliação
   */
  criarAvaliacao: async (data) => {
    try {
      const response = await api.post('/avaliacoes', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      throw error;
    }
  },

  /**
   * Listar todas as avaliações
   */
  listarTodas: async () => {
    try {
      const response = await api.get('/avaliacoes');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar avaliações:', error);
      throw error;
    }
  },

  /**
   * Buscar avaliação por ID
   */
  buscarPorId: async (avaliacaoId) => {
    try {
      const response = await api.get(`/avaliacoes/${avaliacaoId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar avaliação:', error);
      throw error;
    }
  },

  /**
   * Listar avaliações de um curso
   */
  listarPorCurso: async (cursoId) => {
    try {
      const response = await api.get(`/avaliacoes/curso/${cursoId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar avaliações do curso:', error);
      throw error;
    }
  },

  /**
   * Atualizar avaliação
   */
  atualizar: async (avaliacaoId, data) => {
    try {
      const response = await api.put(`/avaliacoes/${avaliacaoId}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error);
      throw error;
    }
  },

  /**
   * Deletar avaliação
   */
  deletar: async (avaliacaoId) => {
    try {
      await api.delete(`/avaliacoes/${avaliacaoId}`);
    } catch (error) {
      console.error('Erro ao deletar avaliação:', error);
      throw error;
    }
  },

  /**
   * Contar avaliações de um curso
   */
  contarPorCurso: async (cursoId) => {
    try {
      const response = await api.get(`/avaliacoes/curso/${cursoId}/count`);
      return response.data;
    } catch (error) {
      console.error('Erro ao contar avaliações:', error);
      throw error;
    }
  }
};

export default AvaliacaoService;