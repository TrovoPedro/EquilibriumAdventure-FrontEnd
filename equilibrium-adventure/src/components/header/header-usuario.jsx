import React from "react";
import { useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";
import "./header.css";
import img from "../../assets/mulher1.jpeg";


const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left" onClick={() => navigate(routeUrls.INFOS_ADICIONAIS_GUIA)}>
        <img
          src={img}
          alt="Usuário"
          className="header-avatar"
        />
      </div>

      <nav className="header-center">
        <ul>
          <li onClick={() => navigate(routeUrls.CATALOGO_TRILHA)}>HOME</li>
          <li>MAIS PESQUISADOS</li>
          <li>TRILHAS</li>
        </ul>
      </nav>

      <div className="header-right">
        <button className="agendar" onClick={() => navigate(routeUrls.AGENDA)}>AGENDA</button>
        <button className="sair" onClick={() => {
          logout(); // limpa usuário do contexto + localStorage
          navigate(routeUrls.HOME);
        }}>SAIR</button>
      </div>
    </header>
  );
};

export default Header;
