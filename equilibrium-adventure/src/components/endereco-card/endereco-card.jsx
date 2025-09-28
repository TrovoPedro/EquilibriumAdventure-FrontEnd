import React from "react";
import "./endereco-card.css";
import { maskCep } from "../../utils/masks";

export default function EnderecoCard({ formData, onInputChange, onCepSearch, loading, errors, readOnly = false }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let maskedValue = value;

    // Aplicar máscara de CEP
    if (name === "cep") {
      maskedValue = maskCep(value);
      onInputChange(name, maskedValue);
      
      // Buscar endereço automaticamente quando CEP estiver completo
      if (maskedValue.replace(/\D/g, "").length === 8) {
        onCepSearch(maskedValue);
      }
    } else {
      onInputChange(name, maskedValue);
    }
  };

  return (
    <form className="form-section" autoComplete="off">
      <h2>2 - Endereço</h2>
      <div className="form-grid">
        <div className="endereco__form-group">
          <label htmlFor="cep">CEP:</label>
          <input 
            type="text" 
            id="cep" 
            name="cep" 
            placeholder="12345-678"
            value={formData?.cep || ""}
            onChange={handleInputChange}
            maxLength="9"
            className={loading ? "loading" : ""}
            readOnly={readOnly}
          />
          {loading && <span className="loading-text">Buscando endereço...</span>}
        </div>
        <div className="endereco__form-group">
          <label htmlFor="cidade">Cidade:</label>
          <input 
            type="text" 
            id="cidade" 
            name="cidade" 
            placeholder="São Paulo"
            value={formData?.cidade || ""}
            onChange={handleInputChange}
            readOnly={loading || readOnly}
          />
        </div>
        <div className="endereco__form-group">
          <label htmlFor="estado">Estado:</label>
          <input 
            type="text" 
            id="estado" 
            name="estado" 
            placeholder="SP"
            value={formData?.estado || ""}
            onChange={handleInputChange}
            readOnly={loading || readOnly}
          />
        </div>
        <div className="endereco__form-group">
          <label htmlFor="bairro">Bairro:</label>
          <input 
            type="text" 
            id="bairro" 
            name="bairro" 
            placeholder="Centro"
            value={formData?.bairro || ""}
            onChange={handleInputChange}
            readOnly={loading || readOnly}
          />
        </div>
        <div className="endereco__form-group">
          <label htmlFor="numero">Número:</label>
          <input 
            type="text" 
            id="numero" 
            name="numero" 
            placeholder="123"
            value={formData?.numero || ""}
            onChange={handleInputChange}
            readOnly={readOnly}
          />
        </div>
        <div className="endereco__form-group">
          <label htmlFor="complemento">Complemento (Opcional):</label>
          <input 
            type="text" 
            id="complemento" 
            name="complemento" 
            placeholder="Apto 45"
            value={formData?.complemento || ""}
            onChange={handleInputChange}
            readOnly={readOnly}
          />
        </div>
      </div>
    </form>
  );
}
