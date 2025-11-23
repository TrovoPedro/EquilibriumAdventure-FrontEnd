import React, { useState, useEffect, useRef } from "react";
import "./dados-guia.css";
import { useNavigate, useLocation } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";
import BackButton from "../../components/circle-back-button/circle-back-button";
import useGoBack from "../../utils/useGoBack";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { buscarGuiaPorId, buscarGuiasAdm } from "../../services/apiAdministrador";
import { atualizarGuia } from "../../services/apiGuia";
import { buscarImagemUsuario, buscarDadosUsuario } from "../../services/apiUsuario";
import { buscarGuias } from "../../services/apiTrilhas";
import PopUpOk from "../../components/pop-up-ok/pop-up-ok";

export default function DadosGuia() {
    const navigate = useNavigate();
    const location = useLocation();
    const goBack = useGoBack();
    const { usuario } = useAuth();
    
    const guiaDataFromState = location.state?.guiaData;
    const guiaIdFromState = location.state?.guiaId;
    const guiaId = guiaIdFromState || usuario?.id;

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        descricao: "",
        imagem: null,
        imagemPreview: null
    });

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    // Reset completo do estado quando o guiaId muda
    useEffect(() => {
        setFormData({
            nome: "",
            email: "",
            descricao: "",
            imagem: null,
            imagemPreview: null
        });
        setShowSuccessPopup(false);
    }, [guiaId]);

    useEffect(() => {
        const preencher = async () => {
            try {
                let data = guiaDataFromState;

                if (!data && guiaIdFromState) {
                    try {
                        data = await buscarGuiaPorId(guiaIdFromState);
                    } catch (fetchErr) {
                        const status = fetchErr?.response?.status || null;
                        if (status !== 404) throw fetchErr;
                    }
                }

                if (!data && guiaId) {
                    try {
                        data = await buscarGuiaPorId(guiaId);
                    } catch (fetchErr) {
                        console.log('Tentando buscar por endpoint alternativo...');
                        try {
                            const todosGuias = await buscarGuias();
                            const guiaEncontrado = todosGuias.find(g => 
                                String(g.idUsuario) === String(guiaId) || 
                                String(g.id_usuario) === String(guiaId) ||
                                String(g.id) === String(guiaId)
                            );
                            
                            if (guiaEncontrado) {
                                data = guiaEncontrado;
                            } else {
                                const dadosUsuario = await buscarDadosUsuario(guiaId);
                                data = {
                                    ...dadosUsuario,
                                    descricao_guia: dadosUsuario?.descricao_guia || dadosUsuario?.descricao || ''
                                };
                            }
                        } catch (fetchErr2) {
                            console.error('Erro ao buscar dados do guia logado por endpoints alternativos:', fetchErr2);
                            data = {
                                nome: usuario?.nome || "",
                                email: usuario?.email || usuario?.login || "",
                                descricao: ''
                            };
                        }
                    }
                }

                if (data) {
                    const guia = Array.isArray(data) ? (data[0] || {}) : data;
                    const nome = guia.nome || guia.nomeUsuario || guia.nome_guia || guia.usuario?.nome || guia.pessoa?.nome || guia.usuario?.nomeUsuario || usuario?.nome || "";
                    const email = guia.email || guia.usuario?.email || guia.emailGuia || guia.usuario?.login || usuario?.email || "";
                    const descricao = guia.descricao_guia || guia.descricao || guia.descricaoGuia || guia.perfil?.descricao || guia.usuario?.descricao_guia || "";

                    setFormData(prev => ({
                        ...prev,
                        nome: nome,
                        email: email,
                        descricao: descricao,
                        imagem: null
                    }));
                }
            } catch (err) {
                console.error('Erro ao obter dados do guia para preencher o formulário:', err);
            }
        };

        preencher();
    }, [guiaDataFromState, guiaId, usuario]);

    const imagemUrlRef = useRef(null);

    const isOwnProfile = String(guiaId) === String(usuario?.id);

    useEffect(() => {
        const carregarImagem = async () => {
            if (!guiaId) {
                return;
            }
            try {
                const url = await buscarImagemUsuario(guiaId);
                if (url) {
                    if (imagemUrlRef.current) {
                        try { URL.revokeObjectURL(imagemUrlRef.current); } catch (e) { /* ignore */ }
                    }
                    imagemUrlRef.current = url;
                    setFormData(prev => ({ ...prev, imagemPreview: url }));
                }
            } catch (err) {
                console.error('Erro ao carregar imagem do guia:', err);
            }
        };

        carregarImagem();

        return () => {
            if (imagemUrlRef.current) {
                try { URL.revokeObjectURL(imagemUrlRef.current); } catch (e) { /* ignore */ }
                imagemUrlRef.current = null;
            }
        };
    }, [guiaId, usuario]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files && files[0]) {
            setFormData((prev) => ({ ...prev, imagem: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!guiaId) {
            alert("ID do guia não encontrado");
            return;
        }

        try {
            const result = await atualizarGuia(guiaId, {
                nome: formData.nome,
                email: formData.email,
                descricao: formData.descricao,
                imagem: formData.imagem
            });
            
            setShowSuccessPopup(true);
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
                                    required={true}
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
            
            {showSuccessPopup && (
                <PopUpOk
                    title="Sucesso!"
                    message="Dados do guia atualizados com sucesso!"
                    onConfirm={() => {
                        setShowSuccessPopup(false);
                    }}
                />
            )}
        </div>
    );
}