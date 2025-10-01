import React from 'react';
import './EventoInfo.css';

const EventoInfo = ({ 
  evento, 
  onSalvar, 
  onChange,
  editavel = false 
}) => {
  return (
    <div className="evento-info-container">
      <div className="evento-header">
        <div className="evento-imagem">
          <img src={evento.imagem} alt={evento.titulo} />
        </div>
        <div className="evento-detalhes">
          <div className="campo-info-titulo">
            <label>Título:</label>
            {editavel ? (
              <input
                className='input-titulo'
                type="text"
                value={evento.titulo}
                onChange={(e) => onChange('titulo', e.target.value)}
              />
            ) : (
              <span>{evento.titulo}</span>
            )}
          </div>
          
          <div className="campos-linha">
            <div className="campo-info">
              <label>Data:</label>
              {editavel ? (
                <input
                  type="date"
                  value={evento.data}
                  onChange={(e) => onChange('data', e.target.value)}
                />
              ) : (
                <span>{evento.data}</span>
              )}
            </div>
            
            <div className="campo-info">
              <label>Endereço:</label>
              {editavel ? (
                <input
                  type="text"
                  value={evento.endereco}
                  onChange={(e) => onChange('endereco', e.target.value)}
                />
              ) : (
                <span>{evento.endereco}</span>
              )}
            </div>
          </div>

          <div className="campos-linha">
            <div className="campo-info">
              <label>Hora Início:</label>
              {editavel ? (
                <input
                  type="time"
                  value={evento.horaInicio}
                  onChange={(e) => onChange('horaInicio', e.target.value)}
                />
              ) : (
                <span>{evento.horaInicio}</span>
              )}
            </div>
            
            <div className="campo-info">
              <label>Limite de Inscritos:</label>
              {editavel ? (
                <input
                  type="number"
                  value={evento.limiteInscritos}
                  onChange={(e) => onChange('limiteInscritos', e.target.value)}
                />
              ) : (
                <span>{evento.limiteInscritos}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="evento-descricao">
        <label>Descrição do Evento:</label>
        {editavel ? (
          <textarea
            value={evento.descricao}
            onChange={(e) => onChange('descricao', e.target.value)}
          />
        ) : (
          <p>{evento.descricao}</p>
        )}
      </div>

      {editavel && (
        <div className="evento-acoes">
          <button className="btn-salvar" onClick={onSalvar}>
            Salvar Alterações
          </button>
        </div>
      )}
    </div>
  );
};

export default EventoInfo;