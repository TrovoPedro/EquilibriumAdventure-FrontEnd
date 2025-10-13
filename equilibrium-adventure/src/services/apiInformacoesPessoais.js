import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080"
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('Response interceptor error:', {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Cadastrar/atualizar informações pessoais com imagem
export const cadastrarInformacoesPessoais = async (id, dadosUsuario, imagemUsuario = null) => {
  try {
    console.log("Cadastrando informacoes pessoais - ID:", id);
    console.log("Dados do usuario:", dadosUsuario);
    
    const formData = new FormData();
    formData.append("usuario", JSON.stringify(dadosUsuario));
    
    if (imagemUsuario) {
      console.log("Imagem anexada:", imagemUsuario.name || 'sem nome');
      formData.append("imagem", imagemUsuario);
    }

    console.log("POST /informacoes-pessoais/cadastrar/", id);
    const response = await api.post(`/informacoes-pessoais/cadastrar/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Resposta recebida com sucesso:", response.data);
    return response.data;
  } catch (error) {
    console.error("ERRO - cadastrarInformacoesPessoais:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    
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

// Atualizar apenas a imagem do usuário
export const atualizarImagemUsuario = async (usuarioId, imagemUsuario) => {
  try {
    console.log("PATCH /usuarios/", usuarioId, "/imagem");
    
    const formData = new FormData();
    formData.append("imagem", imagemUsuario);

    const response = await api.patch(`/usuarios/${usuarioId}/imagem`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Imagem atualizada com sucesso:", response.data);
    return response.data;
  } catch (error) {
    console.error("ERRO - atualizarImagemUsuario:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    
    throw error;
  }
};

// Buscar imagem do usuário
export const buscarImagemUsuario = async (usuarioId) => {
  try {
    console.log("GET /usuarios/", usuarioId, "/imagem");
    
    const response = await api.get(`/usuarios/${usuarioId}/imagem`, {
      responseType: 'blob'
    });

    console.log("Imagem do usuário recebida");
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("ERRO - buscarImagemUsuario:", {
      message: error.message,
      status: error.response?.status
    });
    
    // Se for 404, significa que não há imagem
    if (error.response?.status === 404) {
      return null;
    }
    
    throw error;
  }
};


export default api;