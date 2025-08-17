import React from 'react';
import './button-auth.css';

const ButtonAuth = ({ onClick, title }) => {
    return (
        <button className="auth-button" onClick={onClick}>
            {title}
        </button>
    );
};

export default ButtonAuth;