import React from 'react';
import './UsuariosInscritos.css';

const UsuariosInscritos = ({ usuarios, onAprovar, onNegar }) => {
  return (
    <div className="usuarios-inscritos-container">
      <h3>Usuários Inscritos</h3>
      <div className="usuarios-list">
        {usuarios.map((usuario, index) => (
          <div key={index} className="usuario-card">
            <span className="usuario-nome">{usuario.nome}</span>
            <div className="usuario-acoes">
              <button 
                className="btn-aprovar"
                onClick={() => onAprovar(usuario.id)}
              >
                Detalhes
              </button>
              <button 
                className="btn-negar"
                onClick={() => onNegar(usuario.id)}
              >
                Deletar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsuariosInscritos;