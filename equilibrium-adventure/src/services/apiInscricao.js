import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});
export const verificarInscricao = async (idAventureiro, idAtivacao) => {
  try {
    const response = await api.post(`inscricoes/verificar`, {
      idAventureiro,
      idAtivacao
    });
    return response.data; // { jaInscrito: true/false }
  } catch (error) {
    console.error("Erro ao verificar inscrição:", error);
    throw error;
  }
};

export const criarInscricao = async (idAtivacao, usuarioId) => {
  const response = await api.post(`/inscricoes/ativacaoEvento/${idAtivacao}/usuario/${usuarioId}`);
  return response.data;
};

export const cancelarInscricao = async (idAventureiro, idAtivacao) => {
  try {
    const response = await api.delete(
      `inscricoes/cancelar-inscricao/${idAventureiro}/${idAtivacao}`
    );
    return response.data; // Mensagem de sucesso do back
  } catch (error) {
    throw error.response?.data || "Erro ao cancelar inscrição";
  }
};

export const listarInscritos = async (ativacaoId) => {
  try {
    const response = await api.get(`/inscricoes/ativacao/${ativacaoId}/inscritos`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar inscritos:", error);
    throw error;
  }
}