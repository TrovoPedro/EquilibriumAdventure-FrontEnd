import React from "react";
import "./circle-back-button.css";
import leftArrow from "../../assets/left_arrow.png";

export default function CircleBackButton({ onClick }) {
  return (
    <button className="circle-back-btn" onClick={onClick} title="Voltar">
      <img src={leftArrow} alt="Voltar" className="circle-back-arrow" />
    </button>
  );
}