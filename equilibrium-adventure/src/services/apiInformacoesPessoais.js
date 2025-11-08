import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080"
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Cadastrar/atualizar informações pessoais com imagem
export const cadastrarInformacoesPessoais = async (id, dadosUsuario, imagemUsuario = null) => {
  try {
    const formData = new FormData();
    formData.append("usuario", JSON.stringify(dadosUsuario));
    
    if (imagemUsuario) {
      formData.append("imagem", imagemUsuario);
    }

    const response = await api.post(`/informacoes-pessoais/cadastrar/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Buscar informações do perfil completo (usuário + informações pessoais + endereço)
export const buscarPerfilCompleto = async (usuarioId) => {
  try {
    const response = await api.get(`/informacoes-pessoais/perfil-info/${usuarioId}`);
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
    const response = await api.get(`/informacoes-pessoais/perfil/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Editar/atualizar informações do perfil
export const editarInformacoesPerfil = async (id, novaInformacao) => {
  try {
    const response = await api.put(`/informacoes-pessoais/atualizar-perfil/${id}`, novaInformacao);
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


// Editar perfil completo (usuário + endereço + informações) em uma única chamada (JSON)
export const editarPerfilCompleto = async (usuarioId, dtoEdicao) => {
  try {
    const response = await api.put(`/informacoes-pessoais/editar-perfil-completo/${usuarioId}`, dtoEdicao, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Cadastrar perfil completo (endereço + informações) em uma única chamada (JSON)
export const cadastrarPerfilCompleto = async (usuarioId, dtoCadastro) => {
  try {
    const response = await api.post(`/informacoes-pessoais/cadastrar-perfil-completo/${usuarioId}`, dtoCadastro, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Atualizar apenas a imagem do usuário
export const atualizarImagemUsuario = async (usuarioId, imagemUsuario) => {
  try {
    const formData = new FormData();
    formData.append("imagem", imagemUsuario);

    const response = await api.patch(`/usuarios/${usuarioId}/imagem`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Buscar imagem do usuário
export const buscarImagemUsuario = async (usuarioId) => {
  try {
    const response = await api.get(`/usuarios/${usuarioId}/imagem`, {
      responseType: 'blob'
    });

    return URL.createObjectURL(response.data);
  } catch (error) {
    // Se for 404, significa que não há imagem
    if (error.response?.status === 404) {
      return null;
    }
    
    throw error;
  }
};


export default api;