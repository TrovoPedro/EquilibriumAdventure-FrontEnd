import React, { useState, useEffect } from 'react';
import ButtonSubmitForm from '../button-padrao/button-submit-form';
import './Comentarios.css';

const Comentarios = ({ comentariosIniciais = [], onEnviarComentario }) => {
  const [novoComentario, setNovoComentario] = useState("");
  const [comentarios, setComentarios] = useState([]);

  // Atualiza a lista de comentários sempre que os iniciais mudarem
  useEffect(() => {
    // Map para garantir que cada comentário tenha nomeUsuario e dataComentario
    const padronizados = comentariosIniciais.map(c => ({
      nomeUsuario: c.nomeUsuario || c.nome || "Anônimo",
      texto: c.texto,
      dataComentario: c.dataComentario || new Date().toISOString()
    }));

    // Ordena do mais antigo para o mais recente
    padronizados.sort((a, b) => new Date(a.dataComentario) - new Date(b.dataComentario));
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

    if (onEnviarComentario) {
      await onEnviarComentario(comentarioObj);
    }

    setComentarios(prev => [...prev, comentarioObj]);
    setNovoComentario("");
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
                <span className="comentario-autor">{comentario.nomeUsuario}</span>
                <span className="comentario-data">
                  {new Date(comentario.dataComentario).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
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
