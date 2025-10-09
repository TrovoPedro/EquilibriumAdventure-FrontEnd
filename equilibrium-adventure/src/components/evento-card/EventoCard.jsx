import React from 'react';
import './EventoCard.css';
import { useNavigate } from 'react-router-dom';

const EventoCard = ({ evento }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/evento/${evento.id_evento}`);
  };

  return (
    <div className="evento-card" onClick={handleClick}>
      <div className="evento-info">
        <h3>{evento.nome_evento}</h3>
        <p className="evento-descricao">{evento.descricao}</p>
        <div className="evento-detalhes">
          <span className="dificuldade">
            Nível: {evento.nivel_dificuldade}
          </span>
          <span className="distancia">
            Distância: {evento.distancia_km}km
          </span>
        </div>
        <div className="evento-local">
          <p>Local: {evento.rua}</p>
          <p>Guia: {evento.nome_responsavel}</p>
        </div>
      </div>
    </div>
  );
};

export default EventoCard;