import React, { useState, useEffect } from "react";
import "./dados-guia.css";
import { useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";
import BackButton from "../../components/circle-back-button/circle-back-button";
import useGoBack from "../../utils/useGoBack";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { atualizarGuia } from "../../services/apiGuia";

export default function DadosGuia() {
    const navigate = useNavigate();
    const goBack = useGoBack();
    const { usuario } = useAuth();
    const idUsuario = usuario?.id;

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        descricao: "",
        imagem: null
    });

    useEffect(() => {
        if (!idUsuario) return;
    }, [idUsuario]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!idUsuario) {
            alert("Usuário não logado");
            return;
        }

        try {
            const result = await atualizarGuia(idUsuario, formData);
            console.log("Guia atualizado com sucesso:", result);
            alert("Guia atualizado com sucesso!");
            navigate(routeUrls.HOME);
        } catch (err) {
            console.error("Erro ao atualizar guia:", err);
            alert("Erro ao atualizar guia!");
        }
    };

    return (
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
                        <label htmlFor="descricao">
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
                        <label htmlFor="upload-input">
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
                    <button className="dados-guia-btn" onClick={handleSubmit}>
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
}
