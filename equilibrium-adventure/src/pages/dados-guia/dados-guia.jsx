import React, { useState } from "react";
import "./dados-guia.css";
import { useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";
import BackButton from "../../components/circle-back-button/circle-back-button";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function DadosGuia() {

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
            <div className="dados-guia-wrapper">
                <BackButton />
                <div className="dados-guia-header">Dados do Guia</div>
                <div className="dados-guia-container">
                    <div className="dados-guia-body">

                        <label htmlFor="">
                            Nome:
                            <input type="text" name="nome" />
                        </label>
                        <label htmlFor="">
                            Email:
                            <input type="email" name="email" />
                        </label>

                        <label id="imagem-label" htmlFor="">
                            Imagem:
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
                        </label>
                        <label id="descricao-label" htmlFor="">
                            Descrição do Guia:
                            <textarea name="descricao" id="descricao" value={formData.descricao} onChange={handleChange}></textarea>
                        </label>
                    </div>
                    <div className="dados-guia-bottom">
                        <button className="dados-guia-btn">Salvar Alterações</button>
                    </div>
                </div>
            </div>
        </>
    )
}