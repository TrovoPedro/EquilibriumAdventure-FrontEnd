import axios from "axios";

// cria uma instância com a URL base
const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const getPerguntas = async () => {
  try {
    const response = await api.get('/perguntas');
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

export const postRespostas = async (respostas) => {
  try {
    const response = await api.post('/respostas', respostas);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar respostas:', error);
    throw error;
  }
};

export const calcularNivel = async (usuarioId) => {
  try {
    const response = await api.post(`/respostas/calcular-nivel/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao calcular nível:', error);
    throw error;
  }
};
