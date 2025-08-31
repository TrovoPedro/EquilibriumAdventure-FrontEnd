import React from "react";
import './button-criar-evento.css';

const ButtonCriarEvento = ({ onClick, title }) => {
    return (
        <button className="btn-salvar" onClick={onClick}>
            {title}
        </button>
    );
};

export default ButtonCriarEvento;