import React from 'react';
import './button-excluir.css';

const ButtonExcluir = ({ onClick, title }) => {
    return (
        <button className="btn-excluir" onClick={onClick}>
            {title}
        </button>
    );
};

export default ButtonExcluir;