import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";
import "./header.css";
import imgDefault from "../../assets/imagem-do-usuario.png";
import { useAuth } from "../../context/AuthContext";
import { useScore } from "../../context/ScoreContext";
import { useGuide } from "../../context/GuideContext";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
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

  // 🔹 Busca imagem do usuário logado ao carregar o Header
  useEffect(() => {
    const buscarImagemUsuario = async () => {
      if (!idUsuario) return;

      try {
        const response = await axios.get(
          `http://localhost:8080/informacoes/${idUsuario}/imagem`,
          { responseType: "blob" }
        );

        // Transforma blob em URL de imagem
        const imageUrl = URL.createObjectURL(response.data);
        setAvatarUrl(imageUrl);
      } catch (error) {
        console.error("Erro ao carregar imagem do usuário:", error);
        setAvatarUrl(null); // fallback padrão será usado
      }
    };

    buscarImagemUsuario();
  }, [idUsuario]);

  // Configurações específicas para cada tipo de usuário
  const userConfigs = {
    ADMINISTRADOR: {
      defaultAvatar: imgDefault,
      menuItems: [
        { label: "HOME", route: routeUrls.CATALOGO_TRILHAS_ADM },
        { label: "CRIAR EVENTO", route: routeUrls.CRIAR_EVENTO },
        { label: "DASHBOARD", route: routeUrls.DASHBOARD },
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
        { label: "MAIS PESQUISADOS", route: "#" },
        { label: "TRILHAS", route: "#" },
      ],
      agendaRoute: routeUrls.AGENDA_AVENTUREIRO,
    },
  };

  // Pega configuração do usuário atual ou usa a do aventureiro
  const currentConfig = userConfigs[tipoUsuario] || userConfigs.AVENTUREIRO;

  return (
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
  );
};

export default Header;