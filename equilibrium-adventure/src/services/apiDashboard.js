import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/dashboard"
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Buscar eventos ativos/futuros
export const getEventosAtivosFuturos = async (usuarioId) => {
  try {
    const response = await api.get(`/eventos-ativos-futuros?usuarioId=${usuarioId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Buscar taxa de ocupação média
export const getTaxaOcupacaoMedia = async (usuarioId) => {
  try {
    const response = await api.get(`/taxa-ocupacao-media?usuarioId=${usuarioId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Buscar usuários novos vs frequentes
export const getUsuariosNovosFrequentes = async (usuarioId) => {
  try {
    const response = await api.get(`/usuarios-novos-frequentes?usuarioId=${usuarioId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Buscar top cidades
export const getTopCidades = async (usuarioId) => {
  try {
    const response = await api.get(`/top-cidades?usuarioId=${usuarioId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Buscar ranking de eventos
export const getRankingEventos = async (usuarioId) => {
  try {
    const response = await api.get(`/ranking-eventos?usuarioId=${usuarioId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Buscar palavras dos comentários
export const getPalavrasComentarios = async (usuarioId) => {
  try {
    const response = await api.get(`/palavras-comentarios?usuarioId=${usuarioId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Buscar tendências por ano
export const getTendenciasAno = async (usuarioId) => {
  try {
    const response = await api.get(`/tendencias-ano?usuarioId=${usuarioId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Buscar tendências por mês
export const getTendenciasMes = async (usuarioId) => {
  try {
    const response = await api.get(`/tendencias-mes?usuarioId=${usuarioId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Buscar tendências por dia
export const getTendenciasDia = async (usuarioId) => {
  try {
    const response = await api.get(`/tendencias-dia?usuarioId=${usuarioId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Buscar inscrições vs limite
export const getInscricaoLimite = async (usuarioId) => {
  try {
    const response = await api.get(`/inscricao-limite?usuarioId=${usuarioId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;