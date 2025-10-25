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
import { buscarInscricoesPorUsuario, cancelarInscricao, buscarHistoricoPorUsuario } from "../../services/apiAventureiro";
import { buscarImagemUsuario } from "../../services/apiUsuario";
import { useAuth } from "../../context/AuthContext";
import { convertDateToBrazilian } from "../../utils/dateConversions";

const CriarAgendaAventureiro = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const idUsuario = usuario?.id;
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [agenda, setAgenda] = useState([]);
  const [historico, setHistorico] = useState([]);
  const tipoUsuario = usuario?.tipoUsuario;
  const nomeUsuario = usuario?.nome;

  const handleBack = () => navigate(-1);

  useEffect(() => {
    const buscaImagem = async () => {
      if (!idUsuario) return;
      const url = await buscarImagemUsuario(idUsuario);
      setAvatarUrl(url);
    };
    buscaImagem();
  }, [idUsuario]);

  useEffect(() => {
    const carregarAgenda = async () => {
      if (!idUsuario) return;
      try {
        const data = await buscarInscricoesPorUsuario(idUsuario);
        const agendaFormatada = data.map((item) => ({
          idEvento: item.idAtivacaoEvento,
          nomeEvento: item.nomeEvento ?? "Sem nome",
          // keep original string and format later to avoid timezone shifts
          dataAtivacao: item.dataAtivacao
        }));
        setAgenda(agendaFormatada);
      } catch (error) {
        console.error(error);
      }
    };
    carregarAgenda();
  }, [idUsuario]);

  useEffect(() => {
    const carregarHistorico = async () => {
      if (!idUsuario) return;
      try {
        const data = await buscarHistoricoPorUsuario(idUsuario);
        const historicoFormatado = data.map((item) => ({
          idEvento: item.idAtivacaoEvento,
          nomeEvento: item.nomeEvento ?? "Sem nome",
          dataAtivacao: item.dataAtivacao
        }));
        setHistorico(historicoFormatado);
      } catch (error) {
        console.error(error);
      }
    };
    carregarHistorico();
  }, [idUsuario]);

  const handleCancelar = async (idEvento) => {
    try {
      await cancelarInscricao(idUsuario, idEvento);
      setAgenda(prev => prev.filter(item => item.idEvento !== idEvento));
    } catch (error) {
      console.error(error);
      alert("Erro ao cancelar inscrição!");
    }
  };

  const formatarData = (dataString) => {
    return convertDateToBrazilian(dataString);
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
        </div>

        <div className="agenda-aventureiro-section">
          <div className="agenda-aventureiro-card-agenda">
            <h3 className="agenda-aventureiro-card-title">Minha Agenda</h3>
            <div className="agenda-aventureiro-list">
              {agenda.length > 0 ? (
                agenda.map((item) => (
                  <div key={item.idEvento} className="agenda-aventureiro-item">
                    <div className="agenda-aventureiro-item-info">
                      <span className="agenda-aventureiro-item-name">{item.nomeEvento}</span>
                      <span className="agenda-aventureiro-item-date">{formatarData(item.dataAtivacao)}</span>
                    </div>
                    <div className="agenda-aventureiro-item-actions">
                      <ButtonSubmitForm title="Mais Informações" type="button" />
                      <ButtonDangerForm
                        title="Cancelar Inscrição"
                        type="button"
                        onClick={() => handleCancelar(item.idEvento)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p>Nenhum evento futuro encontrado.</p>
              )}
            </div>
          </div>
        </div>

        <div className="agenda-aventureiro-historico">
          <div className="agenda-aventureiro-historico-container">
            <h3 className="agenda-aventureiro-card-title">Histórico</h3>
            <div className="agenda-aventureiro-historico-list">
              {historico.length > 0 ? (
                historico.map((item) => (
                  <div key={item.idEvento} className="agenda-aventureiro-historico-item">
                    <div className="agenda-aventureiro-historico-info">
                      <span className="agenda-aventureiro-item-name">{item.nomeEvento}</span>
                      <span className="agenda-aventureiro-item-date">{formatarData(item.dataAtivacao)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nenhum histórico encontrado.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CriarAgendaAventureiro;
