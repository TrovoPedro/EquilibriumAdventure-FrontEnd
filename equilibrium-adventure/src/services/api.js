import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080' // ajuste conforme sua URL base
});

export const cadastrarUsuario = async (userData) => {
    try {
        const response = await api.post('/usuarios/cadastrar', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
export const getUsuario = async (id) => {
  try {
    const response = await axios.get(`/usuarios/buscar/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Erro ao buscar usuário";
  }
};