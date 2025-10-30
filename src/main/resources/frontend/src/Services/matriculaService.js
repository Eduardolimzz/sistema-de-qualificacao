import api from './api';

const MATRICULAS_BASE_PATH = '/matriculas';

const MatriculaService = {
  listarTodas: async () => {
    const response = await api.get(MATRICULAS_BASE_PATH);
    return response.data;
  },

  listarPorCurso: async (cursoId) => {
    const response = await api.get(`${MATRICULAS_BASE_PATH}/curso/${cursoId}`);
    return response.data;
  },

  listarPorAluno: async (alunoId) => {
    const response = await api.get(`${MATRICULAS_BASE_PATH}/aluno/${alunoId}`);
    return response.data;
  },
};

export default MatriculaService;


