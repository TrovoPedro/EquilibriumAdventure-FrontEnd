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

// buscar usuario por id
export const buscarUsuarioPorId = async (id) => {
  try {
    const response = await api.get(`/usuarios/buscar/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const buscarInformacoesPerfil = async (usuarioId) => {
  try {
    const response = await api.get(`/informacoes-pessoais/perfil-info/${usuarioId}`);
    const data = response.data;

    if (!data || Object.keys(data).length === 0) {
      console.warn("Perfil não encontrado para o usuário", usuarioId);
      return null; // ✅ retorna null em vez de lançar erro
    }

    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.warn("Perfil não encontrado (404)");
      return null; // ✅ evita quebrar o fluxo
    }
    throw error;
  }
};


export const buscarNivelPerfil = async (usuarioId) => {
  try {
    const response = await api.get(`/informacoes-pessoais/perfil-nivel/${usuarioId}`);
    return response.data; // vai retornar { nivel: "AVENTUREIRO" } ou similar
  } catch (error) {
    console.error("Erro ao buscar nível do perfil:", error);
    if (error.response?.status === 404) {
      // Perfil não encontrado
      return null;
    }
    throw error;
  }
};