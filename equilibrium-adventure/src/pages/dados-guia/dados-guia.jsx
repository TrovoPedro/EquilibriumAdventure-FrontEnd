import React, { useState, useEffect } from "react";
import "./dados-guia.css";
import { useNavigate, useLocation } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";
import BackButton from "../../components/circle-back-button/circle-back-button";
import useGoBack from "../../utils/useGoBack";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { atualizarGuia } from "../../services/apiAdministrador";

export default function DadosGuia() {
    const navigate = useNavigate();
    const location = useLocation();
    const goBack = useGoBack();
    const { usuario } = useAuth();
    
    // Receber dados do guia selecionado via location.state
    const guiaData = location.state?.guiaData;
    const guiaId = location.state?.guiaId;

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        descricao: "",
        imagem: null
    });

    useEffect(() => {
        // Preencher os campos com os dados do guia selecionado
        if (guiaData) {
            setFormData({
                nome: guiaData.nome || "",
                email: guiaData.email || "",
                descricao: guiaData.descricao_guia || "",
                imagem: null // A imagem será carregada separadamente se necessário
            });
        }
    }, [guiaData]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!guiaId) {
            alert("ID do guia não encontrado");
            return;
        }

        try {
            console.log("Atualizando guia:", {
                id: guiaId,
                descricao: formData.descricao,
                imagem: formData.imagem
            });
            
            const result = await atualizarGuia(
                guiaId, 
                formData.descricao, 
                formData.imagem
            );
            
            console.log("Guia atualizado com sucesso:", result);
            alert("Guia atualizado com sucesso!");
            navigate(routeUrls.VER_GUIAS); // Volta para a lista de guias
        } catch (err) {
            console.error("Erro ao atualizar guia:", err);
            alert(`Erro ao atualizar guia: ${err.message || err}`);
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
                                readOnly
                                disabled
                                placeholder="Nome do guia (somente leitura)"
                                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                            />
                        </label>
                        <label htmlFor="email">
                            Email:
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                readOnly
                                disabled
                                placeholder="Email do guia (somente leitura)"
                                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
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
