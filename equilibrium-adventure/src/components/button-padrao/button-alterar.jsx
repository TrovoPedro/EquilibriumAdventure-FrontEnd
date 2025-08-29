import React from 'react';
import './button-alterar.css';

const ButtonAlterar = ({ onClick, title }) => {
    return (
        <button className="btn-salvar" onClick={onClick}>
            {title}
        </button>
    );
};

export default ButtonAlterar;