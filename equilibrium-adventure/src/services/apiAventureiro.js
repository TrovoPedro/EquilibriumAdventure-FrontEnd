import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" }
});

export const getPerguntas = async () => {
  try {
    const response = await api.get('/perguntas/listar');
    const questionsFormatted = response.data.map(pergunta => ({
      id: pergunta.id,
      title: 'Questão',
      question: pergunta.textoPergunta,
      options: pergunta.alternativas.map((alt) => ({
        texto: alt.first,
        valor: alt.second
      }))
    }));
    return { data: questionsFormatted };
  } catch (error) {
    console.error('Erro ao buscar perguntas:', error);
    throw error;
  }
};

export const buscarInscricoesPorUsuario = async (usuarioId) => {
  try {
    const response = await api.get(`/inscricoes/agenda/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const buscarHistoricoPorUsuario = async (usuarioId) => {
  try {
    const response = await api.get(`/inscricoes/agenda/historico/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    return [];
  }
};

export const cancelarInscricao = async (idAventureiro, idEvento) => {
  const response = await api.delete(`/inscricoes/cancelar-inscricao/${idAventureiro}/${idEvento}`);
  return response.data;
};

export const verificarAtivacaoAvaliada = async (idAventureiro, idAtivacao) => {
  try {
    try {
      const response = await api.get(`/inscricoes/ativacao-avaliada/${idAventureiro}/${idAtivacao}`);
      console.log(`verificarAtivacaoAvaliada (inscricoes): idAventureiro=${idAventureiro}, idAtivacao=${idAtivacao}, resposta=`, response.data);
      if (response.status === 200) return response.data?.avaliada === true;
      return null;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        try {
          const response2 = await api.get(`/ativacao-avaliada/${idAventureiro}/${idAtivacao}`);
          console.log(`verificarAtivacaoAvaliada (root): idAventureiro=${idAventureiro}, idAtivacao=${idAtivacao}, resposta=`, response2.data);
          if (response2.status === 200) return response2.data?.avaliada === true;
          return null;
        } catch (err2) {
          console.error('Erro ao verificar (fallback):', err2);
          return null;
        }
      }
      console.error('Erro ao verificar avaliação da ativação (request):', err);
      return null;
    }
  } catch (error) {
    console.error('Erro ao verificar avaliação da ativação:', error);
    return false;
  }
};

export const avaliarInscricao = async (idInscricao, avaliacao) => {
  try {
    const response = await api.patch(`/inscricoes/${idInscricao}/avaliar`, null, {
      params: { avaliacao }
    });
    console.log(`avaliarInscricao: idInscricao=${idInscricao}, avaliacao=${avaliacao}, status=`, response.status);
    return response.status === 204 || response.status === 200;
  } catch (error) {
    console.error('Erro ao enviar avaliação:', error);
    throw error;
  }
};
export const postRespostas = async (respostas) => {
  try {
    const response = await api.post(
      '/respostas-aventureiro/salvar',
      respostas,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar respostas:', error);
    throw error;
  }
};

// Calcular nível
export const calcularNivel = async (usuarioId) => {
  try {
    const response = await api.post(`/respostas-aventureiro/calcular-nivel/${usuarioId}`, {});
    const data = response.data;

    if (!data) {
      throw new Error("Nível não pôde ser calculado");
    }

    // retorna todo o objeto, não apenas o nível
    return {
      nivel: data.nivel || "EXPLORADOR",
      encaminharParaAnamnese: data.encaminharParaAnamnese || false,
      pontuacaoTotal: data.pontuacaoTotal || 0,
      mensagem: data.mensagem || "",
    };
  } catch (error) {
    if (error.response?.status === 500) {
      const message = error.response.data?.message || "Erro interno do servidor";
      if (message.includes("Informações pessoais não encontradas")) {
        throw new Error("É necessário preencher suas informações pessoais antes de calcular o nível.");
      }
    }
    console.error("Erro ao calcular nível:", error);
    throw error;
  }
};
export const inicializarPerguntas = async () => {
  try {
    const response = await api.get('/perguntas/inicializar');
    return response.status;
  } catch (error) {
    console.error('Erro ao inicializar perguntas:', error);
    throw error;
  }
};
