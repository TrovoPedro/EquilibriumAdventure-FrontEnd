import React from "react";
import { useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";
import "./header.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left" onClick={() => navigate(routeUrls.HOME)}>
        <img 
          src="/path/para/foto.jpg" 
          alt="Usuário" 
          className="header-avatar" 
        />
      </div>

      <nav className="header-center">
        <ul>
          <li onClick={() => navigate(routeUrls.HOME)}>HOME</li>
          <li onClick={() => navigate(routeUrls.CRIAR_EVENTO)}>CRIAR EVENTO</li>
          <li onClick={() => navigate(routeUrls.SOBRE)}>DASHBOARD</li>
          <li onClick={() => navigate(routeUrls.CONTATO)}>NOVO GUIA</li>
        </ul>
      </nav>

      <div className="header-right">
        <button className="agendar" onClick={() => navigate(routeUrls.AGENDA)}>AGENDA</button>
        <button className="sair" onClick={() => navigate(routeUrls.CONTATO)}>SAIR</button>
      </div>
    </header>
  );
};

export default Header;
