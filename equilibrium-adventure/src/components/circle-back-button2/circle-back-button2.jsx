import React from "react";
import './circle-back-button2.css';
import leftArrow from "../../assets/left-arrow-green.png";

const ButtonBack = ({ onClick, title }) => {
    return (
          <span className="back-arrow-circle">
            <img className="back-arrow" src={leftArrow} alt="Voltar" />
          </span>
    );
};

export default ButtonBack;