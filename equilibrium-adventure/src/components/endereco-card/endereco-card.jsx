import React from "react";
import "./endereco-card.css";
import { maskCep } from "../../utils/masks";

export default function EnderecoCard({ formData, onInputChange, onCepSearch, loading, errors, readOnly = false }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let maskedValue = value;

    if (name === "cep") {
      maskedValue = maskCep(value);
      onInputChange(name, maskedValue);
      
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
            className={loading ? "loading" : (errors?.cep ? "error" : "")}
            readOnly={readOnly}
          />
          {loading && <span className="loading-text">Buscando endereço...</span>}
        </div>
        <div className="endereco__form-group">
          <label htmlFor="rua">Rua:</label>
          <input 
            type="text" 
            id="rua" 
            name="rua" 
            placeholder="Av. Paulista"
            value={formData?.rua || ""}
            onChange={handleInputChange}
            readOnly={loading || readOnly}
          />
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
      </div>
      <div className="endereco__form-group endereco__form-group--full-width">
        <label htmlFor="complemento">Complemento (Opcional):</label>
        <input 
          type="text" 
          id="complemento" 
          name="complemento" 
          placeholder="Apto 45, Bloco B, etc."
          value={formData?.complemento || ""}
          onChange={handleInputChange}
          readOnly={readOnly}
        />
      </div>
    </form>
  );
}
