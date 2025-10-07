import React from 'react';
import Forms from '../../components/forms/forms';
import './login.css';
import routeUrls from "../../routes/routeUrls";
import { useNavigate } from 'react-router-dom';
import { loginUsuario, getInformacoesPerfil } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useScore } from "../../context/ScoreContext";

const Login = () => {
  const navigate = useNavigate();
  const title = "LOG IN";
  const text = "Cadastre-se";
  const { login } = useAuth();
  const { salvarPontuacao } = useScore();

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
          const informacoes = await getInformacoesPerfil(usuario.id);
          console.log("Informações do perfil:", informacoes);

          if (informacoes && informacoes.Nivel) {
            salvarPontuacao(0, informacoes.Nivel);
            console.log("Nível carregado:", informacoes.Nivel);
          } else {
            console.log("Usuário sem nível registrado ainda (primeiro login).");
          }
        } catch (error) {
          console.warn("Erro ao carregar o nível do usuário:", error);
        }
      }

      if (usuario.tipoUsuario === "ADMINISTRADOR" || usuario.tipoUsuario === "GUIA") {
        navigate(routeUrls.CATALOGO_TRILHAS_ADM);
      } else if (usuario.tipoUsuario === "AVENTUREIRO" && usuario.primeiraVez) {
        navigate(routeUrls.QUESTIONARIO);
      } else if (usuario.tipoUsuario === "AVENTUREIRO" && !usuario.primeiraVez) {
        navigate(routeUrls.ESCOLHER_GUIA);
      }

    } catch (error) {
      alert("Credenciais inválidas ou erro no servidor!");
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
    </div>
  );
};

export default Login;
