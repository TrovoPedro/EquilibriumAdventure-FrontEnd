import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import routeUrls from "../../routes/routeUrls";
import Header from "../../components/header/header-unified";
import { cadastrarGuia } from "../../services/chamadasAPIGuia";
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
                if (!formData.nome || !formData.email || !formData.senha || !formData.descricao) {
                    alert("Por favor, preencha todos os campos obrigatórios.");
                    return;
                }
                const response = await cadastrarGuia(formData);
                if (response) {

                    navigate(routeUrls.CATALOGO_TRILHAS_ADM);
                }
            } catch (error) {
                if (!response) {
                    console.error("Erro ao cadastrar guia:", error);
                }
            }
        };
        cadastrar();
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

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
                <form className="adicionar-guia-layout-wrapper" autoComplete="off" onSubmit={handleSubmit}>
                    <div style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
                        <input type="text" name="fake-username" autoComplete="username" tabIndex={-1} />
                        <input type="password" name="fake-password" autoComplete="current-password" tabIndex={-1} />
                    </div>
                    <div className="adicionar-guia-side-column">
                        <div className="adicionar-guia-imagem">
                            <div
                                className="upload-box"
                                onClick={() => document.getElementById("upload-input").click()}
                            >
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
                                        <FaCloudUploadAlt size={150} color="#0C513F" />
                                        <p>Clique ou arraste uma imagem aqui</p>
                                    </div>
                                )}
                            </div>
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
                            <button onClick={handleSubmit} className="adicionar-guia-btn">Registrar</button>
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
                            <input autoComplete="name" type="text" name="nome" value={formData.nome} onChange={handleChange} data-field="nome" readOnly onFocus={(e) => e.currentTarget.removeAttribute('readOnly')} />
                        </label>
                        <label htmlFor="">
                            E-mail:
                            <input autoComplete="email" type="text" name="email" value={formData.email} onChange={handleChange} data-field="email" readOnly onFocus={(e) => e.currentTarget.removeAttribute('readOnly')} />
                        </label>
                        <label htmlFor="">
                            Senha:
                            <input autoComplete="new-password" type="password" name="senha" value={formData.senha} onChange={handleChange} data-field="senha" readOnly onFocus={(e) => e.currentTarget.removeAttribute('readOnly')} />
                        </label>
                        <label id="descricao-label" htmlFor="">
                            Descrição do Guia:
                            <textarea autoComplete="off" name="descricao" id="descricao" value={formData.descricao} onChange={handleChange} data-field="descricao" readOnly onFocus={(e) => e.currentTarget.removeAttribute('readOnly')}></textarea>
                        </label>
                    </div>
                </form>
            </div>
        </>
    );

}