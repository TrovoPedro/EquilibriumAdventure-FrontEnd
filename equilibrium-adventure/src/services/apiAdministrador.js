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
    
    if (descricaoGuia !== null && descricaoGuia !== undefined) {
      formData.append('descricao_guia', descricaoGuia);
    }
    
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

export const deletarGuia = async (id) => {
  try {
    const numericId = Number(id);
    console.log("🔢 ID para deletar:", numericId, "Tipo:", typeof numericId);
    
    const response = await api.delete(`/administrador/deletar-guia/${numericId}`);
    
    console.log("🌐 Response completo:", response);
    console.log("📈 Status:", response.status);
    
    return response;
  } catch (error) {
    console.error("🚨 Erro na API deletarGuia:", error);
    
    if (error.response?.status === 404) {
      throw new Error('Guia não encontrado');
    } else if (error.response?.status === 403) {
      throw new Error('Não autorizado a deletar este guia');
    } else {
      throw error.response?.data || error.message;
    }
  }
};
