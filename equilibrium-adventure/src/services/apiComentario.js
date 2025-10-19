import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

export const listarComentariosPorAtivacao = async (idAtivacao) => {
  const response = await api.get(`/comentarios/listar-por-ativacao/${idAtivacao}`);
  return response.data;
};

export const adicionarComentario = async ({ texto, idUsuario, idAtivacaoEvento }) => {
  const response = await api.post('/comentarios/adicionar', {
    texto,
    idUsuario,
    idAtivacaoEvento 
  });
  return response.data;
};
