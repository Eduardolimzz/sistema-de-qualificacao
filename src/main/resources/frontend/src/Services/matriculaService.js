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

  // ✅ ADICIONAR ESSAS FUNÇÕES:

  // Matricular aluno em um curso
  matricular: async (alunoId, cursoId, status = "Em Andamento") => {
    const response = await api.post(MATRICULAS_BASE_PATH, {
      alunoId,
      cursoId,
      status
    });
    return response.data;
  },

  // Buscar matrícula específica
  buscarMatricula: async (alunoId, cursoId) => {
    const response = await api.get(`${MATRICULAS_BASE_PATH}/aluno/${alunoId}/curso/${cursoId}`);
    return response.data;
  },

  // Atualizar status da matrícula
  atualizarStatus: async (alunoId, cursoId, novoStatus) => {
    const response = await api.put(`${MATRICULAS_BASE_PATH}/aluno/${alunoId}/curso/${cursoId}`, {
      status: novoStatus
    });
    return response.data;
  },

  // Cancelar matrícula (deletar)
  cancelarMatricula: async (alunoId, cursoId) => {
    const response = await api.delete(`${MATRICULAS_BASE_PATH}/aluno/${alunoId}/curso/${cursoId}`);
    return response.data;
  }
};

export default MatriculaService;