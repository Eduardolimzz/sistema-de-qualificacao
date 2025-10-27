import api from "./api";

const AUTH_BASE_PATH = "/auth";

const authService = {

  login: async (credenciais) => {
    try {
      const response = await api.post(`${AUTH_BASE_PATH}/login`, credenciais);

      // Ajusta o nome do campo conforme o backend (ex: response.data.token)
      const token = response.data.token || response.data.jwt;

      if (token) {
        localStorage.setItem("authToken", token);
      } else {
        console.warn("⚠️ Nenhum token retornado pelo servidor!");
      }

      return response.data;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  },

  /**
   * Faz logout limpando o token armazenado
   */
  logout: () => {
    localStorage.removeItem("authToken");
  },

  /**
   * Verifica se o usuário está autenticado
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },

  /**
   * Retorna o token atual (caso precise usar diretamente)
   */
  getToken: () => {
    return localStorage.getItem("authToken");
  },
};

export default authService;
