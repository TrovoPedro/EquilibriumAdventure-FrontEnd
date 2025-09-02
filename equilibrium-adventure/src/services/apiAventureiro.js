import axios from "axios";

// cria uma instância com a URL base
const api = axios.create({
  baseURL: "http://localhost:3000",
});

// funções para consumo do json-server QUESTIONÁRIO
export const getPerguntas = () => api.get("/perguntas");

export const postRespostas = (respostas) =>
  api.post("/respostas", {
    respostas,
    data: new Date().toISOString(),
  });

export default api;
