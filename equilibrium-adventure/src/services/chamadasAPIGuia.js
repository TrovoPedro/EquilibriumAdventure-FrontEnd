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

        const response = await axios.post("http://localhost:8080/adiministrador/cadastrar-guia", fd, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        return true;
    } catch (error) {
        console.error("Erro ao cadastrar guia:", error);
        return false;
    }
};