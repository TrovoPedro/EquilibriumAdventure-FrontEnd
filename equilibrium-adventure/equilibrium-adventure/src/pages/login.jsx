import React from 'react';
import Forms from '../components/forms/forms';
import './login.css';
import routeUrls from "../routes/routeUrls"
import { redirect } from 'react-router-dom';

const Login = () => {
    const title = "Log In";
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submit de login', {
            email: e.target.email.value,
            senha: e.target.senha.value
        });
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-image-side">
                    <div className="overlay">
                        <div className="image-text">
                            <h2>A Equilibrium Adventure está pronta para te ajudar</h2>
                            <p>Entre na aventura e comece a gerenciar suas próximas aventuras</p>
                        </div>
                    </div>
                </div>
                
                <div className="login-form-side">
                    <div className="form-wrapper">
                        <div className="login-header">
                            <span className="welcome-text">Bem-vindo de volta à</span>
                            <h1>Equilibrium Adventure</h1>
                        </div>
                        
                        <Forms 
                            title={title} 
                            handleSubmit={handleSubmit} 
                        />
                        <span className='footer-text'>Ainda não tem conta? <label onClick={redirect(routeUrls.HOME)}></label></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;