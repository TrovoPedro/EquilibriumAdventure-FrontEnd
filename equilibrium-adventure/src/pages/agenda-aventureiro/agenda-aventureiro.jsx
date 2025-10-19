import React, { useState, useEffect } from "react";
import "./agenda-aventureiro.css";
import defaultAvatar from "../../assets/imagem-do-usuario-grande.png";
import Trilha from "../../assets/cachoeiralago.jpg";
import Header from "../../components/header/header-unified";
import ButtonSubmitForm from "../../components/button-padrao/button-submit-form";
import ButtonDangerForm from "../../components/button-padrao/button-danger-form";
import ButtonBack from "../../components/circle-back-button2/circle-back-button2";
import { useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";
import { buscarInscricoesPorUsuario } from "../../services/apiAventureiro";
import { buscarImagemUsuario } from "../../services/apiUsuario";
import { useAuth } from "../../context/AuthContext";

const CriarAgendaAventureiro = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const idUsuario = usuario?.id;
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [agenda, setAgenda] = useState([]);
  const tipoUsuario = usuario?.tipoUsuario;
  const nomeUsuario = usuario?.nome;

  const handleBack = () => navigate(-1);

  useEffect(() => {
    // Busca avatar
    const buscaImagem = async () => {
      if (!idUsuario) return;
      const url = await buscarImagemUsuario(idUsuario);
      setAvatarUrl(url);
    };
    buscaImagem();
  }, [idUsuario]);

  useEffect(() => {
    // Busca agenda futura
    const carregarAgenda = async () => {
      if (!idUsuario) return;
      try {
        const data = await buscarInscricoesPorUsuario(idUsuario);
        // Mapeia arrays para objetos legíveis
        const agendaFormatada = data.map(item => ({
          nomeEvento: item[0] || "Sem nome",
          dataAtivacao: item[1] || null
        }));
        console.log("Inscrições recebidas: ", agendaFormatada);
        setAgenda(agendaFormatada);
      } catch (error) {
        console.error("Erro ao buscar inscrições:", error);
      }
    };
    carregarAgenda();
  }, [idUsuario]);

  const formatarData = (dataString) => {
    if (!dataString) return "";
    const data = new Date(dataString); // transforma ISO string em Date
    if (isNaN(data)) return ""; // evita NaN
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <>
      <Header />
      <div className="agenda-aventureiro-container">

        <div className="agenda-aventureiro-cards">
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
                <ButtonSubmitForm
                  title="Mais Informações"
                  type="button"
                  onClick={() => navigate(routeUrls.INFORMACOES_PESSOAIS)}
                />
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

        {/* Agenda futura dinâmica */}
        <div className="agenda-aventureiro-section">
          <div className="agenda-aventureiro-card-agenda">
            <h3 className="agenda-aventureiro-card-title">Minha Agenda</h3>
            <div className="agenda-aventureiro-list">
              {agenda.length > 0 ? (
                agenda.map((item, index) => (
                  <div key={index} className="agenda-aventureiro-item">
                    <div className="agenda-aventureiro-item-info">
                      <span className="agenda-aventureiro-item-name">{item.nomeEvento}</span>
                      <span className="agenda-aventureiro-item-date">{formatarData(item.dataAtivacao)}</span>
                    </div>
                    <div className="agenda-aventureiro-item-actions">
                      <ButtonSubmitForm title="Mais Informações" type="button" />
                      <ButtonDangerForm title="Cancelar Inscrição" type="button" />
                    </div>
                  </div>
                ))
              ) : (
                <p>Nenhum evento futuro encontrado.</p>
              )}
            </div>
          </div>
        </div>

        {/* Histórico estático */}
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
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default CriarAgendaAventureiro;
