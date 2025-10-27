import React, { useState, useEffect } from "react";
import "./dados-guia.css";
import { useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";
import BackButton from "../../components/circle-back-button/circle-back-button";
import useGoBack from "../../utils/useGoBack";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { atualizarGuia } from "../../services/apiGuia";
import { showSuccess, showError, showWarning } from "../../utils/swalHelper";
import { buscarDadosUsuario, buscarImagemUsuario } from "../../services/apiUsuario";

export default function DadosGuia() {
    const navigate = useNavigate();
    const goBack = useGoBack();
    const { usuario } = useAuth();
    // aceita objetos de usuário que tenham either `id` ou `id_usuario`
    const idUsuario = usuario?.id || usuario?.id_usuario;

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        descricao: "",
        imagem: null, // arquivo selecionado pelo input
        imagemPreview: null // url da imagem atual fornecida pelo backend
    });

    useEffect(() => {
        if (!idUsuario) return;

        const carregarDados = async () => {
            try {
                const dados = await buscarDadosUsuario(idUsuario);
                if (dados) {
                    setFormData((prev) => ({
                        ...prev,
                        nome: dados.nome || "",
                        email: dados.email || "",
                        descricao: dados.descricao_guia || dados.descricao || "",
                    }));
                }

                const imgUrl = await buscarImagemUsuario(idUsuario);
                if (imgUrl) {
                    setFormData((prev) => ({ ...prev, imagemPreview: imgUrl }));
                }
            } catch (err) {
                console.error("Erro ao carregar dados do guia:", err);
            }
        };

        carregarDados();
    }, [idUsuario]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files && files[0]) {
            // arquivo selecionado -> atualiza `imagem` e limpa imagemPreview
            setFormData((prev) => ({ ...prev, imagem: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!idUsuario) {
            showWarning("Usuário não logado");
            return;
        }

        try {
            const confirmResult = await showWarning('Deseja salvar as alterações do guia?', 'Confirmar', 'Sim', 'Cancelar', true);
            if (!confirmResult || !confirmResult.isConfirmed) {
                return; 
            }
        } catch (err) {
            console.error('Erro ao exibir confirmação:', err);
            return;
        }

        try {
            const result = await atualizarGuia(idUsuario, formData);
            console.log("Dados atualizados com sucesso:", result);
            showSuccess("Dados atualizados com sucesso!");
            navigate(routeUrls.CATALOGO_TRILHAS_ADM);
        } catch (err) {
            console.error("Erro ao atualizar guia:", err);
            showError("Erro ao atualizar guia!");
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
                                >
                                    {formData.imagem ? (
                                        <img
                                            src={URL.createObjectURL(formData.imagem)}
                                            alt="Pré-visualização"
                                            className="preview-img"
                                        />
                                    ) : formData.imagemPreview ? (
                                        <img src={formData.imagemPreview} alt="Imagem atual" className="preview-img" />
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
