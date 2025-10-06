import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";
import "./header.css";
import img from "../../assets/beneficiario.png";
import { useAuth } from "../../context/AuthContext"; // ajuste o caminho conforme sua pasta
import { useScore } from "../../context/ScoreContext";
import { useGuia } from "../../context/ChoiceGuiaContext";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const { resetarPontuacao } = useScore();
  const { resetarChoiceGuia } = useGuia();

  const { usuario, logout } = useAuth(); // pega o usuário e logout do contexto
  const tipoUsuario = usuario?.tipoUsuario; // se não existir usuario, fica undefined

  const resetarDados = () => {
    resetarPontuacao(); // Reseta pontuação e nível do aventureiro
    resetarChoiceGuia(); // Reseta escolha do guia
  };

  return (
    <header className="header">
      <div className="header-left" onClick={() => navigate(routeUrls.INFOS_ADICIONAIS_GUIA)}>
        <img
          src={img}
          alt="Usuário"
          className="header-avatar"
        />
      </div>

      <nav className={`header-center ${menuOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => navigate(routeUrls.CATALOGO_TRILHAS_ADM)}>HOME</li>
          <li onClick={() => navigate(routeUrls.CRIAR_EVENTO)}>CRIAR EVENTO</li>
          <li onClick={() => navigate('/dashboard')}>DASHBOARD</li>

          {/* Só aparece se for ADMINISTRADOR */}
          {tipoUsuario === "ADMINISTRADOR" && (
            <li onClick={() => navigate(routeUrls.ADICIONAR_GUIA)}>NOVO GUIA</li>
          )}
        </ul>
      </nav>

      <nav className={`header-side-menu ${menuOpen ? "open" : ""}`}>
        <button
          className="close-menu"
          aria-label="Fechar menu"
          onClick={() => setMenuOpen(false)}
        >✕</button>
        <ul>
          <li onClick={() => { setMenuOpen(false); navigate(routeUrls.HOME); }}>HOME</li>
          <li onClick={() => { setMenuOpen(false); navigate(routeUrls.CRIAR_EVENTO); }}>CRIAR EVENTO</li>
          <li onClick={() => { setMenuOpen(false); navigate('/dashboard'); }}>DASHBOARD</li>

          {/* Só aparece se for ADMINISTRADOR */}
          {tipoUsuario === "ADMINISTRADOR" && (
            <li onClick={() => { setMenuOpen(false); navigate(routeUrls.ADICIONAR_GUIA); }}>NOVO GUIA</li>
          )}
        </ul>
      </nav>

      <div className="header-right">
        <button className="agendar" onClick={() => navigate(routeUrls.INFOS_ADICIONAIS_GUIA)}>AGENDA</button>
        <button
          className="sair"
          onClick={() => {
            logout(); // limpa usuário do contexto + localStorage
            navigate(routeUrls.HOME);
            resetarDados(); // reseta pontuação e escolha do guia
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
