import api from './api';

const ALUNOS_BASE_PATH = '/alunos';

const AlunoService = {

    criarAluno: async (novoAluno) => {
        const response = await api.post(ALUNOS_BASE_PATH, novoAluno);
        return response.data;
    },

    carregarAlunos: async () => {
        const response = await api.get(ALUNOS_BASE_PATH);
        return response.data;
    },

    deletarAluno: async (id) => {
        await api.delete(`${ALUNOS_BASE_PATH}/${id}`);
    },

    atualizarAluno: async (id, novosDados) => {
        const response = await api.put(`${ALUNOS_BASE_PATH}/${id}`, novosDados);
        return response.data;
    }
};

export default AlunoService;