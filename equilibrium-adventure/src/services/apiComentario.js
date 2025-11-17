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

export const excluirComentario = async (idComentario) => {
  const candidates = [
    `/excluir/${idComentario}`,
    `/comentarios/excluir/${idComentario}`,
    `/comentario/excluir/${idComentario}`,
    `/comentarios/${idComentario}`,
    `/comentario/${idComentario}`
  ];

  for (let path of candidates) {
    try {
      const response = await api.delete(path);
      if (response.status === 204 || response.status === 200) return true;
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) continue;
      throw err.response?.data || err.message || err;
    }
  }

  throw { message: 'Nenhum endpoint de exclusão encontrado (404).', pathCandidates: candidates };
};
