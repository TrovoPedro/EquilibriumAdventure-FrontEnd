import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import Header from "../../components/header/header-unified";
import { maskCep, maskDistancia } from "../../utils/masks";
import { scrollToTop } from "../../utils/scrollToTop";
import { cadastrarEvento, buscarCep, editarEvento } from "../../services/chamadasAPIEvento";
import "./editar-evento.css";
import ButtonCancelarEvento from "../../components/button-eventos/button-cancelar-evento";
import ButtonSubmitForm from "../../components/button-padrao/button-submit-form";
import ButtonBack from "../../components/circle-back-button2/circle-back-button2";
import routeUrls from "../../routes/routeUrls";
import { buscarImagemEvento } from "../../services/apiEvento";
import { buscarDadosEvento, buscarenderecoEvento } from "../../services/chamadasAPIEvento";

const EditarEvento = () => {
    const [formData, setFormData] = useState({
        titulo: "",
        distancia: "",
        dificuldade: "",
        descricao: "",
        endereco: {
            id: null,
            cep: "",
            rua: "",
            numero: "",
            complemento: "",
            bairro: "",
            cidade: "",
            estado: ""
        },
        imagem: null,
        trilha: null
    });

    const [eventoId, setEventoId] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const { id } = useParams();

    useEffect(() => {
        const loadEventoData = async () => {
            if (id) {
                try {
                    const eventoData = await buscarDadosEvento({ id });
                    if (eventoData) {
                        // Armazenar o ID do evento
                        setEventoId(eventoData.id_evento || id);

                        setFormData({
                            titulo: eventoData.nome || "",
                            distancia: eventoData.distancia_km ? `${eventoData.distancia_km} km` : "",
                            dificuldade: eventoData.nivel_dificuldade || "",
                            descricao: eventoData.descricao || "",
                            endereco: {
                                id: eventoData.endereco || null,
                                cep: "",
                                rua: "",
                                numero: "",
                                complemento: "",
                                bairro: "",
                                cidade: "",
                                estado: ""
                            },
                            imagem: null,
                            trilha: null
                        });

                        // Buscar dados do endereço após carregar dados do evento
                        if (eventoData.endereco) {
                            try {
                                const enderecoData = await buscarenderecoEvento(eventoData.endereco);
                                if (enderecoData) {
                                    setFormData((prev) => ({
                                        ...prev,
                                        endereco: {
                                            id: eventoData.endereco,
                                            rua: enderecoData.rua || "",
                                            numero: enderecoData.numero || "",
                                            complemento: enderecoData.complemento || "",
                                            bairro: enderecoData.bairro || "",
                                            cidade: enderecoData.cidade || "",
                                            estado: enderecoData.estado || "",
                                            cep: enderecoData.cep || ""
                                        }
                                    }));
                                }
                            } catch (error) {
                                console.error("Erro ao carregar dados do endereço:", error);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Erro ao carregar dados do evento:", error);
                }
            }
        };

        let generatedUrl = null;
        const loadImagemEvento = async () => {
            if (id) {
                try {
                    const imgUrl = await buscarImagemEvento(id); // returns object URL string or null
                    if (imgUrl) {
                        generatedUrl = imgUrl;
                        setFormData((prev) => ({
                            ...prev,
                            imagem: imgUrl
                        }));
                        setPreviewUrl(imgUrl);
                    }
                } catch (error) {
                    console.error("Erro ao carregar imagem do evento:", error);
                }
            }
        };

        loadImagemEvento();
        loadEventoData();

        return () => {
            // Revoke any object URL we created to avoid memory leaks
            if (generatedUrl) {
                try {
                    URL.revokeObjectURL(generatedUrl);
                } catch (e) {
                    // ignore
                }
            }
            // Revoke preview created from file input if any
            if (previewUrl && typeof previewUrl === 'string') {
                try {
                    URL.revokeObjectURL(previewUrl);
                } catch (e) {
                    // ignore
                }
            }
        };
    }, [id]);

    const navigate = useNavigate();

    useEffect(() => {
        // Rola para o topo da página quando o componente é montado
        scrollToTop();
    }, []);

    const handleBack = () => {
        navigate(routeUrls.CATALOGO_TRILHAS_ADM);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        let newValue = value;

        if (name === "cep") newValue = maskCep(value);
        if (name === "distancia") newValue = maskDistancia(value);

        // Campos do endereço
        const enderecoFields = ['cep', 'rua', 'numero', 'complemento', 'bairro', 'cidade', 'estado'];

        if (enderecoFields.includes(name)) {
            setFormData({
                ...formData,
                endereco: {
                    ...formData.endereco,
                    [name]: newValue
                }
            });
        } else {
            // If user selected an image file, create a preview URL
            if (name === 'imagem' && files && files[0]) {
                // revoke previous preview if present
                if (previewUrl) {
                    try { URL.revokeObjectURL(previewUrl); } catch (e) { }
                }
                const file = files[0];
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
                setFormData({
                    ...formData,
                    imagem: file
                });
            } else {
                setFormData({
                    ...formData,
                    [name]: files ? files[0] : newValue,
                });
            }
        }
    };

    const handleCepBlur = async () => {
        const cep = formData.endereco.cep.replace(/\D/g, "");
        if (cep.length === 8) {
            try {
                const data = await buscarCep(cep);
                setFormData((prev) => ({
                    ...prev,
                    endereco: {
                        ...prev.endereco,
                        rua: data.logradouro || "",
                        bairro: data.bairro || "",
                        cidade: data.localidade || "",
                        estado: data.uf || ""
                    }
                }));
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!eventoId || !formData.endereco.id) {
            alert("Erro: IDs do evento ou endereço não encontrados.");
            return;
        }

        try {
            const eventoParaEditar = {
                nome: formData.titulo,
                descricao: formData.descricao,
                nivel_dificuldade: formData.dificuldade,
                distancia_km: parseFloat(formData.distancia),
                endereco: {
                    id: formData.endereco.id,
                    rua: formData.endereco.rua,
                    numero: formData.endereco.numero,
                    complemento: formData.endereco.complemento,
                    bairro: formData.endereco.bairro,
                    cidade: formData.endereco.cidade,
                    estado: formData.endereco.estado,
                    cep: formData.endereco.cep
                },
                trilha: formData.trilha,
                imagem: formData.imagem
            };

            // Debug: mostrar payload e ids antes de enviar
            console.log('editarEvento payload:', eventoParaEditar);
            console.log('eventoId:', eventoId, 'enderecoId:', formData.endereco.id);

            const resultado = await editarEvento(eventoParaEditar, eventoId);

            alert("Evento editado com sucesso!");
            navigate(routeUrls.CATALOGO_TRILHAS_ADM);
        } catch (error) {
            console.error("Erro ao editar evento:", error);
            alert("Erro ao editar evento. Tente novamente.");
        }
    };

    return (
        <div className="criar-evento-page">
            <div className="criar-evento-container">
                <Header />
                <div className="div-title">
                    <div className="editar-evento-header">
                        <ButtonBack onClick={handleBack} />
                        <h1 className="h1-title">Editar Evento</h1>
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
                        <div
                            className="upload-box"
                            onClick={() => document.getElementById("upload-input").click()}
                        >
                            {formData.imagem ? (
                                <img
                                    src={previewUrl || (typeof formData.imagem === 'string' ? formData.imagem : null)}
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
                                value={formData.endereco.cep}
                                onChange={handleChange}
                                onBlur={handleCepBlur}
                            />
                        </label>

                        <label>
                            Avenida/Rua:
                            <input
                                type="text"
                                name="rua"
                                value={formData.endereco.rua}
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
                                value={formData.endereco.numero}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            Complemento:
                            <input
                                type="text"
                                name="complemento"
                                value={formData.endereco.complemento}
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
                                value={formData.endereco.bairro}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            Cidade:
                            <input
                                type="text"
                                name="cidade"
                                value={formData.endereco.cidade}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            Estado:
                            <input
                                type="text"
                                name="estado"
                                value={formData.endereco.estado}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div className="botoes">
                        <ButtonCancelarEvento title={"Cancelar"}></ButtonCancelarEvento>
                        <ButtonSubmitForm title={"Salvar Alterações"} type="submit"></ButtonSubmitForm>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarEvento;
