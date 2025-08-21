import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import routeUrls from "../../routes/routeUrls";
import Header from "../../components/header/header";
import "./criar-evento.css";

const CriarEvento = () => {
    const navigate = useNavigate();
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

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Evento criado:", formData);
        navigate(routeUrls.HOME);
    };

    return (
        <body>

            <div className="criar-evento-container">
                <Header></Header>
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
                            <input
                                type="text"
                                name="dificuldade"
                                value={formData.dificuldade}
                                onChange={handleChange}
                                placeholder="Ex: Explorador"
                            />
                        </label>
                    </div>

                    <label>
                        Mapa da Trilha (.gpx)
                        <input
                            type="file"
                            name="trilha"
                            onChange={handleChange}
                            accept=".gpx"
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
                                placeholder="Ex: 12345-678"
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
                        <button type="button" className="btn-excluir">
                            Excluir Evento
                        </button>
                        <button type="submit" className="btn-salvar">
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </body>
    );
};

export default CriarEvento;
