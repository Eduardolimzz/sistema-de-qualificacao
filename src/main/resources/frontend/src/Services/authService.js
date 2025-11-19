import api from "./api";

const authService = {

  login: async (credenciais) => {
    try {
      // 🔥 MUDANÇA: agora chama /auth/login ao invés de /alunos/login
      const response = await api.post("/auth/login", credenciais);

      const token = response.data.token || response.data.jwt;
      const nome = response.data.nome;
      const role = response.data.role; // 'aluno' ou 'professor'

      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userName", nome);
        localStorage.setItem("userRole", role);
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
    localStorage.removeItem("userRole");
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

  getUserRole: () => {
    return localStorage.getItem("userRole");
  }
};

export default authService;