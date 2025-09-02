import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";
import "./header.css";
import img from "../../assets/beneficiario.png";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-left" onClick={() => navigate(routeUrls.HOME)}>
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
          <li onClick={() => navigate(routeUrls.SOBRE)}>DASHBOARD</li>
          <li onClick={() => navigate(routeUrls.CONTATO)}>NOVO GUIA</li>
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
          <li onClick={() => { setMenuOpen(false); navigate(routeUrls.SOBRE); }}>DASHBOARD</li>
          <li onClick={() => { setMenuOpen(false); navigate(routeUrls.CONTATO); }}>NOVO GUIA</li>
        </ul>
      </nav>

      <div className="header-right">
        <button className="agendar" onClick={() => navigate(routeUrls.AGENDA)}>AGENDA</button>
        <button className="sair" onClick={() => navigate(routeUrls.HOME)}>SAIR</button>
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
