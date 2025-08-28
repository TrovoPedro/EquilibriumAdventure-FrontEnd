import React from 'react';
import Forms from '../../components/forms/forms';
import './login.css';
import routeUrls from "../../routes/routeUrls"
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const title = "LOG IN";
    const text = "Cadastre-se";
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const credentials = {
            email: e.target.email.value,
            senha: e.target.senha.value
        };

        try {
            const usuario = await loginUsuario(credentials);

            login(usuario);

            if (usuario.tipoUsuario === "ADMIN") {
                navigate(routeUrls.CRIAR_EVENTO);
            } else if (usuario.tipoUsuario === "AVENTUREIRO") {
                navigate(routeUrls.ESCOLHER_GUIA);
            } else {
                navigate("/");
            }

        } catch (error) {
            alert("Credenciais inválidas ou erro no servidor!");
            console.error(error);
        }
    };

    const handleNavigate = () => {
        navigate(routeUrls.CADASTRO);
    }

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

                    <Forms title={title} handleSubmit={handleSubmit} handleNavigate={handleNavigate} text={text} className="forms-custom" />
                </div>
            </div>

            <button className="chat-floating" aria-hidden>💬</button>
        </div>
    );
};

export default Login;