import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import routeUrls from "../../routes/routeUrls";
import Header from "../../components/header/header-unified";
import { cadastrarGuia } from "../../services/chamadasAPIGuia";
import { showSuccess, showWarning, showError } from "../../utils/swalHelper";
import "./adicionar-guia.css";
import leftArrow from "../../assets/left-arrow-green.png";

export default function AdicionarGuia() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        descricao: "",
        imagem: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleChange = (e) => {
        const { name, value, files, dataset } = e.target;
        const field = dataset.field || name;

        if (files && files[0]) {
            const file = files[0];

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }

            const newUrl = URL.createObjectURL(file);
            setPreviewUrl(newUrl);

            setFormData({
                ...formData,
                [field]: file,
            });
            return;
        }

        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const cadastrar = async () => {
            try {
                // Validações básicas de campos obrigatórios
                if (!formData.nome || !formData.nome.trim()) {
                    showWarning("Por favor, preencha o nome do guia.");
                    return;
                }

                // Valida se tem sobrenome
                const nomeParts = formData.nome.trim().split(' ');
                if (nomeParts.length < 2 || nomeParts[1].trim() === '') {
                    showWarning("Por favor, preencha o nome completo com sobrenome.");
                    return;
                }

                if (!formData.email || !formData.email.trim()) {
                    showWarning("Por favor, preencha o e-mail do guia.");
                    return;
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email)) {
                    showWarning("Por favor, insira um e-mail válido.");
                    return;
                }

                if (!formData.senha || !formData.senha.trim()) {
                    showWarning("Por favor, preencha a senha.");
                    return;
                }

                if (formData.senha.length < 8) {
                    showWarning("A senha deve ter pelo menos 8 caracteres.");
                    return;
                }

                if (!formData.descricao || !formData.descricao.trim()) {
                    showWarning("Por favor, preencha a descrição do guia.");
                    return;
                }

                if (formData.descricao.trim().length < 10) {
                    showWarning("A descrição deve ter pelo menos 10 caracteres.");
                    return;
                }

                const response = await cadastrarGuia(formData);
                if (response) {
                    showSuccess("Guia cadastrado com sucesso!");
                    setTimeout(() => {
                        navigate(routeUrls.CATALOGO_TRILHAS_ADM);
                    }, 2000);
                }
            } catch (error) {
                console.error("Erro ao cadastrar guia:", error);
                showError("Erro ao cadastrar guia. Verifique os dados e tente novamente.");
            }
        };
        cadastrar();
    };

    const handleVoltar = () => {
        navigate(-1);
    };

    return (
        <>
            <Header />
            <div className="adicionar-guia-page">
                <div className="adicionar-guia-container">
                <div className="adicionar-guia-header">
                    <span className="back-arrow-circle" onClick={handleVoltar}>
                        <img className="back-arrow" src={leftArrow} alt="Voltar" />
                    </span>
                    <h1 className="adicionar-guia-title">Adicionar Guia</h1>
                </div>
                <form className="adicionar-guia-layout-wrapper" autoComplete="off" onSubmit={handleSubmit}>
                    <div style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
                        <input type="text" name="fake-username" autoComplete="username" tabIndex={-1} />
                        <input type="password" name="fake-password" autoComplete="current-password" tabIndex={-1} />
                    </div>
                    <div className="adicionar-guia-side-column">
                        <div className="adicionar-guia-imagem">
                            <label htmlFor="upload-input" className="upload-box">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Pré-visualização"
                                        className="preview-img"
                                    />
                                ) : formData.imagem ? (
                                    <img src={formData.imagem} alt="Pré-visualização" className="preview-img" />
                                ) : (
                                    <div className="upload-placeholder">
                                        <FaCloudUploadAlt size={150} color="#226144" />
                                        <p>Clique ou arraste uma imagem aqui</p>
                                    </div>
                                )}
                            </label>
                            <input
                                type="file"
                                id="upload-input"
                                name="imagem"
                                data-field="imagem"
                                onChange={handleChange}
                                accept="image/*"
                                style={{ display: "none" }}
                            />

                        </div>
                        <div className="adicionar-guia-botoes">
                            <button type="submit" className="adicionar-guia-btn">Registrar</button>
                            <button type="button" className="adicionar-guia-btn" onClick={() => navigate(routeUrls.VER_GUIAS)}>
                                Visualizar Guias
                            </button>
                        </div>
                    </div>
                    <div className="adicionar-guia-center-column">
                        <label htmlFor="nome">
                            Nome:
                            <input 
                                autoComplete="name" 
                                type="text" 
                                id="nome" 
                                name="nome" 
                                value={formData.nome} 
                                onChange={handleChange} 
                                data-field="nome" 
                                readOnly 
                                onFocus={(e) => e.currentTarget.removeAttribute('readOnly')}
                            />
                        </label>
                        <label htmlFor="email">
                            E-mail:
                            <input 
                                autoComplete="email" 
                                type="text" 
                                id="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                data-field="email" 
                                readOnly 
                                onFocus={(e) => e.currentTarget.removeAttribute('readOnly')}
                            />
                        </label>
                        <label htmlFor="senha">
                            Senha:
                            <input 
                                autoComplete="new-password" 
                                type="password" 
                                id="senha" 
                                name="senha" 
                                value={formData.senha} 
                                onChange={handleChange} 
                                data-field="senha" 
                                readOnly 
                                onFocus={(e) => e.currentTarget.removeAttribute('readOnly')}
                            />
                        </label>
                        <label id="descricao-label" htmlFor="descricao">
                            Descrição do Guia:
                            <textarea 
                                autoComplete="off" 
                                name="descricao" 
                                id="descricao" 
                                value={formData.descricao} 
                                onChange={handleChange} 
                                data-field="descricao" 
                                readOnly 
                                onFocus={(e) => e.currentTarget.removeAttribute('readOnly')}
                            ></textarea>
                        </label>
                    </div>
                </form>
                </div>
            </div>
        </>
    );

}