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
    const response = await api.get(`guia/ativos/guia/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return []; // Retorna array vazio quando não há eventos ativos
    }
    console.error('Erro ao buscar eventos ativos:', error);
    throw error;
  }
};

export const buscarImagemEvento = async (id) => {
  try {
    const response = await api.get(`/guia/${id}/imagem`, { responseType: 'blob' });
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("Erro ao buscar imagem do evento:", error);
    return null;
  }
};

export const buscarImagemEventoBlob = async (id) => {
  try {
    const response = await api.get(`/guia/${id}/imagem`, { responseType: 'blob' });
    return response.data; // Blob or null
  } catch (error) {
    console.error("Erro ao buscar imagem do evento (blob):", error);
    return null;
  }
};

export const buscarEventoPorId = async (id) => {
  try {
    const response = await api.get(`/guia/buscar-evento-especifico/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    throw error;
  }
};

export const buscarEventoAtivoPorId = async (id) => {
  try {
    const response = await api.get(`/guia/buscar-evento-ativo-especifico/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    throw error;
  }
};
export const buscarGpx = async (idAtivacao) => {
  try {
    const response = await api.get(`/ativacao/${idAtivacao}/gpx`, {
      responseType: "arraybuffer",
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar GPX do evento:", error);
    throw error;
  }
};