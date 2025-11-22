import api from "./api";

const authService = {

  login: async (credenciais) => {
    try {
      const response = await api.post("/auth/login", credenciais);

      const token = response.data.token || response.data.jwt;
      const nome = response.data.nome;
      // ✅ ACEITAR TANTO 'tipo' QUANTO 'role' (por compatibilidade)
      const tipo = response.data.tipo || response.data.role;
      const userId = response.data.userId;

      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userName", nome);
        localStorage.setItem("userTipo", tipo);

        if (tipo === "aluno") {
          localStorage.setItem("alunoId", userId);
        } else if (tipo === "professor") {
          localStorage.setItem("professorId", userId);
        }
      } else {
        console.warn("⚠️ Nenhum token retornado pelo servidor!");
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      if (error.response && error.response.status === 401) {
        throw new Error("Credenciais inválidas. Verifique o email e a senha.");
      }
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userTipo");
    localStorage.removeItem("alunoId");
    localStorage.removeItem("professorId");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },

  getToken: () => {
    return localStorage.getItem("authToken");
  },

  getUserName: () => {
    return localStorage.getItem("userName");
  },

  getUserTipo: () => {
    return localStorage.getItem("userTipo");
  },

  getAlunoId: () => {
    return localStorage.getItem("alunoId");
  },

  getProfessorId: () => {
    return localStorage.getItem("professorId");
  }
};

export default authService;