import React from 'react';
import './CustomInput.css';

const CustomInput = ({ type, value, onChange, placeholder }) => {
  return (
    <div className="custom-input-container">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="custom-input"
      />
    </div>
  );
};

export default CustomInput;