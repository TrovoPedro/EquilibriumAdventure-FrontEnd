import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";
import "./header.css";
import imgDefault from "../../assets/imagem-do-usuario.png";
import { useAuth } from "../../context/AuthContext";
import { useScore } from "../../context/ScoreContext";
import { useGuide } from "../../context/GuideContext";
import { buscarImagemUsuario } from "../../services/apiUsuario";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const { resetarPontuacao } = useScore();
  const { resetarEscolhaGuia } = useGuide();
  const { usuario, logout } = useAuth();
  const tipoUsuario = usuario?.tipoUsuario;
  const idUsuario = usuario?.id;

  const [avatarUrl, setAvatarUrl] = useState(null);

  const resetarDados = () => {
    resetarPontuacao();
    resetarEscolhaGuia();
  };

  useEffect(() => {
    const buscaImagemHeader = async () => {
      if (!idUsuario) return;
      const url = await buscarImagemUsuario(idUsuario);
      setAvatarUrl(url);
    };

    buscaImagemHeader();
  }, [idUsuario]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const userConfigs = {
    ADMINISTRADOR: {
      defaultAvatar: imgDefault,
      menuItems: [
        { label: "HOME", route: routeUrls.CATALOGO_TRILHAS_ADM },
        { label: "CRIAR EVENTO", route: routeUrls.CRIAR_EVENTO },
        { label: "DASHBOARD", route: routeUrls.DASHBOARD },
        { label: "VER GUIAS", route: routeUrls.VER_GUIAS },
        { label: "NOVO GUIA", route: routeUrls.ADICIONAR_GUIA },
      ],
      agendaRoute: routeUrls.INFOS_ADICIONAIS_GUIA,
    },
    GUIA: {
      defaultAvatar: imgDefault,
      menuItems: [
        { label: "HOME", route: routeUrls.CATALOGO_TRILHAS_ADM },
        { label: "CRIAR EVENTO", route: routeUrls.CRIAR_EVENTO },
        { label: "DASHBOARD", route: routeUrls.DASHBOARD },
      ],
      agendaRoute: routeUrls.INFOS_ADICIONAIS_GUIA,
    },
    AVENTUREIRO: {
      defaultAvatar: imgDefault,
      menuItems: [
        { label: "HOME", route: routeUrls.CATALOGO_TRILHA },
        { label: "ESCOLHER GUIA", route: routeUrls.ESCOLHER_GUIA },
      ],
      agendaRoute: routeUrls.AGENDA_AVENTUREIRO,
    },
  };

  // Em mobile, forçar header de GUIA para a tela Criar Evento; caso contrário utilizar o tipo real do usuário
  const effectiveTipo = isMobile && location?.pathname === routeUrls.CRIAR_EVENTO ? "GUIA" : tipoUsuario;
  const currentConfig = userConfigs[effectiveTipo] || userConfigs.AVENTUREIRO;

  // Para o menu lateral móvel, quando estivermos na página de criar evento, usar os mesmos itens
  // do catálogo de trilhas do guia (GUIA). Isso altera apenas o menu mobile.
  const mobileMenuItems = isMobile && location?.pathname === routeUrls.CRIAR_EVENTO
    ? userConfigs.GUIA.menuItems
    : currentConfig.menuItems;
  // detecta rota do relatório de anamnese para aplicar spacer específico
  const isRelatorioAnamnese = location?.pathname?.startsWith("/relatorio-anamnese");

  return (
    <>
      <header className="header">
      {/* 🖼️ Imagem do usuário */}
      <div className="header-left" onClick={() => navigate(currentConfig.agendaRoute)}>
        <img
          src={avatarUrl || currentConfig.defaultAvatar}
          alt="Usuário"
          className="header-avatar"
          onError={(e) => (e.target.src = currentConfig.defaultAvatar)}
        />
      </div>

      {/* 🧭 Menu principal */}
      <nav className={`header-center ${menuOpen ? "open" : ""}`}>
        <ul>
          {mobileMenuItems.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                setMenuOpen(false);
                navigate(item.route);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </nav>

      {/* 📱 Menu lateral (mobile) */}
      <nav className={`header-side-menu ${menuOpen ? "open" : ""}`}>
        <button
          className="close-menu"
          aria-label="Fechar menu"
          onClick={() => setMenuOpen(false)}
        >
          ✕
        </button>
        <ul>
          {currentConfig.menuItems.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                setMenuOpen(false);
                navigate(item.route);
              }}
            >
              {item.label}
            </li>
          ))}

          {/* Versão mobile: quando estiver no catálogo do guia, exibe botão AGENDA que leva para infos-adic-guia */}
          {(location?.pathname === routeUrls.CATALOGO_TRILHAS_ADM || location?.pathname === routeUrls.CRIAR_EVENTO) && (
            <li
              className="mobile-agenda"
              onClick={() => {
                setMenuOpen(false);
                navigate(routeUrls.INFOS_ADICIONAIS_GUIA);
              }}
            >
              AGENDA
            </li>
          )}

          {/* Versão mobile: quando estiver no catálogo do aventureiro, exibe botão AGENDA que leva para agenda-aventureiro */}
          {location?.pathname === routeUrls.CATALOGO_TRILHA && (
            <li
              className="mobile-agenda"
              onClick={() => {
                setMenuOpen(false);
                navigate(routeUrls.AGENDA_AVENTUREIRO);
              }}
            >
              AGENDA
            </li>
          )}

          {/* Botão de sair visível dentro do menu lateral (mobile) */}
          <li
            className="mobile-logout"
            onClick={() => {
              setMenuOpen(false);
              logout();
              navigate(routeUrls.HOME);
              resetarDados();
            }}
          >
            SAIR
          </li>
        </ul>
      </nav>

      {/* ⚙️ Botões da direita */}
      <div className="header-right">
        <button
          className="agendar"
          onClick={() => navigate(currentConfig.agendaRoute)}
        >
          AGENDA
        </button>
        <button
          className="sair"
          onClick={() => {
            logout();
            navigate(routeUrls.HOME);
            resetarDados();
          }}
        >
          SAIR
        </button>
      </div>

      {/* 🍔 Menu mobile */}
      <button
        className="hamburger-menu"
        aria-label="Abrir menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
      </button>
    </header>
      {/* Spacer visível apenas na rota de relatório de anamnese para evitar que o conteúdo fique abaixo do header fixo */}
      {isRelatorioAnamnese && <div className="header-spacer" aria-hidden="true" />}
    </>
  );
};

export default Header;