import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/dashboard"
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    console.log(`Dashboard API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Dashboard request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    console.log(`Dashboard API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('Dashboard response error:', {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Buscar eventos ativos/futuros
export const getEventosAtivosFuturos = async (usuarioId) => {
  try {
    const response = await api.get(`/eventos-ativos-futuros?usuarioId=${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar eventos ativos/futuros:", error);
    throw error;
  }
};

// Buscar taxa de ocupação média
export const getTaxaOcupacaoMedia = async (usuarioId) => {
  try {
    const response = await api.get(`/taxa-ocupacao-media?usuarioId=${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar taxa de ocupação média:", error);
    throw error;
  }
};

// Buscar usuários novos vs frequentes
export const getUsuariosNovosFrequentes = async (usuarioId) => {
  try {
    const response = await api.get(`/usuarios-novos-frequentes?usuarioId=${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuários novos/frequentes:", error);
    throw error;
  }
};

// Buscar top cidades
export const getTopCidades = async (usuarioId) => {
  try {
    const response = await api.get(`/top-cidades?usuarioId=${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar top cidades:", error);
    throw error;
  }
};

// Buscar ranking de eventos
export const getRankingEventos = async (usuarioId) => {
  try {
    const response = await api.get(`/ranking-eventos?usuarioId=${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar ranking de eventos:", error);
    throw error;
  }
};

// Buscar palavras dos comentários
export const getPalavrasComentarios = async (usuarioId) => {
  try {
    const response = await api.get(`/palavras-comentarios?usuarioId=${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar palavras dos comentários:", error);
    throw error;
  }
};

// Buscar tendências por ano
export const getTendenciasAno = async (usuarioId) => {
  try {
    const response = await api.get(`/tendencias-ano?usuarioId=${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar tendências por ano:", error);
    throw error;
  }
};

// Buscar tendências por mês
export const getTendenciasMes = async (usuarioId) => {
  try {
    const response = await api.get(`/tendencias-mes?usuarioId=${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar tendências por mês:", error);
    throw error;
  }
};

// Buscar tendências por dia
export const getTendenciasDia = async (usuarioId) => {
  try {
    const response = await api.get(`/tendencias-dia?usuarioId=${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar tendências por dia:", error);
    throw error;
  }
};

// Buscar inscrições vs limite
export const getInscricaoLimite = async (usuarioId) => {
  try {
    const response = await api.get(`/inscricao-limite?usuarioId=${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar inscrições vs limite:", error);
    throw error;
  }
};

export default api;