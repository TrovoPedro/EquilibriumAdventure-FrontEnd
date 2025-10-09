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
        console.error("Erro ao buscar dados do usuário:", error);
        throw error;
    }
};

export async function buscarImagemUsuario(idUsuario) {
  try {
    const response = await api.get(`/informacoes-pessoais/${idUsuario}/imagem`, {
      responseType: "blob",
    });

    // Converte o blob em uma URL utilizável no <img>
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("Erro ao buscar imagem do usuário:", error);
    return null;
  }
}
