import React, { useState, useEffect } from 'react';
import ButtonSubmitForm from '../button-padrao/button-submit-form';
import './Comentarios.css';
import { useAuth } from '../../context/AuthContext';
import { excluirComentario } from '../../services/apiComentario';
import { showWarning, showError } from '../../utils/swalHelper';

const Comentarios = ({ comentariosIniciais = [], onEnviarComentario }) => {
  const [novoComentario, setNovoComentario] = useState("");
  const [comentarios, setComentarios] = useState([]);

  // Atualiza a lista de comentários sempre que os iniciais mudarem
  useEffect(() => {
    // Map para garantir que cada comentário tenha nomeUsuario e dataComentario
    const padronizados = comentariosIniciais.map(c => ({
      id: c.id || c.idComentario || c.commentId || null,
      nomeUsuario: c.nomeUsuario || c.nome || c.usuario?.nome || "Anônimo",
      texto: c.texto || c.conteudo || c.message || "",
      dataComentario: c.dataComentario || c.data || c.createdAt || new Date().toISOString(),
      tipoUsuario: (() => {
        const t = c.tipoUsuario || c.tipo || c.usuario?.tipo || c.usuario?.tipoUsuario || c.role || c.roleName || c.tipo_user || c.tipo_usuario || c.perfil?.tipo || c.perfil?.tipoUsuario || null;
        return t != null ? String(t).trim() : null;
      })(),
      idUsuario: c.idUsuario || c.usuarioId || c.userId || c.usuario?.id || null
    }));

    // Ordena do mais antigo para o mais recente
    padronizados.sort((a, b) => new Date(a.dataComentario) - new Date(b.dataComentario));
    try {
      console.log('Comentarios padronizados:', padronizados.map(p => ({ nome: p.nomeUsuario, tipoUsuario: p.tipoUsuario })));
    } catch (e) {
      // ignore
    }
    setComentarios(padronizados);
  }, [comentariosIniciais]);

  const handleComentario = async (e) => {
    e.preventDefault();
    if (novoComentario.trim() === "") return;

    const agora = new Date();
    const comentarioObj = {
      nomeUsuario: "Você",
      texto: novoComentario,
      dataComentario: agora.toISOString()
    };

    // marcar o comentário localmente como vindo do usuário atual (assumimos AVENTUREIRO)
    comentarioObj.tipoUsuario = 'AVENTUREIRO';

    if (onEnviarComentario) {
      // let the parent handle persisting and updating the comments list
      await onEnviarComentario(comentarioObj);
      setNovoComentario("");
      return;
    }

    // local-only mode: append optimistic comment
    setComentarios(prev => [...prev, comentarioObj]);
    setNovoComentario("");
  };

  const { usuario } = useAuth();

  // helper: verifica se o comentário pertence ao usuário logado
  const isCommentOwner = (comentario) => {
    if (!usuario) return false;
    const userId = String(usuario.id || usuario.usuarioId || usuario.idUsuario || '');
    const candidates = [
      comentario.idUsuario,
      comentario.usuario?.id,
      comentario.usuarioId,
      comentario.userId,
      comentario.usuario?.usuarioId,
      comentario.usuario?.idUsuario,
      comentario.id
    ];
    return candidates.some(c => c !== undefined && c !== null && String(c) === userId) ||
      (comentario.nomeUsuario && usuario.nome && String(comentario.nomeUsuario) === String(usuario.nome));
  }

  const handleExcluir = async (comentarioId) => {
    // safety: if no id, inform user and avoid calling backend with undefined
    if (!comentarioId) {
      showError('Não foi possível identificar o comentário para exclusão. Recarregue a página e tente novamente.');
      return;
    }

    const confirm = await showWarning('Deseja excluir este comentário?', 'Confirmar', 'Sim', 'Cancelar', true);
    if (!confirm || !confirm.isConfirmed) return;

    try {
      const result = await excluirComentario(comentarioId);
      if (result === true || result === 'true' || result?.success) {
        setComentarios(prev => prev.filter(c => c.id !== comentarioId));
      } else {
        // fallback: remove if HTTP 200 but payload different
        setComentarios(prev => prev.filter(c => c.id !== comentarioId));
      }
    } catch (err) {
      console.error('Erro ao excluir comentário:', err);
      const serverMessage = err?.response?.data?.message || err?.response?.data || err?.message;
      showError(typeof serverMessage === 'string' ? serverMessage : 'Erro ao excluir comentário. Tente novamente.');
    }
  };

  return (
    <div className="comentarios-container">
      <h3>Comentários</h3>
      <div className="lista-comentarios">
        {comentarios.length === 0 ? (
          <p className="comentario-vazio">
            Ainda não há comentários, seja o primeiro.
          </p>
        ) : (
          comentarios.map((comentario, index) => (
              <div key={index} className="comentario-card">
                <div className="comentario-header">
                  <div className="comentario-author-area">
                    <span className="comentario-autor">{comentario.nomeUsuario}</span>
                    {(
                      comentario.tipoUsuario != null &&
                      String(comentario.tipoUsuario).trim() !== '' &&
                      String(comentario.tipoUsuario).toUpperCase() !== 'AVENTUREIRO'
                    ) && (
                      <span className="comentario-badge">Guia</span>
                    )}
                  </div>
                </div>

                {/* Área fixa à direita: data em cima e botão Excluir abaixo dela */}
                <div className="comentario-right-area">
                  <span className="comentario-data">
                    {new Date(comentario.dataComentario).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {isCommentOwner(comentario) && (
                    <button className="comentario-delete" onClick={() => handleExcluir(comentario.id)}>Excluir</button>
                  )}
                </div>

                <p className="comentario-texto">{comentario.texto}</p>
              </div>
          ))
        )}
      </div>

      <form className="comentario-form" onSubmit={handleComentario}>
        <input
          type="text"
          placeholder="Escreva aqui um comentário"
          value={novoComentario}
          onChange={e => setNovoComentario(e.target.value)}
          maxLength={120}
          className="comentario-input"
        />
        <ButtonSubmitForm type="submit" title="Enviar" />
      </form>
    </div>
  );
};

export default Comentarios;
