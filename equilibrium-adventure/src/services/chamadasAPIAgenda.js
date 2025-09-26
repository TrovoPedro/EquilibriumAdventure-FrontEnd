import axios from "axios";

const BASE_URL = "http://localhost:8080/agendamentos";

export async function buscarDatasDisponiveis() {
  try {
    const response = await axios.get(`${BASE_URL}/datas-disponiveis`);
    return response.data;
  } catch (err) {
    console.error("Erro ao buscar datas disponíveis:", err);
    throw err;
  }
}

export const agendarAnamnese = async ({ dataId, aventureiroId, horario }) => {
  try {
    const response = await axios.post(`${BASE_URL}/agendar`, {
      agendaResponsavel: { id: dataId },
      aventureiro: { id: aventureiroId },
      horario: horario
    });
    return response.data;
  } catch (err) {
    console.log('====================================');
    console.log("dataId:", dataId);
    console.log("aventureiroId:", aventureiroId);
    console.log("horario:", horario);
    console.log('====================================');
    console.error("Erro ao agendar:", err.response?.data || err.message);
    throw err;
  }
};

export const gerarRelatorioAnamnese = async ({ userId, relatorio }) => {
  try {
    // const response = await axios.patch(`${BASE_URL}/gerar-relatorio`, {
    //   fkAventureiro: userId,
    //   descricao: relatorio
    // });
    const response = await axios.patch(`${BASE_URL}/gerar-relatorio?fkAventureiro=${userId}&descricao=${encodeURIComponent(relatorio)}`);
    return response.data;
  } catch (err) {
    console.error("Erro ao gerar relatório de anamnese:", err);
    throw err;
  }
};
