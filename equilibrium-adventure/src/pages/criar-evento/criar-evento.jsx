import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import routeUrls from "../../routes/routeUrls";
import Header from "../../components/header/header-unified";
import { maskCep, maskDistancia } from "../../utils/masks";
import { cadastrarEvento, buscarCep } from "../../services/chamadasAPIEvento";
import { useAuth } from "../../context/AuthContext";
import PopUpOk from "../../components/pop-up-ok/pop-up-ok";
import PopUpErro from "../../components/pop-up-erro/pop-up-erro";
import "./criar-evento.css";
import ButtonCancelarEvento from "../../components/button-eventos/button-cancelar-evento";
import ButtonSubmitForm from "../../components/button-padrao/button-submit-form";
import ButtonBack from "../../components/circle-back-button2/circle-back-button2";

const CriarEvento = () => {
    const [formData, setFormData] = useState({
        titulo: "",
        distancia: "",
        dificuldade: "",
        descricao: "",
        cep: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        imagem: null,
        trilha: null,
        pdf: null
    });

    // Estados para controlar os popups
    const [showPopupSucesso, setShowPopupSucesso] = useState(false);
    const [showPopupErro, setShowPopupErro] = useState(false);
    const [mensagemErro, setMensagemErro] = useState("");

    const navigate = useNavigate();
    const { usuario } = useAuth(); // pegando usuário logado

    const handleBackToCatalog = () => {
        navigate(routeUrls.CATALOGO_TRILHAS_ADM);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        let newValue = value;
        if (name === "cep") newValue = maskCep(value);
        if (name === "distancia") newValue = maskDistancia(value);

        setFormData({
            ...formData,
            [name]: files && files.length > 0 ? files[0] : newValue,
        });
    };

    const handleCepBlur = async () => {
        const cep = formData.cep.replace(/\D/g, "");
        if (cep.length === 8) {
            try {
                const data = await buscarCep(cep);
                setFormData((prev) => ({
                    ...prev,
                    rua: data.logradouro || "",
                    bairro: data.bairro || "",
                    cidade: data.localidade || "",
                    estado: data.uf || ""
                }));
            } catch (err) {
                setMensagemErro(err.message);
                setShowPopupErro(true);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!usuario || !usuario.id) {
            setMensagemErro("Usuário não logado. Faça login novamente.");
            setShowPopupErro(true);
            return;
        }

        // Passando o ID do usuário logado como responsável
        const sucesso = await cadastrarEvento(formData, navigate, usuario.id);
        
        if (sucesso) {
            setShowPopupSucesso(true);
        } else {
            setMensagemErro("Erro ao cadastrar evento. Tente novamente.");
            setShowPopupErro(true);
        }
    };

    return (
        <div className="criar-evento-page">
            <div className="criar-evento-container">
                <Header />
                <div className="div-title">
                    <div className="editar-evento-header">
                        <ButtonBack onClick={handleBackToCatalog} />
                        <h1 className="h1-title">Criar Evento</h1>
                    </div>
                </div>
                <form className="evento-form" onSubmit={handleSubmit}>
                    <label>
                        Título do Evento:
                        <input
                            type="text"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            required
                            placeholder="Digite o título do evento"
                        />
                    </label>

                    <label>
                        Imagem do Evento:
                        <label htmlFor="upload-input" style={{ cursor: 'pointer' }}>
                            <div className="upload-box">
                                {formData.imagem ? (
                                    <img
                                        src={URL.createObjectURL(formData.imagem)}
                                        alt="Pré-visualização"
                                        className="preview-img"
                                    />
                                ) : (
                                    <div className="upload-placeholder">
                                        <FaCloudUploadAlt size={50} color="#0C513F" />
                                        <p>Clique ou arraste uma imagem aqui</p>
                                    </div>
                                )}
                            </div>
                        </label>
                        <input
                            type="file"
                            id="upload-input"
                            name="imagem"
                            onChange={handleChange}
                            accept="image/*"
                            style={{ display: "none" }}
                        />
                    </label>

                    <div className="linha-dupla">
                        <label>
                            Distância:
                            <input
                                type="text"
                                name="distancia"
                                value={formData.distancia}
                                onChange={handleChange}
                                placeholder="Ex: 10 km"
                            />
                        </label>

                        <label>
                            Dificuldade:
                            <select
                                name="dificuldade"
                                value={formData.dificuldade}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecione...</option>
                                <option value="EXPLORADOR">EXPLORADOR</option>
                                <option value="AVENTUREIRO">AVENTUREIRO</option>
                                <option value="DESBRAVADOR">DESBRAVADOR</option>
                            </select>
                        </label>
                    </div>

                    <label>
                        Mapa da Trilha (.gpx):
                        <label htmlFor="upload-trilha-input" style={{ cursor: 'pointer' }}>
                            <div className="upload-box-trilha">
                                {formData.trilha ? (
                                    <div className="trilha-preview">
                                        <p>{formData.trilha.name}</p>
                                    </div>
                                ) : (
                                    <div className="upload-placeholder">
                                        <FaCloudUploadAlt size={30} color="#0C513F" />
                                        <p>Clique ou arraste o arquivo .gpx aqui</p>
                                    </div>
                                )}
                            </div>
                        </label>
                        <input
                            type="file"
                            id="upload-trilha-input"
                            name="trilha"
                            onChange={handleChange}
                            accept=".gpx"
                            style={{ display: "none" }}
                        />
                    </label>

                    <label>
                        Instruções da Trilha em PDF:
                        <label htmlFor="upload-pdf-input" style={{ cursor: 'pointer' }}>
                            <div className="upload-box-trilha">
                                {formData.pdf ? (
                                    <div className="trilha-preview">
                                        <p>{formData.pdf.name}</p>
                                    </div>
                                ) : (
                                    <div className="upload-placeholder">
                                        <FaCloudUploadAlt size={30} color="#0C513F" />
                                        <p>Clique ou arraste o arquivo PDF aqui</p>
                                    </div>
                                )}
                            </div>
                        </label>
                        <input
                            type="file"
                            id="upload-pdf-input"
                            name="pdf"
                            onChange={handleChange}
                            accept=".pdf"
                            style={{ display: "none" }}
                        />
                    </label>

                    <label>
                        Descrição do Evento:
                        <textarea
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                        />
                    </label>

                    <div className="linha-dupla">
                        <label>
                            CEP:
                            <input
                                type="text"
                                name="cep"
                                value={formData.cep}
                                onChange={handleChange}
                                onBlur={handleCepBlur}
                            />
                        </label>

                        <label>
                            Avenida/Rua:
                            <input
                                type="text"
                                name="rua"
                                value={formData.rua}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div className="linha-dupla">
                        <label>
                            Número:
                            <input
                                type="text"
                                name="numero"
                                value={formData.numero}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            Complemento:
                            <input
                                type="text"
                                name="complemento"
                                value={formData.complemento}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div className="linha-tripla">
                        <label>
                            Bairro:
                            <input
                                type="text"
                                name="bairro"
                                value={formData.bairro}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            Cidade:
                            <input
                                type="text"
                                name="cidade"
                                value={formData.cidade}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            Estado:
                            <input
                                type="text"
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div className="botoes">
                        <ButtonCancelarEvento title={"Cancelar"} />
                        <ButtonSubmitForm title={"Criar evento"} type="submit" />
                    </div>
                </form>

                {/* Popup de sucesso */}
                {showPopupSucesso && (
                    <PopUpOk
                        title="Sucesso!"
                        message="Evento cadastrado com sucesso!"
                        onConfirm={() => {
                            setShowPopupSucesso(false);
                            navigate(routeUrls.CATALOGO_TRILHAS_ADM);
                        }}
                    />
                )}

                {/* Popup de erro */}
                {showPopupErro && (
                    <PopUpErro
                        title="Erro!"
                        message={mensagemErro}
                        onConfirm={() => setShowPopupErro(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default CriarEvento;
