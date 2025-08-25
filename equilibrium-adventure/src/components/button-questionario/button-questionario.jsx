import React from 'react';
import './button-questionario.css';

const ButtonQuest = ({ onClick, title }) => (
    <button className="button-questionario" onClick={onClick}>
        {title}
    </button>
);

export default ButtonQuest;