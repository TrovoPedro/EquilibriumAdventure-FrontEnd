import React from 'react';
import './button-auth.css';

const ButtonAuth = ({ onClick, title, type = 'button', disabled = false }) => {
    return (
        <button className="auth-button" onClick={onClick} type={type} disabled={disabled}>
            {title}
        </button>
    );
};

export default ButtonAuth;