import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import routeUrls from "../../routes/routeUrls";
import Header from "../../components/header/header";
import "./adicionar-guia.css";
import leftArrow from "../../assets/left-arrow-green.png";

export default function AdicionarGuia() {

    const navigate = useNavigate();
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
            <Header />
            <div className="adicionar-guia-container">
                <div className="adicionar-guia-header">
                    <span className="back-arrow-circle">
                        <img className="back-arrow" src={leftArrow} alt="Voltar" />
                    </span>
                    <span className="adicionar-guia-title">Adicionar Guia</span>
                </div>
                <div className="adicionar-guia-layout-wrapper">
                    <div className="adicionar-guia-side-column">
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
                                        <FaCloudUploadAlt size={150} color="#0C513F" />
                                        <p>Clique ou arraste uma imagem aqui</p>
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
                        <div className="adicionar-guia-botoes">
                            <button className="adicionar-guia-btn">Registrar</button>
                            <button className="adicionar-guia-btn">
                                <a href="">
                                Visualizar Guias
                                </a> 
                                </button>
                        </div>
                    </div>
                    <div className="adicionar-guia-center-column">
                        <label htmlFor="">
                            Nome:
                            <input type="text" name="nome" value={formData.nome} onChange={handleChange} />
                        </label>
                        <label htmlFor="">
                            Data de Nascimento:
                            <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} />
                        </label>
                        <label htmlFor="">
                            E-mail:
                            <input type="text" name="email" value={formData.email} onChange={handleChange} />
                        </label>
                        <label htmlFor="">
                            Senha:
                            <input type="password" name="senha" value={formData.senha} onChange={handleChange} />
                        </label>
                        <label htmlFor="">
                            Cargo:
                            <input type="text" name="cargo" value={formData.cargo} onChange={handleChange} />
                        </label>
                        <label id="descricao-label" htmlFor="">
                            Descrição do Guia:
                            <textarea name="descricao" id="descricao" value={formData.descricao} onChange={handleChange}></textarea>
                        </label>
                    </div>
                </div>
            </div>
        </>
    );

}