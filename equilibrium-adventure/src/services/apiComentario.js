import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

export const listarComentariosPorEvento = async (idAtivacaoEvento) => {
  const response = await api.get(`/comentarios/listar-por-evento/${idAtivacaoEvento}`);
  return response.data; // já é um array de ComentarioResponseDTO
};

export const adicionarComentario = async ({ texto, idUsuario, idAtivacaoEvento }) => {
  const response = await api.post('/comentarios/adicionar', {
    texto,
    fk_usuario: idUsuario,
    fk_ativacao_evento: idAtivacaoEvento
  });
  return response.data; // ComentarioResponseDTO
};
