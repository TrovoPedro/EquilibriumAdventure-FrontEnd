import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080" // ou sua URL real
});

export const buscarGuiasAdm = async () => {
  try {
    const response = await api.get("/administrador/buscar-guias");
    return response.data;
  } catch (error) {
  
    throw error.response?.data || error.message;
  }
};

export const buscarGuiaPorId = async (id) => {
  try {
    const response = await api.get(`/administrador/buscar-guia-especifico/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const atualizarGuia = async (id, descricaoGuia, imgUsuario) => {
  try {
    const formData = new FormData();
    
    // Adiciona a descrição se fornecida
    if (descricaoGuia !== null && descricaoGuia !== undefined) {
      formData.append('descricao_guia', descricaoGuia);
    }
    
    // Adiciona a imagem se fornecida
    if (imgUsuario) {
      formData.append('img_usuario', imgUsuario);
    }
    
    const response = await api.put(`/administrador/atualizar-guia/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
