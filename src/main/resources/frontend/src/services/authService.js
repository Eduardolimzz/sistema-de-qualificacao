import api from "./api";

// ============================================
// 1. CONSTANTES
// ============================================
// MOTIVO: Evitar erros de digitação (typos)
// FONTE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const
// PESQUISE: "javascript constants best practices"

const STORAGE_KEYS = {
  TOKEN: "authToken",
  USER_NAME: "userName",
  USER_TYPE: "userType",      // ⚠️ MUDEI de "userTipo" para padronizar em inglês
  ALUNO_ID: "alunoId",
  PROFESSOR_ID: "professorId",
};

const USER_TYPES = {
  ALUNO: "aluno",
  PROFESSOR: "professor",
};

// ============================================
// 2. CLASSE DE AUTENTICAÇÃO
// ============================================
// MOTIVO: Organizar todos os métodos relacionados à autenticação
// FONTE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
// PESQUISE: "javascript class vs object literal"

class AuthService {

  /**
   * Realiza login do usuário
   * @param {Object} credentials - Objeto com { email, senha }
   * @returns {Promise<Object>} - Dados do usuário autenticado
   */
  async login(credentials) {
    try {
      // Faz requisição POST para /v1/auth/login (com /v1)
      const response = await api.post("/auth/login", credentials);
      const data = response.data;

      // Valida se o servidor retornou um token
      if (!data.token && !data.jwt) {
        throw new Error("Token não retornado pelo servidor");
      }

      // Chama método privado para salvar dados
      // O underscore (_) indica que é um método interno/privado
      this._saveUserData(data);

      return data;

    } catch (error) {
      // Trata erro 401 (credenciais inválidas)
      if (error.response?.status === 401) {
        throw new Error("Email ou senha inválidos");
      }

      // Re-lança outros erros
      throw error;
    }
  }

  /**
   * Desloga o usuário (limpa localStorage)
   */
  logout() {
    // Percorre todas as chaves e remove do localStorage
    // PESQUISE: "javascript Object.values"
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  /**
   * Verifica se usuário está autenticado
   * @returns {boolean} - true se tiver token, false se não
   */
  isAuthenticated() {
    // !! converte para boolean
    // PESQUISE: "javascript double exclamation operator"
    return !!this.getToken();
  }

  /**
   * Obtém token de autenticação do localStorage
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  /**
   * Obtém nome do usuário do localStorage
   * @returns {string|null}
   */
  getUserName() {
    return localStorage.getItem(STORAGE_KEYS.USER_NAME);
  }

  /**
   * Obtém tipo do usuário (aluno ou professor)
   * @returns {string|null}
   */
  getUserType() {
    return localStorage.getItem(STORAGE_KEYS.USER_TYPE);
  }

  /**
   * Verifica se usuário logado é um aluno
   * @returns {boolean}
   */
  isAluno() {
    return this.getUserType() === USER_TYPES.ALUNO;
  }

  /**
   * Verifica se usuário logado é um professor
   * @returns {boolean}
   */
  isProfessor() {
    return this.getUserType() === USER_TYPES.PROFESSOR;
  }

  /**
   * Obtém ID do aluno logado
   * @returns {string|null}
   */
  getAlunoId() {
    return localStorage.getItem(STORAGE_KEYS.ALUNO_ID);
  }

  /**
   * Obtém ID do professor logado
   * @returns {string|null}
   */
  getProfessorId() {
    return localStorage.getItem(STORAGE_KEYS.PROFESSOR_ID);
  }

  /**
   * Obtém ID do usuário atual (independente do tipo)
   * @returns {string|null}
   */
  getUserId() {
    // Se for aluno, retorna ID do aluno, senão retorna ID do professor
    return this.isAluno() ? this.getAlunoId() : this.getProfessorId();
  }

  // ============================================
  // 3. MÉTODO PRIVADO
  // ============================================
  // MOTIVO: Este método só deve ser usado internamente pela classe
  // O underscore (_) é uma convenção para indicar que é privado
  // PESQUISE: "javascript private methods convention"

  /**
   * Salva dados do usuário no localStorage
   * @param {Object} data - Dados retornados pela API após login
   * @private
   */
  _saveUserData(data) {
    // Pega o token (aceita tanto "token" quanto "jwt")
    const token = data.token || data.jwt;

    // Pega o tipo de usuário (aceita tanto "tipo" quanto "role")
    const userType = data.tipo || data.role;

    // Salva dados básicos
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER_NAME, data.nome);
    localStorage.setItem(STORAGE_KEYS.USER_TYPE, userType);

    // Converte UUID para string se necessário
    const userId = data.userId ? data.userId.toString() : null;

    // Salva ID específico baseado no tipo de usuário
    if (userType === USER_TYPES.ALUNO) {
      localStorage.setItem(STORAGE_KEYS.ALUNO_ID, userId);
    } else if (userType === USER_TYPES.PROFESSOR) {
      localStorage.setItem(STORAGE_KEYS.PROFESSOR_ID, userId);
    }
  }
}

// ============================================
// 4. EXPORTAÇÃO (SINGLETON PATTERN)
// ============================================
// MOTIVO: Criar apenas UMA instância do serviço
// Sempre que importar authService, será a mesma instância
// FONTE: https://www.patterns.dev/vanilla/singleton-pattern
// PESQUISE: "singleton pattern javascript"

export default new AuthService();