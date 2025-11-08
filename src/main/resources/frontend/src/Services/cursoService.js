import api from './api';

const BASE_PATH = '/curso';

const CursoService = {

  /**
   * Cria um novo curso
   */
  criarCurso: async (cursoData) => {

   if (!cursoData.professorId) {
      throw new Error("Você precisa selecionar um professor para criar o curso");
    }

    const createCursoDto = {
      nomecurso: cursoData.nomecurso,
      duracao_curso: cursoData.duracao_curso,
      nivel_curso: cursoData.nivel_curso,
      professorId: cursoData.professorId,
    };

    try {
      const response = await api.post(BASE_PATH, createCursoDto);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar curso:", error);
      throw error;
    }
  },

  /**
   * Busca todos os cursos
   */
  carregarCursos: async () => {
    try {
      const response = await api.get(BASE_PATH);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
      throw error;
    }
  },

  /**
   * Busca um curso por ID
   */
  carregarCursoPorId: async (id) => {
    try {
      const response = await api.get(`${BASE_PATH}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar curso por ID:", error);
      throw error;
    }
  },

  /**
   * Deleta um curso
   */
  deletarCurso: async (id) => {
    try {
      await api.delete(`${BASE_PATH}/${id}`);
    } catch (error) {
      console.error("Erro ao deletar curso:", error);
      throw error;
    }
  },

  /**
   * Atualiza um curso
   */
  atualizarCurso: async (id, cursoData) => {
    const updateCursoDto = {
      nomecurso: cursoData.nomecurso,
      duracao_curso: cursoData.duracao_curso,
      nivel_curso: cursoData.nivel_curso,
      // professorId NÃO é enviado no UpdateCursoDto
    };

    try {
      const response = await api.put(`${BASE_PATH}/${id}`, updateCursoDto);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar curso:", error);
      throw error;
    }
  }
};

export default CursoService;