import React from "react";
import "./info-pessoais-card.css";

export default function InfoPessoaisCard() {
  return (
    <form className="form-section" autoComplete="off">
      <h2>1 - Informações Pessoais</h2>
      <div className="form-grid">
        <div className="info-pessoais__form-group">
          <label htmlFor="nome">Nome:</label>
          <input type="text" id="nome" name="nome" placeholder="Ex: João Silva" />
        </div>
        <div className="info-pessoais__form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" placeholder="Ex: joao@email.com" />
        </div>
        <div className="info-pessoais__form-group">
          <label htmlFor="senha">Senha:</label>
          <input type="password" id="senha" name="senha" placeholder="********" />
        </div>
        <div className="info-pessoais__form-group">
          <label htmlFor="telefone">Número De Telefone:</label>
          <input type="tel" id="telefone" name="telefone" placeholder="(11) 99999-9999" />
        </div>
        <div className="info-pessoais__form-group">
          <label htmlFor="data-nascimento">Data De Nascimento:</label>
          <input type="date" id="data-nascimento" name="data-nascimento" placeholder="DD/MM/AAAA" />
        </div>
        <div className="info-pessoais__form-group">
          <label htmlFor="cpf">CPF:</label>
          <input type="text" id="cpf" name="cpf" placeholder="123.456.789-00" />
        </div>
        <div className="info-pessoais__form-group">
          <label htmlFor="rg">RG:</label>
          <input type="text" id="rg" name="rg" placeholder="12.345.678-9" />
        </div>
        <div className="info-pessoais__form-group">
          <label htmlFor="idiomas">Idiomas:</label>
          <input type="text" id="idiomas" name="idiomas" placeholder="Português, Inglês" />
        </div>
        <div className="info-pessoais__form-group full-width">
          <label htmlFor="contato-emergencia">Contato De Emergência:</label>
          <input type="text" id="contato-emergencia" name="contato-emergencia" placeholder="Nome + Telefone" />
        </div>
      </div>
    </form>
  );
}
