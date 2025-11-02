import Forms from '../../components/forms/forms';
import './cadastro.css';
import routeUrls from "../../routes/routeUrls"
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { cadastrarUsuario } from '../../services/api';
import { validateUserData } from '../../utils/validators';
import PopUpOk from '../../components/pop-up-ok/pop-up-ok';
import PopUpErro from '../../components/pop-up-erro/pop-up-erro';
import Swal from 'sweetalert2';

const Cadastro = () => {
    const navigate = useNavigate();
    const title = "CADASTRAR";
    const text = "Entre aqui";
    const [error, setError] = useState(null);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    // função que realiza o envio real (mantive a lógica existente)
    const submitForm = async (formData) => {
        const errors = validateUserData(formData);

        if (Object.keys(errors).length > 0) {
            setErrorMessage(Object.values(errors).join("\n"));
            setShowErrorPopup(true);
            return false;
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
            setShowSuccessPopup(true);
            // Redirecionamento automático após 1.5 segundos
            setTimeout(() => {
                setShowSuccessPopup(false);
                navigate(routeUrls.LOGIN);
            }, 1500);
            return true;
        } catch (error) {
            setError(error.erro || 'Erro ao realizar cadastro');
            setErrorMessage(error.erro || 'Erro ao realizar cadastro');
            setShowErrorPopup(true);
            return false;
        }
    };

    // wrapper que previne envios duplicados
    const handleSubmit = async (formData) => {
        if (isSubmitting) return; // já está enviando
        setIsSubmitting(true);
        try {
            const success = await submitForm(formData);
            // se houve erro, libera para nova tentativa; se sucesso, mantemos isSubmitting
            if (!success) setIsSubmitting(false);
        } catch (err) {
            // em caso de erro inesperado, libera o botão
            setIsSubmitting(false);
            throw err;
        }
    };

    const handleNavigate = () => {
        navigate(routeUrls.LOGIN);
    }

    useEffect(() => {
        if (showSuccessPopup) {
            Swal.fire({
                title: 'Cadastro realizado!',
                text: 'Sua conta foi criada com sucesso! Redirecionando para o login...',
                icon: 'success',
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                timer: 1500,
                customClass: {
                    confirmButton: 'swal2-confirm'
                },
                buttonsStyling: false
            });
        }
    }, [showSuccessPopup]);

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

                    <Forms title={title} handleSubmit={handleSubmit} text={text} handleNavigate={handleNavigate} className="forms-custom" isSubmitting={isSubmitting} />
                </div>
            </div>

            
            {showErrorPopup && (
                <PopUpErro 
                    title="Erro no cadastro!"
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

export default Cadastro;