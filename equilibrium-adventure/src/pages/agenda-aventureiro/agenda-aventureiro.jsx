import React, { useState, useEffect } from "react";
import "./agenda-aventureiro.css"
import Homem from "../../assets/homem2.jpeg";
import defaultAvatar from "../../assets/imagem-do-usuario-grande.png";
import Trilha from "../../assets/cachoeiralago.jpg";
import Header from "../../components/header/header-unified";
import ButtonSubmitForm from "../../components/button-padrao/button-submit-form";
import ButtonDangerForm from "../../components/button-padrao/button-danger-form";
import ButtonBack from "../../components/circle-back-button2/circle-back-button2";
import { useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";
import { buscarImagemUsuario } from "../../services/apiUsuario";
import { useAuth } from "../../context/AuthContext";

const CriarAgendaAventureiro = () => {
    const navigate = useNavigate();
    const { usuario, logout } = useAuth();
    const idUsuario = usuario?.id;
    const [avatarUrl, setAvatarUrl] = useState(null);
    const tipoUsuario = usuario?.tipoUsuario;
    const nomeUsuario = usuario?.nome;

    const handleBack = () => {
        redirect(-1);
    };

    useEffect(() => {
        const buscaImagem = async () => {
            if (!idUsuario) return;
            const url = await buscarImagemUsuario(idUsuario);
            setAvatarUrl(url);
        };

        buscaImagem();
    }, [idUsuario]);

    return (
        <>
            <Header />
            <div className="agenda-aventureiro-container">


                <div className="agenda-aventureiro-cards">
                    <div className="card-info-guia">
                        <div className="info-pessoais-header">
                            <ButtonBack onClick={() => navigate(routeUrls.CATALOGO_TRILHA)} />
                            <h2>Informações Pessoais</h2>
                        </div>
                        <div className="personal-info-card">
                            <div className="user-photo">
                                <img
                                    src={avatarUrl || defaultAvatar}
                                    alt="Imagem Usuário"
                                    onError={(e) => (e.target.src = defaultAvatar)}
                                />
                            </div>
                            <div className="user-info-content">
                                <div className="user-info">
                                    <h3>{nomeUsuario}</h3>
                                    <span className="user-role">{tipoUsuario}</span>
                                </div>
                                <ButtonSubmitForm title="Mais Informações" type="button" onClick={() => navigate(routeUrls.INFORMACOES_PESSOAIS)} />
                            </div>
                        </div>
                    </div>
                    <div className="card-imagem">
                        <h2>Próximo Evento</h2>
                        <div className="next-event-card">
                            <img src={Trilha} alt="EVENTO" />
                        </div>
                    </div>
                </div>

                <div className="agenda-aventureiro-section">
                    <div className="agenda-aventureiro-card-agenda">
                        <h3 className="agenda-aventureiro-card-title">Minha Agenda</h3>
                        <div className="agenda-aventureiro-list">
                            <div className="agenda-aventureiro-item">
                                <div className="agenda-aventureiro-item-info">
                                    <span className="agenda-aventureiro-item-name">Trilha da Cachoeira</span>
                                    <span className="agenda-aventureiro-item-date">15/10/2024</span>
                                </div>
                                <div className="agenda-aventureiro-item-actions">
                                    <ButtonSubmitForm title="Mais Informações" type="button" />
                                    <ButtonDangerForm title="Cancelar Inscrição" type="button" />
                                </div>
                            </div>

                            <div className="agenda-aventureiro-item">
                                <div className="agenda-aventureiro-item-info">
                                    <span className="agenda-aventureiro-item-name">Trilha das Montanhas</span>
                                    <span className="agenda-aventureiro-item-date">22/10/2024</span>
                                </div>
                                <div className="agenda-aventureiro-item-actions">
                                    <ButtonSubmitForm title="Mais Informações" type="button" />
                                    <ButtonDangerForm title="Cancelar Inscrição" type="button" />
                                </div>
                            </div>


                            <div className="agenda-aventureiro-item">
                                <div className="agenda-aventureiro-item-info">
                                    <span className="agenda-aventureiro-item-name">Conversa com Guia Carlos</span>
                                    <span className="agenda-aventureiro-item-date">05/11/2024</span>
                                </div>
                                <div className="agenda-aventureiro-item-actions">
                                    <ButtonSubmitForm title="Mais Informações" type="button" />
                                    <ButtonDangerForm title="Cancelar Conversa" type="button" />
                                </div>
                            </div>

                            <div className="agenda-aventureiro-item">
                                <div className="agenda-aventureiro-item-info">
                                    <span className="agenda-aventureiro-item-name">Conversa com Guia Ana</span>
                                    <span className="agenda-aventureiro-item-date">12/11/2024</span>
                                </div>
                                <div className="agenda-aventureiro-item-actions">
                                    <ButtonSubmitForm title="Mais Informações" type="button" />
                                    <ButtonDangerForm title="Cancelar Conversa" type="button" />
                                </div>
                            </div>

                            <div className="agenda-aventureiro-item">
                                <div className="agenda-aventureiro-item-info">
                                    <span className="agenda-aventureiro-item-name">Trilha Noturna</span>
                                    <span className="agenda-aventureiro-item-date">18/11/2024</span>
                                </div>
                                <div className="agenda-aventureiro-item-actions">
                                    <ButtonSubmitForm title="Mais Informações" type="button" />
                                    <ButtonDangerForm title="Cancelar Inscrição" type="button" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="agenda-aventureiro-historico">
                    <div className="agenda-aventureiro-historico-container">
                        <h3 className="agenda-aventureiro-card-title">Histórico</h3>
                        <div className="agenda-aventureiro-historico-list">
                            <div className="agenda-aventureiro-historico-item">
                                <div className="agenda-aventureiro-historico-info">
                                    <span className="agenda-aventureiro-item-name">Trilha dos Pinheiros</span>
                                    <span className="agenda-aventureiro-item-date">15/09/2024</span>
                                    <span className="agenda-aventureiro-item-guide">Guia: Pedro</span>
                                </div>
                            </div>

                            <div className="agenda-aventureiro-historico-item">
                                <div className="agenda-aventureiro-historico-info">
                                    <span className="agenda-aventureiro-item-name">Trilha da Serra</span>
                                    <span className="agenda-aventureiro-item-date">22/09/2024</span>
                                    <span className="agenda-aventureiro-item-guide">Guia: Pedro</span>
                                </div>
                            </div>

                            <div className="agenda-aventureiro-historico-item">
                                <div className="agenda-aventureiro-historico-info">
                                    <span className="agenda-aventureiro-item-name">Trilha do Vale</span>
                                    <span className="agenda-aventureiro-item-date">28/09/2024</span>
                                    <span className="agenda-aventureiro-item-guide">Guia: Pedro</span>
                                </div>
                            </div>

                            <div className="agenda-aventureiro-historico-item">
                                <div className="agenda-aventureiro-historico-info">
                                    <span className="agenda-aventureiro-item-name">Conversa sobre equipamentos</span>
                                    <span className="agenda-aventureiro-item-date">05/09/2024</span>
                                    <span className="agenda-aventureiro-item-guide">Guia: Ronaldo</span>
                                </div>
                            </div>

                            <div className="agenda-aventureiro-historico-item">
                                <div className="agenda-aventureiro-historico-info">
                                    <span className="agenda-aventureiro-item-name">Conversa sobre segurança</span>
                                    <span className="agenda-aventureiro-item-date">12/09/2024</span>
                                    <span className="agenda-aventureiro-item-guide">Guia: Ronaldo</span>
                                </div>
                            </div>

                            <div className="agenda-aventureiro-historico-item">
                                <div className="agenda-aventureiro-historico-info">
                                    <span className="agenda-aventureiro-item-name">Trilha da Pedra Grande</span>
                                    <span className="agenda-aventureiro-item-date">18/08/2024</span>
                                    <span className="agenda-aventureiro-item-guide">Guia: Ronaldo</span>
                                </div>
                            </div>

                            <div className="agenda-aventureiro-historico-item">
                                <div className="agenda-aventureiro-historico-info">
                                    <span className="agenda-aventureiro-item-name">Trilha do Rio</span>
                                    <span className="agenda-aventureiro-item-date">25/08/2024</span>
                                    <span className="agenda-aventureiro-item-guide">Guia: Pedro</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CriarAgendaAventureiro