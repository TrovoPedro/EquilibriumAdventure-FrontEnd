import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Perguntas
export const getPerguntas = async () => {
  try {
    const response = await api.get('/perguntas/listar');
    const questionsFormatted = response.data.map(pergunta => ({
      id: pergunta.id,
      title: 'Questão',
      question: pergunta.textoPergunta,
      options: pergunta.alternativas.map((alt, index) => ({
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

// Inscrições do usuário
export const buscarInscricoesPorUsuario = async (usuarioId) => {
  try {
    const response = await api.get(`/inscricoes/agenda/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar inscrições:", error);
    return [];
  }
};

// Respostas
export const postRespostas = async (respostas) => {
  try {
    const response = await api.post('/respostas-aventureiro/salvar', respostas);
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

// Inicializar perguntas
export const inicializarPerguntas = async () => {
  try {
    const response = await api.get('/perguntas/inicializar');
    return response.status; // deve retornar 204 se não houver conteúdo
  } catch (error) {
    console.error('Erro ao inicializar perguntas:', error);
    throw error;
  }
};
