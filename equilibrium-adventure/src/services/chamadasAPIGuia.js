import axios from "axios";
import dayjs from "dayjs";

export const cadastrarGuia = async (formData) => {
    try {
        const guiaDTO = {
            nome: formData.nome,
            email: formData.email,
            senha: formData.senha,
            descricao_guia: formData.descricao || formData.descricao_guia || null,
            tipo_usuario: formData.tipo_usuario || null,
        };

        const fd = new FormData();
        fd.append(
            "guia",
            new Blob([JSON.stringify(guiaDTO)], { type: "application/json" })
        );

        if (formData.imagem) {
            fd.append("imagem", formData.imagem);
        }

        // Do not set Content-Type explicitly: browser/axios will set the correct
        // multipart boundary for FormData automatically.
        const response = await axios.post("http://localhost:8080/administrador/cadastrar-guia", fd);

        return response.data || true;
    } catch (error) {
        console.error("Erro ao cadastrar guia:", error);
        // Propagate the error so the caller can show backend/network messages
        throw error;
    }
};