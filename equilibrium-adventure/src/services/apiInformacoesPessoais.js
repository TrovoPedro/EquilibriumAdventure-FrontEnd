import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080"
});

// Cadastrar/atualizar informações pessoais com imagem
export const cadastrarInformacoesPessoais = async (id, dadosUsuario, imagemUsuario = null) => {
  try {
    console.log("📤 Enviando para cadastrarInformacoesPessoais:");
    console.log("ID:", id);
    console.log("Dados do usuário:", JSON.stringify(dadosUsuario, null, 2));
    console.log("Tem imagem:", !!imagemUsuario);
    
    const formData = new FormData();
    formData.append("usuario", JSON.stringify(dadosUsuario));
    
    if (imagemUsuario) {
      formData.append("imagem", imagemUsuario);
    }

    console.log("📡 Fazendo POST para:", `/informacoes-pessoais/cadastrar/${id}`);
    const response = await api.post(`/informacoes-pessoais/cadastrar/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Resposta recebida:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ ERRO DETALHADO - cadastrarInformacoesPessoais:");
    console.error("Tipo do erro:", typeof error);
    console.error("Error.message:", error.message);
    
    if (error.response) {
      console.error("Status HTTP:", error.response.status);
      console.error("Response data:", JSON.stringify(error.response.data, null, 2));
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
    console.log("🌐 Fazendo GET para perfil completo:", `/informacoes-pessoais/perfil-info/${usuarioId}`);
    const response = await api.get(`/informacoes-pessoais/perfil-info/${usuarioId}`);
    console.log("📥 Perfil completo recebido:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar perfil completo:", error);
    throw error.response?.data || error.message;
  }
};

// Buscar informações do perfil
export const buscarInformacoesPerfil = async (id) => {
  try {
    console.log("🌐 Fazendo GET para:", `/informacoes-pessoais/perfil/${id}`);
    const response = await api.get(`/informacoes-pessoais/perfil/${id}`);
    console.log("📥 Resposta recebida do endpoint /perfil:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error("❌ Erro ao buscar informações do perfil:", error);
    throw error.response?.data || error.message;
  }
};

// Editar/atualizar informações do perfil
export const editarInformacoesPerfil = async (id, novaInformacao) => {
  try {
    console.log("🌐 Fazendo PUT para:", `/informacoes-pessoais/atualizar-perfil/${id}`);
    console.log("📤 DADOS SENDO ENVIADOS (TIPO E VALOR):");
    console.log("📤 JSON COMPLETO:", JSON.stringify(novaInformacao, null, 2));
    
    // 🔍 VERIFICAR TIPOS DE CADA CAMPO
    Object.keys(novaInformacao).forEach(key => {
      const value = novaInformacao[key];
      console.log(`  - ${key}: ${typeof value} = ${JSON.stringify(value)}`);
    });
    
    // ✅ TESTE: Primeiro vamos verificar se conseguimos fazer um GET
    console.log("🔍 TESTE: Verificando se o GET perfil-info funciona...");
    const testeGet = await api.get(`/informacoes-pessoais/perfil-info/${id}`);
    console.log("✅ GET funcionou, dados:", JSON.stringify(testeGet.data, null, 2));
    
    const response = await api.put(`/informacoes-pessoais/atualizar-perfil/${id}`, novaInformacao);
    
    console.log("✅ Resposta PUT completa recebida:");
    console.log("  - Status:", response.status);
    console.log("  - StatusText:", response.statusText);
    console.log("  - Response Data (o que o backend retornou):", JSON.stringify(response.data, null, 2));
    
    if (response.data) {
      console.log("🔍 ANÁLISE DA RESPOSTA DO BACKEND:");
      console.log(`  - CPF retornado pelo backend: "${response.data.cpf}"`);
      console.log(`  - RG retornado pelo backend: "${response.data.rg}"`);
      console.log(`  - Data retornada pelo backend: "${response.data.dataNascimento}"`);
      console.log(`  - Contato Emerg retornado: "${response.data.contatoEmergencia}"`);
      console.log(`  - Idioma retornado: "${response.data.idioma}"`);
    }
    
    return response.data;
  } catch (error) {
    console.error("❌ ERRO ao editar informações do perfil:");
    console.error("Status:", error.response?.status);
    console.error("Detalhes do erro:", JSON.stringify(error.response?.data, null, 2));
    console.error("URL tentada:", `/informacoes-pessoais/atualizar-perfil/${id}`);
    
    // Se for 404, pode ser que o endpoint seja diferente
    if (error.response?.status === 404) {
      console.error("🚨 ENDPOINT 404 - Verifique se o endpoint está correto no backend");
      console.error("Endpoints possíveis:");
      console.error("- /informacoes-pessoais/atualizar-perfil/{usuarioId}");
      console.error("- /informacoes-pessoais/editar/{id}");
      console.error("- /informacoes-pessoais/{id}");
    }
    
    throw error.response?.data || error.message;
  }
};


export default api;