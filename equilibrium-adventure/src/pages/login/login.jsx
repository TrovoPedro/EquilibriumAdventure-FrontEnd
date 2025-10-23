import React, { useState } from 'react';
import Forms from '../../components/forms/forms';
import './login.css';
import routeUrls from "../../routes/routeUrls";
import { useNavigate } from 'react-router-dom';
import { loginUsuario, buscarInformacoesPerfil } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useScore } from "../../context/ScoreContext";
import PopUpOk from '../../components/pop-up-ok/pop-up-ok';
import PopUpErro from '../../components/pop-up-erro/pop-up-erro';

const Login = () => {
  const navigate = useNavigate();
  const title = "LOG IN";
  const text = "Cadastre-se";
  const { login } = useAuth();
  const { salvarPontuacao } = useScore();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pendingNavigation, setPendingNavigation] = useState(null);

  const handleSubmit = async (formData) => {
    const credentials = {
      email: formData.email,
      senha: formData.senha
    };

    try {
      const usuario = await loginUsuario(credentials);
      login(usuario);

      if (usuario.tipoUsuario === "AVENTUREIRO" && !usuario.primeiraVez) {
        try {
        console.log(usuario.id);
          const informacoes = await buscarInformacoesPerfil(usuario.id);
          console.log("Informações do perfil:", informacoes);

          if (informacoes && informacoes.nivel) {
            salvarPontuacao(informacoes.nivel);
            console.log("Nível carregado:", informacoes.nivel);
          } else {
            console.log("Usuário sem nível registrado ainda (primeiro login).");
          }
        } catch (error) {
          console.warn("Erro ao carregar o nível do usuário:", error);
        }
      }

      // Determinar para onde navegar baseado no tipo de usuário
      let navigationRoute;
      if (usuario.tipoUsuario === "ADMINISTRADOR" || usuario.tipoUsuario === "GUIA") {
        navigationRoute = routeUrls.CATALOGO_TRILHAS_ADM;
      } else if (usuario.tipoUsuario === "AVENTUREIRO" && usuario.primeiraVez) {
        navigationRoute = routeUrls.QUESTIONARIO;
      } else if (usuario.tipoUsuario === "AVENTUREIRO" && !usuario.primeiraVez) {
        navigationRoute = routeUrls.ESCOLHER_GUIA;
      }

      // Salvar a rota e mostrar pop-up de sucesso
      setPendingNavigation(navigationRoute);
      setShowSuccessPopup(true);

    } catch (error) {
      setErrorMessage(error.erro || "Credenciais inválidas ou erro no servidor!");
      setShowErrorPopup(true);
      console.error(error);
    }
  };

  const handleNavigate = () => {
    navigate(routeUrls.CADASTRO);
  };

  return (
    <div className="login-page">
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

      {showSuccessPopup && (
        <PopUpOk 
          title="Login realizado!"
          message="Bem-vindo de volta! Redirecionando..."
          onConfirm={() => {
            setShowSuccessPopup(false);
            if (pendingNavigation) {
              navigate(pendingNavigation);
            }
          }}
        />
      )}
      
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
    </div>
  );
};

export default Login;
