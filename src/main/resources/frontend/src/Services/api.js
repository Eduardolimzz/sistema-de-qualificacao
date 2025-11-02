import axios from "axios";

const API_URL = "http://localhost:8080/v1";

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    baseURL: 'http://localhost:8080',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('authToken');
            console.error("Sessão expirada ou token inválido. Faça login novamente.");
        }
        return Promise.reject(error);
    }
);


export default api;