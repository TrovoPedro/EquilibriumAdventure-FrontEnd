import React from 'react';
import './FormCard.css';

const FormCard = ({ titulo, children }) => {
  return (
    <div className="form-card-container">
      <div className="form-card-overlay">
        <div className="form-card">
          <h2>{titulo}</h2>
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormCard;