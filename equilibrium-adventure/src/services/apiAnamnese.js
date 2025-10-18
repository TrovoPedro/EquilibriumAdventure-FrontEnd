import axios from "axios";

const BASE_URL = "http://localhost:8080";

export async function listarAnamnesesPorResponsavel(fkResponsavel) {
  try {
  const response = await axios.get(`${BASE_URL}/agendamentos/por-responsavel/${fkResponsavel}`);
    return response.data;
  } catch (err) {
    if (err.response?.status === 204) {
      return [];
    }
    console.error("Erro ao buscar anamneses:", err.response?.data || err.message);
    throw err;
  }
}
