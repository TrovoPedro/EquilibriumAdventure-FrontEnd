import React from 'react';
import ButtonSubmitForm from '../button-padrao/button-submit-form';
import ButtonDangerForm from '../button-padrao/button-danger-form';
import './UsuariosInscritos.css';

const UsuariosInscritos = ({ usuarios, onAprovar, onNegar }) => {
  return (
    <div className="usuarios-inscritos-container">
      <h3>Usuários Inscritos</h3>

      {usuarios.length === 0 ? (
        <p className="mensagem-vazia">Ainda não há usuários inscritos nesse evento.</p>
      ) : (
        <div className="usuarios-list">
          {usuarios.map((usuario) => (
            <div key={usuario.idUsuario} className="usuario-card">
              <span className="usuario-nome">{usuario.nomeUsuario}</span>
              <div className="usuario-acoes">
                <ButtonSubmitForm
                  onClick={() => onAprovar(usuario.idUsuario)}
                  title="Detalhes"
                />
                <ButtonDangerForm
                  onClick={() => onNegar(usuario.idUsuario)} // passa o id do usuário
                  title="Cancelar Inscrição"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsuariosInscritos;
