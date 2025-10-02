import React from 'react';
import './CustomButton.css';

const CustomButton = ({ onClick, children, type = "button" }) => {
  return (
    <button 
      className="custom-button"
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default CustomButton;