import api from './api';

const CursoService = {
  // Listar todos os cursos do catálogo
  listarCursos: async () => {
    const response = await api.get('/cursos');
    return response.data;
  },

  // Buscar curso por ID
  buscarCursoPorId: async (id) => {
    const response = await api.get(`/cursos/${id}`);
    return response.data;
  }
};

export default CursoService;