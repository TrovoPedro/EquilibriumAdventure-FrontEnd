import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080"
});

export const atualizarGuia = async (idGuia, guiaData) => {
    try {
        const form = new FormData();
        
        form.append("nome", guiaData.nome);
        form.append("email", guiaData.email);
        form.append("descricao_guia", guiaData.descricao);
        
        if (guiaData.imagem) {
            form.append("img_usuario", guiaData.imagem);
        }

        const response = await api.put(`/administrador/atualizar-guia/${idGuia}`, form, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar guia:", error);
        throw error.response?.data || error.message;
    }
};
