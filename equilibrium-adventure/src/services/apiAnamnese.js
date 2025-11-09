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

// Busca datas disponíveis para um responsável (guia)
export async function listarDatasDisponiveis(fkResponsavel) {
  try {
    const response = await axios.get(`${BASE_URL}/agendamentos/datas-disponiveis?fkResponsavel=${fkResponsavel}`);
    return response.data;
  } catch (err) {
    if (err.response?.status === 204) {
      return [];
    }
    console.error("Erro ao buscar datas disponíveis:", err.response?.data || err.message);
    throw err;
  }
}

// Agendar anamnese: body { fkData, fkAventureiro }
export async function agendarAnamnese(agendamento) {
  try {
    const response = await axios.post(`${BASE_URL}/agendamentos/agendar`, agendamento);
    return response.data;
  } catch (err) {
    console.error("Erro ao agendar anamnese:", err.response?.data || err.message);
    throw err;
  }
}
