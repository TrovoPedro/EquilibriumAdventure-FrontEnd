import axios from "axios";
import { buscarEventosPorGuia } from "./apiEvento"; 
import { listarAnamnesesPorResponsavel} from "./apiAnamnese";

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

export const gerarRelatorioAnamnese = async ({ userId, relatorio }) => {
  try {
    // const response = await axios.patch(`${BASE_URL}/gerar-relatorio`, {
    //   fkAventureiro: userId,
    //   descricao: relatorio
    // });
    const response = await axios.patch(`http://localhost:8080/agendamentos/gerar-relatorio?fkAventureiro=${userId}&descricao=${encodeURIComponent(relatorio)}`);
    return response.data;
  } catch (err) {
    console.error("Erro ao gerar relatório de anamnese:", err);
    throw err;
  }
};

export async function buscarItensDoCalendario(idGuia) {
  try {
    const [anamneses, eventos, agenda] = await Promise.all([
      listarAnamnesesPorResponsavel(idGuia),
      buscarEventosPorGuia(idGuia),
      listarAgenda()
    ]);

    return {
      anamneses,
      eventos,
      agenda
    };
  } catch (err) {
    console.error("Erro ao carregar itens do calendário:", err);
    throw err;
  }
}
