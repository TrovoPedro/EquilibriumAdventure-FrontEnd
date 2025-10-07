import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

export const buscarEventosPorGuia = async (id) => {
  try {
    const response = await api.get(`/guia/buscar-eventos/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 204) {
      return []; // Retorna array vazio quando não há eventos
    }
    console.error('Erro ao buscar eventos:', error);
    throw error;
  }
};

export const buscarEventosAtivosPorGuia = async (id) => {
  try {
    const response = await api.get(`/guia/ativos/guia/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return []; // Retorna array vazio quando não há eventos ativos
    }
    console.error('Erro ao buscar eventos ativos:', error);
    throw error;
  }
};