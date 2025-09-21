  import axios from "axios";

  export async function cadastrarEvento(formData, navigate) {
    try {
      const response = await axios.post(
        "http://localhost:8080/guia/cadastrar-evento",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("Evento cadastrado com sucesso!");
        navigate("/catalogfo-trilhas-adm");
        return true;
      } else {
        throw new Error(response.data.message || "Erro ao cadastrar evento.");
      }
    } catch (error) {
      console.error("Erro:", error.message);
      return false;
    }
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
