import axios from "axios";

const BASE_URL_AGENDAS = "http://localhost:8080/agendas";

export async function buscarDatasDisponiveis() {
  try {
    const response = await axios.get(`${BASE_URL_AGENDAS}/disponiveis`);
    return response.data;
  } catch (err) {
    console.error("Erro ao buscar datas disponíveis:", err.response?.data || err.message);
    throw err;
  }
}

export async function adicionarDisponibilidade({ fkGuia, dataDisponivel }) {
  try {
    const response = await axios.post(`${BASE_URL_AGENDAS}`, {
      fkGuia,
      dataDisponivel,
    });
    return response.data;
  } catch (err) {
    console.error(
      "Erro ao adicionar disponibilidade:",
      err.response?.data || err.message
    );
    throw err;
  }
}

export async function listarAgenda() {
  try {
    const response = await axios.get(`${BASE_URL_AGENDAS}`);
    return response.data;
  } catch (err) {
    console.error("Erro ao listar agenda:", err.response?.data || err.message);
    throw err;
  }
}
