import React from "react";
import './button-submit-form.css';

const ButtonSubmitForm = ({ onClick, title, type = "button" }) => {
    return (
        <button className="btn-submit-form" onClick={onClick} type={type}>
            {title}
        </button>
    );
};

export default ButtonSubmitForm;