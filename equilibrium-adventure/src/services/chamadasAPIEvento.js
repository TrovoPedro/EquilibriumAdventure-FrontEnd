import axios from "axios";

export async function cadastrarEvento(formDataValues, navigate, usuarioId) {
    try {
        const formData = new FormData();

        const eventoDTO = {
            nome: formDataValues.titulo || "",
            descricao: formDataValues.descricao || "",
            nivel_dificuldade: formDataValues.dificuldade || "",
            distancia_km: formDataValues.distancia
                ? parseFloat(formDataValues.distancia.replace(" km", ""))
                : 0,
            responsavel: usuarioId, // <--- aqui passa o ID do usuário logado
            endereco: {
                rua: formDataValues.rua || "",
                numero: formDataValues.numero || "",
                complemento: formDataValues.complemento || "",
                bairro: formDataValues.bairro || "",
                cidade: formDataValues.cidade || "",
                estado: formDataValues.estado || "",
                cep: formDataValues.cep || ""
            },
            caminho_arquivo_evento: formDataValues.trilha ? formDataValues.trilha.name : null
        };

        formData.append(
            "evento",
            new Blob([JSON.stringify(eventoDTO)], { type: "application/json" })
        );

        if (formDataValues.imagem) {
            formData.append("imagem", formDataValues.imagem);
        }

        const response = await axios.post(
            "http://localhost:8080/guia/cadastrar",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (response.data.success) {
            alert("Evento cadastrado com sucesso!");
            navigate("/catalogo-trilhas-adm");
            return true;
        } else {
            throw new Error(response.data.message || "Erro ao cadastrar evento.");
        }
    } catch (error) {
        console.error("Erro:", error.response?.data || error.message);
        return false;
    }
}

export async function buscarCep(cep) {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) throw new Error("Erro ao buscar CEP");
    const data = await response.json();
    if (data.erro) throw new Error("CEP não encontrado");
    return data;
}
