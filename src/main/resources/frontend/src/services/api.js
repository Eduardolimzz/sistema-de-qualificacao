import axios from "axios";

// ============================================
// 1. CONFIGURAÇÃO
// ============================================
// MOTIVO: Centralizar configurações evita "magic numbers" espalhados
// FONTE: https://axios-http.com/docs/instance

const api = axios.create({
  // Pega do .env ou usa fallback
  // import.meta.env é específico do Vite (diferente do process.env do Node)
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",

  // Timeout de 10 segundos
  timeout: 10000,

  // Headers padrão para todas as requisições
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================
// 2. REQUEST INTERCEPTOR
// ============================================
// MOTIVO: Adicionar token automaticamente em TODAS as requisições
// FONTE: https://axios-http.com/docs/interceptors
// PESQUISE: "axios request interceptor authentication"

api.interceptors.request.use(
  // Esta função é chamada ANTES de cada requisição
  (config) => {
    // Busca o token do localStorage
    const token = localStorage.getItem("authToken");

    // Se existir token, adiciona no header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // IMPORTANTE: sempre retornar config
    return config;
  },

  // Esta função é chamada se houver erro ao preparar a requisição
  (error) => {
    console.error("Erro ao preparar requisição:", error);
    return Promise.reject(error);
  }
);

// ============================================
// 3. RESPONSE INTERCEPTOR
// ============================================
// MOTIVO: Tratar erros de forma global e consistente
// FONTE: https://axios-http.com/docs/interceptors
// PESQUISE: "axios response interceptor error handling"

api.interceptors.response.use(
  // Esta função é chamada quando a resposta é bem-sucedida (status 2xx)
  (response) => {
    // Simplesmente retorna a resposta
    return response;
  },

  // Esta função é chamada quando há erro (status 4xx, 5xx)
  (error) => {
    // Verifica se é erro 401 (não autorizado)
    if (error.response?.status === 401) {
      // Remove token inválido
      localStorage.removeItem("authToken");

      // Redireciona para login
      // NOTA: Em React Router, isso seria feito de forma diferente
      window.location.href = "/login";
    }

    // Log de erro para debug
    console.error("Erro na requisição:", {
      status: error.response?.status,
      mensagem: error.response?.data?.message || error.message,
    });

    // IMPORTANTE: sempre rejeitar o erro para que o código chamador possa tratar
    return Promise.reject(error);
  }
);

// ============================================
// 4. EXPORTAÇÃO
// ============================================
export default api;