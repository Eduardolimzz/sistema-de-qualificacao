import api from './api';


const BASE_PATH = '/alunos';

const AlunoService = {

  /**
   * Cria um novo aluno
   */
  criarAluno: async (alunoData) => {
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

    //  Registra um novo usuário
      cadastrar: async (dadosDoUsuario) => {
          try {
            const response = await api.post(`/v1/alunos`, dadosDoUsuario);
          return response.data;
        } catch (error) {
          console.error("Erro ao cadastrar:", error);
          throw error;
        }
      },

    carregarAlunos: async () => {
        const response = await api.get(ALUNOS_BASE_PATH);
        return response.data;
    },

  /**
   * Deleta um aluno
   */
  deletarAluno: async (id) => {
    try {
      // Resultado: DELETE http://localhost:8080/v1/alunos/ID_DO_ALUNO
      await api.delete(`${BASE_PATH}/${id}`);
    } catch (error) {
      console.error("Erro ao deletar aluno:", error);
      throw error;
    }
  },

  /**
   PUT /v1/alunos/{id}
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