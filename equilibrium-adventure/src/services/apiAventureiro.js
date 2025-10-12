import axios from "axios";

// cria uma instância com a URL base
const api = axios.create({
  baseURL: "http://localhost:8080",
});

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


export const postRespostas = async (respostas) => {
  try {
    const response = await api.post('/respostas-aventureiro/salvar', respostas);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar respostas:', error);
    throw error;
  }
};

export const calcularNivel = async (usuarioId) => {
  try {
    // Envia um objeto vazio no corpo da requisição POST
    const response = await api.post(`/respostas-aventureiro/calcular-nivel/${usuarioId}`, {});
    
    if (response.data === null) {
      throw new Error('Nível não pôde ser calculado');
    }

    // Se a resposta for um enum Nivel, será uma string
    if (typeof response.data === 'string') {
      return response.data;
    }

    // Se for um objeto contendo o nível
    if (response.data.nivel) {
      return response.data.nivel;
    }

    return 'EXPLORADOR'; // valor padrão
  } catch (error) {
    if (error.response?.status === 500) {
      const message = error.response.data?.message || 'Erro interno do servidor';
      if (message.includes('Informações pessoais não encontradas')) {
        throw new Error('É necessário preencher suas informações pessoais antes de calcular o nível.');
      }
    }
    console.error('Erro ao calcular nível:', error);
    throw error;
  }
};

export const inicializarPerguntas = async () => {
  try {
    const response = await api.get('/perguntas/inicializar');
    return response.status; // deve retornar 204 se não houver conteúdo
  } catch (error) {
    console.error('Erro ao inicializar perguntas:', error);
    throw error;
  }
};