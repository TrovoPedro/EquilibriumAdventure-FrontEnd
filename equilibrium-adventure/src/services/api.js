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