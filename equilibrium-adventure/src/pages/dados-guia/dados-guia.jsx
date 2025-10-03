import React, { useState } from "react";
import "./dados-guia.css";
import { useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";
import BackButton from "../../components/circle-back-button/circle-back-button";
import useGoBack from "../../utils/useGoBack";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function DadosGuia() {
    const navigate = useNavigate();
    const goBack = useGoBack();
    const [formData, setFormData] = useState({
        nome: "",
        dataNascimento: "",
        email: "",
        senha: "",
        cargo: "",
        descricao: "",
        imagem: null
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Guia registrado:", formData);
        navigate(routeUrls.HOME);
    };



    return (
        <>
            <div className="dados-guia-wrapper">
                <BackButton onClick={goBack} />
                <div className="dados-guia-header">Dados do Guia</div>
                <div className="dados-guia-container">
                    <div className="dados-guia-body">
                        <div className="dados-left">
                            <label htmlFor="nome">
                                Nome:
                                <input 
                                    type="text" 
                                    id="nome"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    placeholder="Digite seu nome completo"
                                />
                            </label>
                            <label htmlFor="email">
                                Email:
                                <input 
                                    type="email" 
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Digite seu email"
                                />
                            </label>
                            <label id="descricao-label" htmlFor="descricao">
                                Descrição do Guia:
                                <textarea 
                                    name="descricao" 
                                    id="descricao" 
                                    value={formData.descricao} 
                                    onChange={handleChange}
                                    placeholder="Descreva sua experiência e especialidades..."
                                ></textarea>
                            </label>
                        </div>
                        
                        <div className="dados-right">
                            <label id="imagem-label" htmlFor="upload-input">
                                Foto de Perfil:
                                <div className="adicionar-guia-imagem">
                                    <div
                                        className="upload-box"
                                        onClick={() => document.getElementById("upload-input").click()}
                                    >
                                        {formData.imagem ? (
                                            <img
                                                src={URL.createObjectURL(formData.imagem)}
                                                alt="Pré-visualização"
                                                className="preview-img"
                                            />
                                        ) : (
                                            <div className="upload-placeholder">
                                                <FaCloudUploadAlt size={80} color="#226144" />
                                                <p>Clique para adicionar sua foto</p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        id="upload-input"
                                        name="imagem"
                                        onChange={handleChange}
                                        accept="image/*"
                                        style={{ display: "none" }}
                                    />
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="dados-guia-bottom">
                        <button className="dados-guia-btn">Salvar Alterações</button>
                    </div>
                </div>
            </div>
        </>
    )
}