import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080' 
});
// cadastrar usuario
  export const cadastrarUsuario = async (userData) => {
      try {
          const response = await api.post('/usuarios/cadastrar', userData);
          return response.data;
      } catch (error) {
          throw error.response?.data || error.message;
      }
  };
// login usuario
export const loginUsuario = async (credentials) => {
  try {
    const response = await api.post("/usuarios/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const buscarInformacoesPerfil = async (usuarioId) => {
  try {
    console.log("GET /informacoes-pessoais/perfil-info/", usuarioId);
    const response = await api.get(`/informacoes-pessoais/perfil-info/${usuarioId}`);
    console.log("Perfil completo recebido");
    const data = response.data;
    console.log("Dados do perfil completo:", data);

    // Verificar se a resposta é válida
    if (!data) {
      const err = new Error("Perfil completo não encontrado");
      err.code = "PERFIL_NAO_ENCONTRADO";
      throw err;
    }
    
    // Verificar se é um objeto vazio (mas não tratar como erro se tiver estrutura básica)
    const isEmptyObject = data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0;
    if (data === "" || isEmptyObject) {
      const err = new Error("Perfil completo está vazio");
      err.code = "PERFIL_VAZIO";
      throw err;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao buscar perfil completo:", error);
    // Se for erro 404, significa que o perfil não existe
    if (error.response?.status === 404) {
      const err = new Error("Perfil não encontrado");
      err.code = "PERFIL_NAO_ENCONTRADO";
      throw err;
    }
    throw error.response?.data || error;
  }
};