import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";
import "./header.css";
import imgAdmin from "../../assets/beneficiario.png";
import imgAventureiro from "../../assets/mulher1.jpeg";
import { useAuth } from "../../context/AuthContext";
import { useScore } from "../../context/ScoreContext";
import { useGuide } from "../../context/GuideContext";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { resetarPontuacao } = useScore();
  const { resetarEscolhaGuia } = useGuide();
  const { usuario, logout } = useAuth();
  const tipoUsuario = usuario?.tipoUsuario;

  const resetarDados = () => {
    resetarPontuacao();
    resetarEscolhaGuia();
  };

  // Configurações específicas para cada tipo de usuário
  const userConfigs = {
    ADMINISTRADOR: {
      avatar: imgAdmin,
      menuItems: [
        { label: "HOME", route: routeUrls.CATALOGO_TRILHAS_ADM },
        { label: "CRIAR EVENTO", route: routeUrls.CRIAR_EVENTO },
        { label: "DASHBOARD", route: routeUrls.SOBRE },
        { label: "NOVO GUIA", route: routeUrls.ADICIONAR_GUIA },
      ],
      agendaRoute: routeUrls.INFOS_ADICIONAIS_GUIA
    },
    GUIA: {
      avatar: imgAdmin,
      menuItems: [
        { label: "HOME", route: routeUrls.CATALOGO_TRILHAS_ADM },
        { label: "CRIAR EVENTO", route: routeUrls.CRIAR_EVENTO },
        { label: "DASHBOARD", route: routeUrls.SOBRE },
      ],
      agendaRoute: routeUrls.INFOS_ADICIONAIS_GUIA
    },
    AVENTUREIRO: {
      avatar: imgAventureiro,
      menuItems: [
        { label: "HOME", route: routeUrls.CATALOGO_TRILHA },
        { label: "MAIS PESQUISADOS", route: "#" },
        { label: "TRILHAS", route: "#" },
      ],
      agendaRoute: routeUrls.AGENDA_AVENTUREIRO
    }
  };

  // Pega a configuração do usuário atual ou usa a configuração do aventureiro como padrão
  const currentConfig = userConfigs[tipoUsuario] || userConfigs.AVENTUREIRO;

  return (
    <header className="header">
      <div className="header-left" onClick={() => navigate(currentConfig.agendaRoute)}>
        <img
          src={currentConfig.avatar}
          alt="Usuário"
          className="header-avatar"
        />
      </div>

      <nav className={`header-center ${menuOpen ? "open" : ""}`}>
        <ul>
          {currentConfig.menuItems.map((item, index) => (
            <li key={index} onClick={() => {
              setMenuOpen(false);
              navigate(item.route);
            }}>
              {item.label}
            </li>
          ))}
        </ul>
      </nav>

      {/* Menu lateral para mobile */}
      <nav className={`header-side-menu ${menuOpen ? "open" : ""}`}>
        <button
          className="close-menu"
          aria-label="Fechar menu"
          onClick={() => setMenuOpen(false)}
        >✕</button>
        <ul>
          {currentConfig.menuItems.map((item, index) => (
            <li key={index} onClick={() => {
              setMenuOpen(false);
              navigate(item.route);
            }}>
              {item.label}
            </li>
          ))}
        </ul>
      </nav>

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