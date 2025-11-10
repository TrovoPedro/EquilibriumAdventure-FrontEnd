import axios from 'axios';

// Criar instância do axios com baseURL
const api = axios.create({
    baseURL: 'http://localhost:8080' 
});

// Buscar dados do usuário (nome, email)
export const buscarDadosUsuario = async (id) => {
    try {
        const response = await api.get(`/usuarios/buscar/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export async function buscarImagemUsuario(idUsuario) {
  try {
    const response = await api.get(`/usuarios/imagem/${idUsuario}`, {
      responseType: "blob",
    });

    // Converte o blob em uma URL utilizável no <img>
    return URL.createObjectURL(response.data);
  } catch (error) {
    return null;
  }
}
