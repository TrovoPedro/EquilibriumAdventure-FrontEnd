import React, { useState } from 'react';
import Forms from '../../components/forms/forms';
import './login.css';
import routeUrls from "../../routes/routeUrls";
import { useNavigate } from 'react-router-dom';
import { loginUsuario, buscarInformacoesPerfil } from '../../services/api';
import { buscarNivelPerfil } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useScore } from "../../context/ScoreContext";
import PopUpErro from '../../components/pop-up-erro/pop-up-erro.jsx';
import PopUpOk from '../../components/pop-up-ok/pop-up-ok.jsx';

const Login = () => {
  const navigate = useNavigate();
  const title = "LOG IN";
  const text = "Cadastre-se";
  const { login } = useAuth();
  const { salvarPontuacao } = useScore();
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (formData) => {
    const credentials = {
      email: formData.email,
      senha: formData.senha
    };

    try {
      const usuario = await loginUsuario(credentials);
      login(usuario);
      // Salva navegação pendente, mostra popup e só navega após confirmação
      let nextRoute = null;
      if (usuario.tipoUsuario === "ADMINISTRADOR" || usuario.tipoUsuario === "GUIA") {
        nextRoute = routeUrls.CATALOGO_TRILHAS_ADM;
      } else if (usuario.tipoUsuario === "AVENTUREIRO" && usuario.primeiraVez) {
        nextRoute = routeUrls.QUESTIONARIO;
      } else if (usuario.tipoUsuario === "AVENTUREIRO" && !usuario.primeiraVez) {
        try {
          const informacoes = await buscarInformacoesPerfil(usuario.id);
          const nivel = await buscarNivelPerfil(usuario.id);
          if (nivel.nivel) {
            salvarPontuacao(nivel.nivel);
            nextRoute = routeUrls.ESCOLHER_GUIA;
          } else {
            nextRoute = routeUrls.QUESTIONARIO;
          }
        } catch (error) {
          nextRoute = routeUrls.QUESTIONARIO;
        }
      }
      
      navigate(nextRoute);
    } catch (error) {
      setErrorMessage('Credenciais inválidas ou erro no servidor!');
      setShowErrorPopup(true);
    }
  };

  const handleNavigate = () => {
    navigate(routeUrls.CADASTRO);
  };

  return (
    <div className="login-page">

      {showErrorPopup && (
        <PopUpErro
          title="Erro no login!"
          message={errorMessage}
          onConfirm={() => {
            setShowErrorPopup(false);
            setErrorMessage('');
          }}
        />
      )}
      <div className="login-left">
        <div className="login-left-content">
          <div className="text-wrap">
            <h2>A Equilibrium Adventure está pronta para te ajudar</h2>
            <p>Escreva as suas credenciais para acessar suas próximas aventuras</p>
          </div>
        </div>
      </div>

      <div className="login-right">
        <button
          className="close-btn"
          aria-label="Fechar"
          onClick={() => navigate(routeUrls.HOME)}
        >
          ✕
        </button>

        <div className="auth-card">
          <div className="login-header">
            <span className="welcome-text">Bem-vindo de volta à</span>
            <h1>Equilibrium Adventure</h1>
          </div>

          <Forms
            title={title}
            handleSubmit={handleSubmit}
            handleNavigate={handleNavigate}
            text={text}
            className="forms-custom"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;