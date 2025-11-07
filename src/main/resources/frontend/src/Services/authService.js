import api from "./api";

const authService = {

  login: async (credenciais) => {
    try {
      // 1. A chamada (que a gente já corrigiu) "http://localhost:8080/v1/a"
      const response = await api.post("/alunos/login", credenciais);

      // 2. Pega os dados que o backend mandou
      // (Esperando: { token: "...", role: "...", nome: "..." })
      const token = response.data.token || response.data.jwt;
      const nome = response.data.nome;
      const role = response.data.role;

      if (token) {
        // 3. Salva TUDO no localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("userName", nome); // <-- SALVANDO O NOME
        localStorage.setItem("userRole", role); // <-- SALVANDO A ROLE
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

  /**
   * Faz logout limpando o token armazenado
   */
  logout: () => {
    // 4. Limpa TUDO no logout
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
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

  /**
   * (BÔNUS) Funções para pegar o nome e a role que salvamos
   */
  getUserName: () => {
    return localStorage.getItem("userName");
  },

  getUserRole: () => {
    return localStorage.getItem("userRole");
  }
};

export default authService;