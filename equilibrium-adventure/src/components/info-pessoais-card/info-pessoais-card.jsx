import React, { useState } from "react";
import "./info-pessoais-card.css";
import { maskTelefone } from "../../utils/maskTelefone";
import { maskCPF } from "../../utils/maskCpf";
import { maskData } from "../../utils/maskData";
import { maskRG } from "../../utils/maskRg";
import { validatePhone } from "../../utils/validatePhone";
import imagemPadraoUsuario from "../../assets/imagem-do-usuario.png";

export default function InfoPessoaisCard({ 
  formData, 
  onInputChange, 
  errors, 
  readOnly = false,
  imagemPerfil,
  previewImagem,
  imagemAtual,
  onImageUpload,
  onRemoveImage
}) {
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let maskedValue = value;

  
    switch (name) {
      case "telefone":
        const phoneValidation = validatePhone(maskTelefone(value));
        if (phoneValidation.isValid) {
          maskedValue = phoneValidation.value;
        } else {
          maskedValue = phoneValidation.value;
        
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

  // Função para lidar com o upload da imagem e ativar animação
  const handleImageUploadWithAnimation = (event) => {
    onImageUpload(event);
    
    setShowSuccessAnimation(true);
    
    setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 2000);
  };

  return (
    <form className="form-section" autoComplete="off">
      <h2>1 - Informações Pessoais</h2>
      
      {/* Seção de Upload de Imagem de Perfil */}
      {!readOnly && (
        <div className={`profile-image-section ${showSuccessAnimation ? 'success' : ''}`}>
          <div className="profile-image-container">
            <div className={`profile-image-preview ${(previewImagem || imagemAtual) && showSuccessAnimation ? 'image-uploaded' : ''}`}>
              {previewImagem ? (
                <div className="image-preview">
                  <img src={previewImagem} alt="Preview da imagem" className="preview-img" />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={onRemoveImage}
                    title="Remover imagem"
                  >
                    ×
                  </button>
                </div>
              ) : imagemAtual ? (
                <div className="image-preview">
                  <img src={imagemAtual} alt="Imagem atual do usuário" className="preview-img" />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={onRemoveImage}
                    title="Remover imagem"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="image-placeholder">
                  <img src={imagemPadraoUsuario} alt="Imagem padrão" className="default-img" />
                  <div className="upload-overlay">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.2647 15.9377L12.5473 14.2346C12.2326 13.9202 11.7244 13.9202 11.4098 14.2346L9.69238 15.9377" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M12 21V14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M20 16V10.5C20 9.05719 20 8.33579 19.6642 7.75989C19.3284 7.18398 18.6648 6.82186 17.3376 6.09762L15.5136 5.07907C13.9911 4.23346 13.2298 3.81065 12 3.81065C10.7702 3.81065 10.0089 4.23346 8.48638 5.07907L6.66239 6.09762C5.33517 6.82186 4.67157 7.18398 4.33579 7.75989C4 8.33579 4 9.05719 4 10.5V16C4 18.8284 4 20.2426 4.87868 21.1213C5.75736 22 7.17157 22 10 22H14C16.8284 22 18.2426 22 19.1213 21.1213C20 20.2426 20 18.8284 20 16Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <div className="profile-image-controls">
              <input
                type="file"
                id="profile-image-upload"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUploadWithAnimation}
                className="hidden-file-input"
              />
              <label htmlFor="profile-image-upload" className={`upload-btn ${showSuccessAnimation ? 'success' : ''}`}>
                {showSuccessAnimation ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {showSuccessAnimation ? 'Foto Anexada!' : 'Escolher Foto'}
              </label>
              <span className={`upload-hint ${showSuccessAnimation ? 'success' : ''}`}>
                {showSuccessAnimation ? '✓ Imagem pronta para envio!' : 'JPG, PNG ou WebP • Máx 5MB'}
              </span>
            </div>
          </div>
        </div>
      )}

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
            className={errors?.email ? "error" : ""}
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
            className={errors?.telefone ? "error" : ""}
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
            className={errors?.dataNascimento ? "error" : ""}
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
            className={errors?.cpf ? "error" : ""}
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
            className={errors?.rg ? "error" : ""}
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
            placeholder="(11) 99999-9999"
            value={formData?.contatoEmergencia || ""}
            onChange={handleInputChange}
            className={errors?.contatoEmergencia ? "error" : ""}
            readOnly={readOnly}
          />
        </div>
      </div>
    </form>
  );
}
