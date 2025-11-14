import React, { useState, useEffect } from "react";
import "./infos-adic-guia.css";
import Header from "../../components/header/header-unified";
import { listarAnamnesesPorResponsavel } from "../../services/apiAnamnese";
import defaultAvatar from "../../assets/imagem-do-usuario-grande.png";
import EscolhaDataCard from "../escolher-data/escolher-data";
import ButtonBack from "../../components/circle-back-button2/circle-back-button2";
import { useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";
import { buscarImagemUsuario } from "../../services/apiUsuario";
import { useAuth } from "../../context/AuthContext";
import { buscarEventosAtivosPorGuia, buscarImagemEvento } from "../../services/apiEvento";
import catalogoFallback from "../../assets/img12-catalogo.jpg";

const CriarInformacoesAdicionaisGuia = (title, onClick) => {
    const [anamneses, setAnamneses] = useState([]);
    const [showEscolherData, setShowEscolherData] = useState(false);
    const titulo = "Salvar Alterações";
    const redirect = useNavigate();
    const { usuario, logout } = useAuth();
    const idUsuario = usuario?.id;
    const [avatarUrl, setAvatarUrl] = useState(null);
    const tipoUsuario = usuario?.tipoUsuario;
    const nomeUsuario = usuario?.nome;
    const [eventosAtivos, setEventosAtivos] = useState([]);
    const [proximoEvento, setProximoEvento] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleBack = () => {
        redirect(-1);
    };

    const handleOnClickRelatorio = () => {
        redirect(routeUrls.RELATORIO_ANAMNESE);
    }

    const handleOnClickMaisInfo = (idAtivacao = null, eventoId = null) => {
        // Se tivermos o id da ativação, redireciona para os detalhes do evento ativo
        if (idAtivacao) {
            sessionStorage.setItem('ativacaoSelecionadaId', idAtivacao);
            redirect(`/detalhes-evento/${idAtivacao}`);
            return;
        }

        // Caso não haja id da ativação, mas tenhamos o id do evento base, navegar para detalhes do evento (fallback)
        if (eventoId) {
            // alguns fluxos esperam o id do evento; tentamos passar via rota de detalhes por evento
            redirect(`/detalhes-evento/${eventoId}`);
            return;
        }

        // Default: ir para dados do guia se nada mais estiver disponível
        redirect(routeUrls.DADOS_GUIA);
    }

    const handleOnClickProximoEvento = () => {
        if (proximoEvento?.id_ativacao) {
            sessionStorage.setItem('ativacaoSelecionadaId', proximoEvento.id_ativacao);
            redirect(`/detalhes-evento/${proximoEvento.id_ativacao}`);
        }
    }

    const handleOnClickCard = () => {
        redirect(routeUrls.DADOS_CLIENTE);
    }

    const handleEditInfo = () => {
        // Redireciona para a tela de Dados do Guia (editar dados do guia)
        redirect(routeUrls.DADOS_GUIA);
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

    const scrollEventosLeft = () => {
        const container = document.querySelector('.eventos-cards');
        if (container) {
            container.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollEventosRight = () => {
        const container = document.querySelector('.eventos-cards');
        if (container) {
            container.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const carregarAnamneses = async () => {
                if (usuario?.id) {
                    try {
                        const lista = await listarAnamnesesPorResponsavel(usuario.id);
                        setAnamneses(lista);
                    } catch (error) {
                        setAnamneses([]);
                    }
                }
            };
        const buscaImagem = async () => {
            if (!idUsuario) return;
            const url = await buscarImagemUsuario(idUsuario);
            setAvatarUrl(url);
        };

        const carregarEventos = async () => {
            if (usuario?.id) {
                try {
                    const eventosData = await buscarEventosAtivosPorGuia(usuario.id);
                    
                    const eventosComImagens = await Promise.all(
                        eventosData.map(async (evento) => {
                            const imagemUrl = await buscarImagemEvento(evento.id_evento);
                            return { ...evento, imagemUrl: imagemUrl || catalogoFallback };
                        })
                    );

                    const eventosOrdenados = eventosComImagens.sort((a, b) => 
                        new Date(a.data_ativacao) - new Date(b.data_ativacao)
                    );

                    setEventosAtivos(eventosOrdenados);
                    setProximoEvento(eventosOrdenados[0] || null);
                } catch (error) {
                    setEventosAtivos([]);
                    setProximoEvento(null);
                }
            }
            setLoading(false);
        };

        buscaImagem();
        carregarEventos();
    carregarAnamneses();
    }, [idUsuario, usuario?.id]);

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
                                        <button className="edit-info-btn agenda-aventureiro-btn-info" onClick={handleEditInfo}>Editar Informações</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-imagem">
                            <h2>Próxima Trilha</h2>
                            <div className="next-event-card">
                                {loading ? (
                                    <>
                                        <img src={catalogoFallback} alt="Carregando..." />
                                        <div className="next-event-info">
                                            <span>Carregando...</span>
                                        </div>
                                    </>
                                ) : proximoEvento ? (
                                    <>
                                        <img 
                                            src={proximoEvento.imagemUrl || catalogoFallback} 
                                            alt={proximoEvento.nome_evento} 
                                            style={{ cursor: 'pointer' }} 
                                            onClick={handleOnClickProximoEvento} 
                                        />
                                        <div className="next-event-info">
                                            <h3>{proximoEvento.nome_evento}</h3>
                                            <span>{proximoEvento.data_ativacao.split('-').reverse().join('/')} às {proximoEvento.hora_inicio}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <img src={catalogoFallback} alt="Nenhum evento ativo" />
                                        <div className="next-event-info">
                                            <h3>Nenhum evento ativo</h3>
                                            <span>Não há eventos programados no momento</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="cards-eventos">
                        <div className="eventos-anamnese-ativos">
                            <h2>Próximas Anamneses</h2>
                            <div className="anamneses-container">
                                <button className="nav-arrow nav-left" onClick={() => scrollLeft('anamneses-cards')}>‹</button>

                                <div className="anamneses-cards">
                                    {anamneses.length > 0 ? (
                                        anamneses
                                            .filter(anamnese => {
                                                const dataAgendada = new Date(anamnese.dataDisponivel);
                                                const agora = new Date();
                                                // Só exibe se ainda não passou 1 hora da data/hora agendada
                                                return agora.getTime() <= dataAgendada.getTime() + 60 * 60 * 1000;
                                            })
                                            .map((anamnese, idx) => {
                                                const nome = anamnese.nomeAventureiro || "?";
                                                const inicial = nome.charAt(0).toUpperCase();
                                                const dataObj = new Date(anamnese.dataDisponivel);
                                                const dataFormatada = `${dataObj.toLocaleDateString()} , ${dataObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                                                const cores = ["#9c27b0", "#26c6da", "#f44336", "#ff9800", "#4caf50"];
                                                const handleRelatorioClick = () => {
                                                    sessionStorage.setItem('fkAventureiro', anamnese.fkAventureiro);
                                                    redirect(`/relatorio-anamnese/${anamnese.fkAventureiro}`);
                                                };
                                                return (
                                                    <div className="anamnese-card" key={`${anamnese.id}-${idx}`}>
                                                        <div className="anamnese-info" onClick={() => handleOnClickCard()}>
                                                            <div className="anamnese-initial" style={{ backgroundColor: cores[idx % cores.length] }}>
                                                                {inicial}
                                                            </div>
                                                            <div className="anamnese-details">
                                                                <span className="anamnese-date">{dataFormatada}</span>
                                                                <h4>{nome}</h4>
                                                            </div>
                                                        </div>
                                                        <button className="anamnese-relatorio-btn" onClick={handleRelatorioClick}>
                                                            Relatório
                                                        </button>
                                                    </div>
                                                );
                                            })
                                    ) : (
                                        <span className="no-events-text">Nenhuma anamnese encontrada.</span>
                                    )}
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
                                <button className="nav-arrow nav-left" onClick={scrollEventosLeft}>‹</button>

                                <div className="eventos-cards">
                                    {loading ? (
                                        <>
                                            <div className="evento-ativo-card">
                                                <div className="evento-image">
                                                    <img src={catalogoFallback} alt="Carregando..." />
                                                </div>
                                                <div className="evento-info">
                                                    <span className="evento-date">Carregando...</span>
                                                    <h4>Carregando...</h4>
                                                    <button className="evento-info-btn">Informações</button>
                                                </div>
                                            </div>
                                        </>
                                    ) : eventosAtivos.length > 0 ? (
                                        eventosAtivos.map((evento, idx) => (
                                            <div className="evento-ativo-card" key={`${evento.id_evento}-${evento.id_ativacao || idx}`}>
                                                <div className="evento-image" onClick={() => handleOnClickMaisInfo(evento.id_ativacao, evento.id_evento)} style={{ cursor: 'pointer' }}>
                                                    <img src={evento.imagemUrl || catalogoFallback} alt={evento.nome_evento} />
                                                </div>
                                                <div className="evento-info">
                                                    <span className="evento-date">
                                                        {evento.data_ativacao.split('-').reverse().join('/')} , {evento.hora_inicio}
                                                    </span>
                                                    <h4>{evento.nome_evento}</h4>
                                                    <button onClick={() => handleOnClickMaisInfo(evento.id_ativacao, evento.id_evento)} className="evento-info-btn">
                                                        Informações
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-eventos-message">
                                            <div className="evento-ativo-card">
                                                <div className="evento-image">
                                                    <img src={catalogoFallback} alt="Nenhum evento" />
                                                </div>
                                                <div className="evento-info">
                                                    <span className="evento-date">Sem eventos</span>
                                                    <h4>Nenhum evento ativo</h4>
                                                    <p>Não há eventos programados no momento</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button className="nav-arrow nav-right" onClick={scrollEventosRight}>›</button>
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