import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080"
});

// Cadastrar/atualizar informações pessoais com imagem
export const cadastrarInformacoesPessoais = async (id, dadosUsuario, imagemUsuario = null) => {
  try {
    console.log("Cadastrando informacoes pessoais - ID:", id);
    
    const formData = new FormData();
    formData.append("usuario", JSON.stringify(dadosUsuario));
    
    if (imagemUsuario) {
      formData.append("imagem", imagemUsuario);
    }

    console.log("POST /informacoes-pessoais/cadastrar/", id);
    const response = await api.post(`/informacoes-pessoais/cadastrar/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Resposta recebida com sucesso");
    return response.data;
  } catch (error) {
    console.error("ERRO - cadastrarInformacoesPessoais:", error.message);
    
    if (error.response) {
      console.error("Status HTTP:", error.response.status);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request data:", error.request);
    }
    
    throw error;
  }
};

// Buscar informações do perfil completo (usuário + informações pessoais + endereço)
export const buscarPerfilCompleto = async (usuarioId) => {
  try {
    console.log("GET /informacoes-pessoais/perfil-info/", usuarioId);
    const response = await api.get(`/informacoes-pessoais/perfil-info/${usuarioId}`);
    console.log("Perfil completo recebido");
    const data = response.data;
    // Tratar respostas vazias/invalidas do backend ("", null, {}, [])
    const isEmptyObject = data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0;
    if (data === "" || data == null || isEmptyObject) {
      const err = new Error("Perfil completo não encontrado ou vazio");
      err.code = "PERFIL_VAZIO";
      throw err;
    }
    return data;
  } catch (error) {
    console.error("Erro ao buscar perfil completo:", error);
    throw error.response?.data || error.message;
  }
};

// Buscar informações do perfil
export const buscarInformacoesPerfil = async (id) => {
  try {
    console.log("GET /informacoes-pessoais/perfil/", id);
    const response = await api.get(`/informacoes-pessoais/perfil/${id}`);
    console.log("Resposta recebida do endpoint /perfil");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar informacoes do perfil:", error.message);
    throw error.response?.data || error.message;
  }
};

// Editar/atualizar informações do perfil
export const editarInformacoesPerfil = async (id, novaInformacao) => {
  try {
    console.log("PUT /informacoes-pessoais/atualizar-perfil/", id);
    
    const response = await api.put(`/informacoes-pessoais/atualizar-perfil/${id}`, novaInformacao);
    
    console.log("PUT realizado com sucesso - Status:", response.status);
    
    return response.data;
  } catch (error) {
    console.error("ERRO ao editar informações do perfil:");
    console.error("Status:", error.response?.status);
    console.error("Status:", error.response?.status);
    
    // Se for 404, pode ser que o endpoint seja diferente
    if (error.response?.status === 404) {
      console.error("ENDPOINT 404 - Verificar endpoint no backend");
    }
    
    throw error.response?.data || error.message;
  }
};


// Editar perfil completo (usuário + endereço + informações) em uma única chamada (JSON)
export const editarPerfilCompleto = async (usuarioId, dtoEdicao) => {
  try {
    console.log("PUT /informacoes-pessoais/editar-perfil-completo/", usuarioId);
    const response = await api.put(`/informacoes-pessoais/editar-perfil-completo/${usuarioId}`, dtoEdicao, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log("Perfil completo editado com sucesso");
    return response.data;
  } catch (error) {
    console.error("Erro ao editar perfil completo:", error.message);
    console.error("Status:", error.response?.status);
    throw error.response?.data || error.message;
  }
};

// Cadastrar perfil completo (endereço + informações) em uma única chamada (JSON)
export const cadastrarPerfilCompleto = async (usuarioId, dtoCadastro) => {
  try {
    console.log("POST /informacoes-pessoais/cadastrar-perfil-completo/", usuarioId);
    const response = await api.post(`/informacoes-pessoais/cadastrar-perfil-completo/${usuarioId}`, dtoCadastro, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log("Perfil completo cadastrado com sucesso");
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar perfil completo:", error.message);
    console.error("Status:", error.response?.status);
    throw error.response?.data || error.message;
  }
};


export default api;