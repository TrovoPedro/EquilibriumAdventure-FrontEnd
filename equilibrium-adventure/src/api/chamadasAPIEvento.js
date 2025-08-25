export async function cadastrarEvento(formData) {
    return fetch("http://localhost:8080/guia/cadastrar-evento", {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                return true;
            } else {
                throw new Error(data.message || "Erro ao cadastrar evento.");
            }
        })
        .catch((error) => {
            console.error("Erro:", error);
            return false;
        });
}

export async function buscarCep(cep) {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) {
        throw new Error("Erro ao buscar CEP");
    }
    const data = await response.json();
    if (data.erro) {
        throw new Error("CEP não encontrado");
    }
    return data;
}