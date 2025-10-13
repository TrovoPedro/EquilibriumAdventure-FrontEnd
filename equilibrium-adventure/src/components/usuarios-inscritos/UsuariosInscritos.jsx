import React from 'react';
import ButtonSubmitForm from '../button-padrao/button-submit-form';
import ButtonDangerForm from '../button-padrao/button-danger-form';
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
              <ButtonSubmitForm 
                onClick={() => onAprovar(usuario.id)}
                title="Detalhes"
              />
              <ButtonDangerForm 
                onClick={() => onNegar(usuario.id)}
                title="Deletar"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsuariosInscritos;