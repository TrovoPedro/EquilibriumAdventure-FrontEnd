import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './ver-guias.css';
import '../../components/pop-up-aviso/pop-up-aviso.css';
import { buscarGuiasAdm, buscarGuiaPorId, deletarGuia } from "../../services/apiAdministrador";
import leftArrow from "../../assets/left-arrow-green.png";
import Header from "../../components/header/header-unified";
import { useGuide } from "../../context/GuideContext";
import routeUrls from "../../routes/routeUrls";
import PopUpAviso from "../../components/pop-up-aviso/pop-up-aviso";
import PopUpOk from "../../components/pop-up-ok/pop-up-ok";
import PopUpErro from "../../components/pop-up-erro/pop-up-erro";
import { showWarning } from "../../utils/swalHelper";

// Componente para popup de confirmação customizado
const PopupConfirmacao = ({ guiaNome, onConfirm, onCancel }) => {
    useEffect(() => {
        // Usa o helper padronizado para warnings (inclui showCloseButton)
        showWarning(
            `Você não poderá reverter esta ação! O guia "${guiaNome}" será removido permanentemente.`,
            'Tem certeza?',
            'Sim, remover!',
            'Cancelar',
            true
        ).then((result) => {
            if (result.isConfirmed) {
                onConfirm();
            } else {
                onCancel();
            }
        });
    }, [guiaNome, onConfirm, onCancel]);

    return null;
};

const VerGuias = () => {

    const [guias, setGuias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [guiaToDelete, setGuiaToDelete] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
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
        const guia = guias.find(g => g.idUsuario === guiaId);
        setGuiaToDelete({ id: guiaId, nome: guia?.nome || 'Guia' });
        setShowConfirmPopup(true);
    };

    const confirmarRemocaoGuia = async () => {
        setShowConfirmPopup(false);
        
        try {
            console.log("🗑️ Iniciando remoção do guia:", guiaToDelete.id);
            console.log("🔗 URL da chamada:", `/administrador/deletar-guia/${guiaToDelete.id}`);
            
            const response = await deletarGuia(guiaToDelete.id);
            
            console.log("✅ Resposta da API:", response);
            console.log("📊 Status da resposta:", response?.status);
            
            // Remove o guia da lista local
            setGuias(prevGuias => prevGuias.filter(guia => guia.idUsuario !== guiaToDelete.id));
            
            // Mostra popup de sucesso
            setShowSuccessPopup(true);
            setGuiaToDelete(null);
            
            console.log("🎉 Guia removido com sucesso da lista local");
        } catch (error) {
            console.error("❌ Erro completo ao deletar guia:", error);
            console.error("📋 Detalhes do erro:", {
                message: error.message,
                response: error.response,
                status: error.response?.status,
                data: error.response?.data
            });
            setErrorMessage(error.message || 'Erro ao remover guia');
            setShowErrorPopup(true);
            setGuiaToDelete(null);
        }
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
            
            {/* Popup de Confirmação para Deletar */}
            {showConfirmPopup && (
                <PopupConfirmacao
                    guiaNome={guiaToDelete?.nome}
                    onConfirm={confirmarRemocaoGuia}
                    onCancel={() => {
                        setShowConfirmPopup(false);
                        setGuiaToDelete(null);
                    }}
                />
            )}

            {/* Popup de Sucesso */}
            {showSuccessPopup && (
                <PopUpOk
                    title="Guia Removido!"
                    message="O guia foi removido com sucesso!"
                    onConfirm={() => setShowSuccessPopup(false)}
                />
            )}

            {/* Popup de Erro */}
            {showErrorPopup && (
                <PopUpErro
                    title="Erro ao Remover"
                    message={errorMessage}
                    onConfirm={() => {
                        setShowErrorPopup(false);
                        setErrorMessage('');
                    }}
                />
            )}
        </>
    );
};

export default VerGuias;