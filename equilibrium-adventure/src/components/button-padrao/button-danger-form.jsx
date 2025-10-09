import React from "react";
import './button-danger-form.css';

const ButtonDangerForm = ({ onClick, title, type = "button" }) => {
    return (
        <button className="btn-danger-form" onClick={onClick} type={type}>
            {title}
        </button>
    );
};

export default ButtonDangerForm;
