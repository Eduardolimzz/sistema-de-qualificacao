import api from "./api";

const PROFESSOR_BASE_PATH = "/professores";

const ProfessorService = {
  criarProfessor: async (novoProfessor) => {
    const response = await api.post(PROFESSOR_BASE_PATH, novoProfessor);
    return response.data; // deve retornar o UUID criado
  },


  listarProfessores: async () => {
    const response = await api.get(PROFESSOR_BASE_PATH);
    return response.data;
  },


  buscarPorId: async (id) => {
    const response = await api.get(`${PROFESSOR_BASE_PATH}/${id}`);
    return response.data;
  },


  atualizarProfessor: async (id, novosDados) => {
    const response = await api.put(`${PROFESSOR_BASE_PATH}/${id}`, novosDados);
    return response.data;
  },


  deletarProfessor: async (id) => {
    await api.delete(`${PROFESSOR_BASE_PATH}/${id}`);
  },
};

export default ProfessorService;
