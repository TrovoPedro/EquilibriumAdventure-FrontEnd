import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import routeUrls from "../../routes/routeUrls";
import Header from "../../components/header/header";
import { maskCep, maskDistancia } from "../../utils/masks";
import { cadastrarEvento, buscarCep } from "../../api/chamadasAPIEvento";
import "./criar-evento.css";
import ButtonCancelarEvento from "../../components/button-eventos/button-cancelar-evento";
import ButtonCriarEvento from "../../components/button-eventos/button-criar-evento";

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
        trilha: null
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        let newValue = value;

        if (name === "cep") newValue = maskCep(value);
        if (name === "distancia") newValue = maskDistancia(value);

        setFormData({
            ...formData,
            [name]: files ? files[0] : newValue,
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
                alert(err.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const evento = {
            nome: formData.titulo,
            descricao: formData.descricao,
            nivel_dificuldade: formData.dificuldade,
            distancia_km: parseFloat(formData.distancia),
            responsavel: 1,
            endereco: 1,
            caminho_arquivo_evento: formData.trilha ? formData.trilha.name : null
        };

        const form = new FormData();
        form.append("evento", JSON.stringify(evento));
        if (formData.imagem) {
            form.append("imagem", formData.imagem);
        }

        await cadastrarEvento(form, navigate);
    };

    return (
        <div className="criar-evento-page">
            <div className="criar-evento-container">
                <Header />
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
                                    <FaCloudUploadAlt size={50} color="#0C513F" />
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
                        <div
                            className="upload-box"
                            onClick={() => document.getElementById("upload-trilha-input").click()}
                        >
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
                        <ButtonCancelarEvento title={"Cancelar criação"}></ButtonCancelarEvento>
                        <ButtonCriarEvento title={"Salvar evento"}></ButtonCriarEvento>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CriarEvento;
