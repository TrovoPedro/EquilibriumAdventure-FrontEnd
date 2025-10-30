import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './ver-guias.css';
import { buscarGuiasAdm, buscarGuiaPorId } from "../../services/apiAdministrador";
import leftArrow from "../../assets/left-arrow-green.png";
import Header from "../../components/header/header-unified";
import { useGuide } from "../../context/GuideContext";
import routeUrls from "../../routes/routeUrls";

const VerGuias = () => {

    const [guias, setGuias] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { escolherGuia } = useGuide();

    useEffect(() => {
        const fetchGuias = async () => {
            try {
                console.log("Iniciando busca de guias...");
                const data = await buscarGuiasAdm();
                console.log("Dados recebidos da API:", data);
                
                // Verificar se data é um array
                if (Array.isArray(data)) {
                    setGuias(data);
                } else {
                    console.warn("Dados recebidos não são um array:", data);
                    setGuias([]);
                }
            } catch (error) {
                console.error("Erro ao buscar guias:", error);
                setGuias([]);
            } finally {
                setLoading(false);
            }
        };

        fetchGuias();
    }, []);

    const handleVoltar = () => {
        navigate(-1);
    };

    const handleVerMaisInfo = async (guia) => {
        try {
            console.log("Guia selecionado:", guia);
            
            const guiaId = guia.idUsuario;
            if (!guiaId) {
                console.error("ID do guia não encontrado:", guia);
                alert("Erro: ID do guia não encontrado");
                return;
            }
            
            console.log("Buscando informações do guia com ID:", guiaId);
            const dadosGuia = await buscarGuiaPorId(guiaId);
            console.log("Dados do guia encontrados:", dadosGuia);
            
            // Navegar para a tela de dados do guia, passando os dados via state
            navigate(routeUrls.DADOS_GUIA, { 
                state: { 
                    guiaData: dadosGuia,
                    guiaId: guiaId 
                } 
            });
        } catch (error) {
            console.error("Erro ao buscar dados do guia:", error);
            alert(`Erro ao carregar dados do guia: ${error.message || error}`);
        }
    };

    const handleRemoverGuia = (guiaId) => {
        console.log("Remover guia:", guiaId);
    };

    return (
        <>
            <Header></Header>
            <div className="ver-guias-container">
                <div className="ver-guias-header">
                    <span className="back-arrow-circle" onClick={handleVoltar}>
                        <img className="back-arrow" src={leftArrow} alt="Voltar" />
                    </span>
                    <h1 className="ver-guias-title">Ver Guias</h1>
                </div>
                <div className="ver-guias-body">
                    {loading ? (
                        <div className="loading">Carregando guias...</div>
                    ) : guias.length === 0 ? (
                        <div className="no-guides">Nenhum guia encontrado</div>
                    ) : (
                        guias.map((guia, index) => (
                            <div key={guia.idUsuario || index} className="ver-guias-item">
                                <div className="ver-guias-info">
                                    <span className="ver-guias-nome">{guia.nome || 'Nome não disponível'}</span>
                                </div>
                                <div className="ver-guias-btns">
                                    <div 
                                        className="ver-guias-btn-green"
                                        onClick={() => handleVerMaisInfo(guia)}
                                    >
                                        <span>Mais Informações</span>
                                    </div>
                                    <div 
                                        className="ver-guias-btn-red"
                                        onClick={() => handleRemoverGuia(guia.idUsuario)}
                                    >
                                        <span>Remover</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default VerGuias;