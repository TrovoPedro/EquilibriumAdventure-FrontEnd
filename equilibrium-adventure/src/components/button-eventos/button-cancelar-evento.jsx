import React from "react";
import './button-cancelar-evento.css';

const ButtonCancelarEvento = ({ onClick, title }) => {
    return (
        <button className="btn-cancelar" onClick={onClick}>
            {title}
        </button>
    );
};

export default ButtonCancelarEvento;