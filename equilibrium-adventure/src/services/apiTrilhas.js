import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080" // ou sua URL real
});

export const buscarGuias = async () => {
  try {
    const response = await api.get("/usuarios/guias");
    return response.data;
  } catch (error) {
  
    throw error.response?.data || error.message;
  }
};
