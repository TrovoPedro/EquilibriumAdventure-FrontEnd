import React from "react";
import "./endereco-card.css";

export default function EnderecoCard() {
  return (
    <form className="form-section" autoComplete="off">
      <h2>2 - Endereço</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="cep">CEP:</label>
          <input type="text" id="cep" name="cep" placeholder="12345-678" />
        </div>
        <div className="form-group">
          <label htmlFor="cidade">Cidade:</label>
          <input type="text" id="cidade" name="cidade" placeholder="São Paulo" />
        </div>
        <div className="form-group">
          <label htmlFor="estado">Estado:</label>
          <input type="text" id="estado" name="estado" placeholder="SP" />
        </div>
        <div className="form-group">
          <label htmlFor="bairro">Bairro:</label>
          <input type="text" id="bairro" name="bairro" placeholder="Centro" />
        </div>
        <div className="form-group">
          <label htmlFor="numero">Número:</label>
          <input type="text" id="numero" name="numero" placeholder="123" />
        </div>
        <div className="form-group">
          <label htmlFor="complemento">Complemento (Opcional):</label>
          <input type="text" id="complemento" name="complemento" placeholder="Apto 45" />
        </div>
      </div>
    </form>
  );
}
