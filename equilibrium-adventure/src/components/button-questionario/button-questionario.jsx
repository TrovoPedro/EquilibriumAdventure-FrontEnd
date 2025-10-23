import React from 'react';
import './button-questionario.css';

const ButtonQuest = ({ onClick, title, isBackButton = false }) => (
    <button 
        className={`button-questionario ${isBackButton ? 'button-questionario-back' : ''}`} 
        onClick={onClick}
    >
        {title}
    </button>
);

export default ButtonQuest;