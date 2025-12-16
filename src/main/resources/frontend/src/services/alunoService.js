import api from './api';

const BASE_PATH = '/alunos';

const AlunoService = {

  /**
   * Cria um novo aluno (MÉTODO PADRONIZADO)
   * @param {Object} alunoData - { nome, email, senha }
   */
  criar: async (alunoData) => {
    const createAlunoDto = {
      nomealuno: alunoData.nome,
      emailaluno: alunoData.email,
      senhaaluno: alunoData.senha,
    };
    try {
      const response = await api.post(BASE_PATH, createAlunoDto);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar aluno:", error);
      throw error;
    }
  },

  /**
   * Alias para criar (mantido para compatibilidade)
   * @deprecated Use criar() ao invés deste
   */
  criarAluno: async (alunoData) => {
    return AlunoService.criar(alunoData);
  },

  /**
   * Alias para criar (mantido para compatibilidade)
   * @deprecated Use criar() ao invés deste
   */
  cadastrar: async (dadosDoUsuario) => {
    try {
      const response = await api.post(`/alunos`, dadosDoUsuario);
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      throw error;
    }
  },

  /**
   * Lista todos os alunos
   */
  carregarAlunos: async () => {
    const response = await api.get(BASE_PATH);
    return response.data;
  },

  /**
   * Deleta um aluno
   * @param {string} id
   */
  deletarAluno: async (id) => {
    try {
      await api.delete(`${BASE_PATH}/${id}`);
    } catch (error) {
      console.error("Erro ao deletar aluno:", error);
      throw error;
    }
  },

  /**
   * Atualiza um aluno
   * @param {string} id
   * @param {Object} alunoData
   */
  atualizarAluno: async (id, alunoData) => {
    const updateAlunoDto = {
      nomealuno: alunoData.nome,
    };

    if (alunoData.senha && alunoData.senha.trim() !== '') {
      updateAlunoDto.senhaaluno = alunoData.senha;
    }

    try {
      const response = await api.put(`${BASE_PATH}/${id}`, updateAlunoDto);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      throw error;
    }
  }
};

export default AlunoService;