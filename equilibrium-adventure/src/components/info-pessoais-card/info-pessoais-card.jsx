import React from "react";
import "./info-pessoais-card.css";
import { maskTelefone } from "../../utils/maskTelefone";
import { maskCPF } from "../../utils/maskCpf";
import { maskData } from "../../utils/maskData";
import { maskRG } from "../../utils/maskRg";
import { validatePhone } from "../../utils/validatePhone";

export default function InfoPessoaisCard({ formData, onInputChange, errors, readOnly = false }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let maskedValue = value;

    // Aplicar máscaras conforme o campo
    switch (name) {
      case "telefone":
        const phoneValidation = validatePhone(maskTelefone(value));
        if (phoneValidation.isValid) {
          maskedValue = phoneValidation.value;
        } else {
          maskedValue = phoneValidation.value;
          // Você pode mostrar erro se necessário
        }
        break;
      case "cpf":
        maskedValue = maskCPF(value);
        break;
      case "rg":
        maskedValue = maskRG(value);
        break;
      case "dataNascimento":
        maskedValue = maskData(value);
        break;
      case "contatoEmergencia":
        // Detectar se há números no final e aplicar máscara de telefone
        const phonePattern = /([\d\(\)\-\s]+)$/;
        const match = value.match(phonePattern);
        if (match) {
          const phoneNumber = match[1].trim();
          const restOfText = value.substring(0, value.lastIndexOf(phoneNumber));
          const maskedPhone = maskTelefone(phoneNumber);
          maskedValue = restOfText + maskedPhone;
        } else {
          maskedValue = value;
        }
        break;
      default:
        maskedValue = value;
    }

    onInputChange(name, maskedValue);
  };

  return (
    <form className="form-section" autoComplete="off">
      <h2>1 - Informações Pessoais</h2>
      <div className="form-grid">
        <div className="info-pessoais__form-group">
          <label htmlFor="nome">Nome:</label>
          <input 
            type="text" 
            id="nome" 
            name="nome" 
            placeholder="Ex: João Silva"
            value={formData?.nome || ""}
            onChange={handleInputChange}
            className={errors?.username ? "error" : ""}
            readOnly={readOnly}
          />
          {errors?.username && <span className="error-message">{errors.username}</span>}
        </div>
        <div className="info-pessoais__form-group">
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="Ex: joao@email.com"
            value={formData?.email || ""}
            onChange={handleInputChange}
            readOnly={readOnly}
          />
        </div>
        <div className="info-pessoais__form-group">
          <label htmlFor="telefone">Número De Telefone:</label>
          <input 
            type="tel" 
            id="telefone" 
            name="telefone" 
            placeholder="(11) 99999-9999"
            value={formData?.telefone || ""}
            onChange={handleInputChange}
            maxLength="15"
            readOnly={readOnly}
          />
        </div>
        <div className="info-pessoais__form-group">
          <label htmlFor="dataNascimento">Data De Nascimento:</label>
          <input 
            type="text" 
            id="dataNascimento" 
            name="dataNascimento" 
            placeholder="DD/MM/AAAA"
            value={formData?.dataNascimento || ""}
            onChange={handleInputChange}
            maxLength="10"
            readOnly={readOnly}
          />
        </div>
        <div className="info-pessoais__form-group">
          <label htmlFor="cpf">CPF:</label>
          <input 
            type="text" 
            id="cpf" 
            name="cpf" 
            placeholder="123.456.789-00"
            value={formData?.cpf || ""}
            onChange={handleInputChange}
            maxLength="14"
            readOnly={readOnly}
          />
        </div>
        <div className="info-pessoais__form-group">
          <label htmlFor="rg">RG:</label>
          <input 
            type="text" 
            id="rg" 
            name="rg" 
            placeholder="12.345.678-9"
            value={formData?.rg || ""}
            onChange={handleInputChange}
            maxLength="12"
            readOnly={readOnly}
          />
        </div>
        <div className="info-pessoais__form-group">
          <label htmlFor="idiomas">Idiomas:</label>
          <input 
            type="text" 
            id="idiomas" 
            name="idiomas" 
            placeholder="Português, Inglês"
            value={formData?.idiomas || ""}
            onChange={handleInputChange}
            readOnly={readOnly}
          />
        </div>
        <div className="info-pessoais__form-group">
          <label htmlFor="contatoEmergencia">Contato De Emergência:</label>
          <input 
            type="text" 
            id="contatoEmergencia" 
            name="contatoEmergencia" 
            placeholder="(11) 98765-4321"
            value={formData?.contatoEmergencia || ""}
            onChange={handleInputChange}
            readOnly={readOnly}
          />
        </div>
      </div>
    </form>
  );
}
