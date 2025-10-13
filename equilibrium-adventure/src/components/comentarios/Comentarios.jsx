import React, { useState } from 'react';
import ButtonSubmitForm from '../button-padrao/button-submit-form';
import './Comentarios.css';

const Comentarios = ({ comentariosIniciais = [], onEnviarComentario }) => {
  const [comentarios, setComentarios] = useState(comentariosIniciais);
  const [novoComentario, setNovoComentario] = useState("");

  const handleComentario = async (e) => {
    e.preventDefault();
    if (novoComentario.trim() === "") return;

    const comentarioObj = { 
      nome: "Você", 
      texto: novoComentario 
    };

    // Se houver uma função de callback para salvar, usa ela
    if (onEnviarComentario) {
      await onEnviarComentario(comentarioObj);
    }

    setComentarios([...comentarios, comentarioObj]);
    setNovoComentario("");
  };

  return (
    <div className="comentarios-container">
      <h3>Comentários</h3>
      <div className="lista-comentarios">
        {comentarios.map((comentario, index) => (
          <div key={index} className="comentario-card">
            <div className="comentario-header">
              <span className="comentario-autor">{comentario.nome}</span>
            </div>
            <p className="comentario-texto">{comentario.texto}</p>
          </div>
        ))}
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