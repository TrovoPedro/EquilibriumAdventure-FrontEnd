import React from 'react';
import Forms from '../../components/forms/forms';
import './cadastro.css';
import routeUrls from "../../routes/routeUrls"
import { useNavigate } from 'react-router-dom';

const Cadastro = () => {
    const navigate = useNavigate();
    const title = "CADASTRAR";
    const text = "Entre aqui";
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submit de login', {
            email: e.target.email.value,
            senha: e.target.senha.value
        });
    };

    const handleNavigate = () => {
        navigate(routeUrls.LOGIN);
    }

    return (
        <div className="login-page">
            <div className="login-left">
                <div className="login-left-content">
                    <div className="text-wrap">
                        <h2>A Equilibrium Adventure está pronta para te ajudar</h2>
                        <p>Escolha a melhor forma para cadastro e encontre sua próxima aventura</p>
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
                        <h1>Junte-se e conecte-se à </h1>
                        <h1>comunidade online</h1>
                    </div>

                    <Forms title={title} handleSubmit={handleSubmit} text={text} handleNavigate={handleNavigate} className="forms-custom" />
                </div>
            </div>

            <button className="chat-floating" aria-hidden>💬</button>
        </div>
    );
};

export default Cadastro;