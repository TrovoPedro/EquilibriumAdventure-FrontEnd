import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

export const verificarInscricao = async (idAventureiro, idAtivacaoEvento) => {
  try {
    const response = await api.post(`inscricoes/verificar`, {
      idAventureiro,
      idAtivacaoEvento
    });
    return response.data; // { jaInscrito: true/false }
  } catch (error) {
    console.error("Erro ao verificar inscrição:", error);
    throw error;
  }
};

export const criarInscricao = async (eventoId, usuarioId) => {
  const response = await api.post(`/inscricoes/ativacaoEvento/${eventoId}/usuario/${usuarioId}`);
  return response.data;
};