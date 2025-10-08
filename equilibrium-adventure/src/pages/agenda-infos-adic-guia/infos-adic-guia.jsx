import React, { useState } from "react";
import "./infos-adic-guia.css";
import Header from "../../components/header/header-unified";
import Beneficiario from "../../assets/beneficiario.png";
import Trilha from "../../assets/cachoeiralago.jpg";
import ButtonAlterar from "../../components/button-padrao/button-alterar"
import Evento1 from "../../assets/cachoeiralago.jpg";
import Evento2 from "../../assets/chile.jpg";
import Evento3 from "../../assets/img12-catalogo.jpg";
import EscolhaDataCard from "../escolher-data/escolher-data";
import ButtonBack from "../../components/circle-back-button2/circle-back-button2";
import { useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";

const CriarInformacoesAdicionaisGuia = (title, onClick) => {
    const [showEscolherData, setShowEscolherData] = useState(false);
    const titulo = "Salvar Alterações";
    const redirect = useNavigate();

    const handleBack = () => {
        redirect(-1); // Volta para a página anterior
    };

    const handleOnClickRelatorio = () => {
       redirect(routeUrls.RELATORIO_ANAMNESE);
    }

    const handleOnClickMaisInfo = () => {
         redirect(routeUrls.INSCRICAO_TRILHAS);
    }

    const handleOnClickCard = () => {
         redirect(routeUrls.DADOS_CLIENTE);
    }

    const handleEditInfo = () => {
        redirect(routeUrls.INFORMACOES_PESSOAIS);
    }

    const scrollLeft = (containerId) => {
        const container = document.querySelector(`.${containerId}`);
        if (container) {
            container.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = (containerId) => {
        const container = document.querySelector(`.${containerId}`);
        if (container) {
            container.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    return (
    <>
      <Header />
      <div className="infos-adic-guia-page">
        <div className="home-container">
        <div className="cards-father">
            <div className="card-info-guia">
                <div className="info-pessoais-header">
                    <ButtonBack onClick={handleBack} />
                    <h2>Informações Pessoais</h2>
                </div>
                <div className="personal-info-card">
                    <div className="user-photo">
                        <img src={Beneficiario} alt="Foto do usuário"/>
                    </div>
                    <div className="user-info-content">
                        <div className="user-info">
                            <h3>Edgar de Mendonça Oliveira</h3>
                            <span className="user-role">Administrador</span>
                        </div>
                        <button className="edit-info-btn" onClick={handleEditInfo}>Editar Informações</button>
                    </div>
                </div>
            </div>
            <div className="card-imagem">
                <h2>Próximo Evento</h2>
                <div className="next-event-card">
                    <img src={Trilha} alt="EVENTO"/>
                </div>
            </div>
        </div>
        <div className="cards-eventos">
            <div className="eventos-anamnese-ativos">
                <h2>Próximas Anamneses</h2>
                <div className="anamneses-container">
                    <button className="nav-arrow nav-left" onClick={() => scrollLeft('anamneses-cards')}>‹</button>
                    
                    <div className="anamneses-cards">
                        <div className="anamnese-card">
                            <div className="anamnese-info" onClick={() => handleOnClickCard()}>
                                <div className="anamnese-initial" style={{ backgroundColor: "#9c27b0" }}>
                                    C
                                </div>
                                <div className="anamnese-details">
                                    <span className="anamnese-date">Oct 15 , 10:00</span>
                                    <h4>Carolina Andrade</h4>
                                </div>
                            </div>
                            <button className="anamnese-relatorio-btn" onClick={handleOnClickRelatorio}>
                                Relatório
                            </button>
                        </div>

                        <div className="anamnese-card">
                            <div className="anamnese-info" onClick={() => handleOnClickCard()}>
                                <div className="anamnese-initial" style={{ backgroundColor: "#26c6da" }}>
                                    J
                                </div>
                                <div className="anamnese-details">
                                    <span className="anamnese-date">Oct 18 , 11:30</span>
                                    <h4>João Ribeiro</h4>
                                </div>
                            </div>
                            <button className="anamnese-relatorio-btn" onClick={handleOnClickRelatorio}>
                                Relatório
                            </button>
                        </div>

                        <div className="anamnese-card">
                            <div className="anamnese-info" onClick={() => handleOnClickCard()}>
                                <div className="anamnese-initial" style={{ backgroundColor: "#f44336" }}>
                                    L
                                </div>
                                <div className="anamnese-details">
                                    <span className="anamnese-date">Oct 20 , 12:00</span>
                                    <h4>Leandro Alves</h4>
                                </div>
                            </div>
                            <button className="anamnese-relatorio-btn" onClick={handleOnClickRelatorio}>
                                Relatório
                            </button>
                        </div>
                    </div>
                    
                    <button className="nav-arrow nav-right" onClick={() => scrollRight('anamneses-cards')}>›</button>
                </div>
                
                <div className="filtro-button-data">
                    <button
                        className="button-add-data"
                        onClick={() => setShowEscolherData(true)}
                    >
                        Adicionar datas
                    </button>
                </div>
            </div>

            <div className="eventos-anamnese-ativos">
                <h2>Eventos Ativos</h2>
                <div className="eventos-container">
                    <button className="nav-arrow nav-left" onClick={() => scrollLeft('eventos-cards')}>‹</button>
                    
                    <div className="eventos-cards">
                        <div className="evento-ativo-card">
                            <div className="evento-image">
                                <img src={Evento1} alt="EVENTO"/>
                            </div>
                            <div className="evento-info">
                                <span className="evento-date">Nov 13 , 17:00</span>
                                <h4>Cachoeira</h4>
                                <button onClick={() => handleOnClickMaisInfo()} className="evento-info-btn">
                                    Mais Informações
                                </button>
                            </div>
                        </div>

                        <div className="evento-ativo-card">
                            <div className="evento-image">
                                <img src={Evento2} alt="EVENTO"/>
                            </div>
                            <div className="evento-info">
                                <span className="evento-date">Nov 19 , 14:30</span>
                                <h4>Montanha</h4>
                                <button onClick={() => handleOnClickMaisInfo()} className="evento-info-btn">
                                    Mais Informações
                                </button>
                            </div>
                        </div>

                        <div className="evento-ativo-card ">
                            <div className="evento-image">
                                <img src={Evento3} alt="EVENTO"/>
                            </div>
                            <div className="evento-info">
                                <span className="evento-date">Nov 24 , 18:00</span>
                                <h4>Trilha</h4>
                                <button onClick={() => handleOnClickMaisInfo()} className="evento-info-btn">
                                    Mais Informações
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <button className="nav-arrow nav-right" onClick={() => scrollRight('eventos-cards')}>›</button>
                </div>
            </div>
        </div>
        {showEscolherData && (
            <EscolhaDataCard
                onClose={() => setShowEscolherData(false)}
                fkAventureiro={null}
            />
        )}
      </div>
      </div>
    </>
    )
}
export default CriarInformacoesAdicionaisGuia