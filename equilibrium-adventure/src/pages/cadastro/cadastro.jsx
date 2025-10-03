import Forms from '../../components/forms/forms';
import './cadastro.css';
import routeUrls from "../../routes/routeUrls"
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { cadastrarUsuario } from '../../services/api';
import { validateUserData } from '../../utils/validators';

const Cadastro = () => {
    const navigate = useNavigate();
    const title = "CADASTRAR";
    const text = "Entre aqui";
    const [error, setError] = useState(null);

    const handleSubmit = async (formData) => {
        const errors = validateUserData(formData);

        if (Object.keys(errors).length > 0) {
            alert(Object.values(errors).join("\n"));
            return;
        }
        
        const userData = {
            nome: formData.username,
            email: formData.email,
            telefone_contato: formData.telefone,
            senha: formData.senha,
            descricao_guia: null,
            tipo_usuario: "AVENTUREIRO"
        };

        try {
            await cadastrarUsuario(userData);
            alert('Cadastro realizado com sucesso!');
            navigate(routeUrls.LOGIN);
        } catch (error) {
            setError(error.erro || 'Erro ao realizar cadastro');
            alert(error.erro || 'Erro ao realizar cadastro');
        }
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

        </div>
    );
};

export default Cadastro;