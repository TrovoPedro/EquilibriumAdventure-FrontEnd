import React, { useState } from 'react';
import './forms.css';
import ButtonAuth from '../button-auth/button-auth';
import { useLocation } from 'react-router-dom';
import olhoAberto from '../../assets/olho-aberto.png';
import olhoFechado from '../../assets/olho-fechado.png';

const Forms = ({ title, handleSubmit, text, handleNavigate }) => {
    const location = useLocation();
    const path = location.pathname;
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        telefone: '',
        senha: '',
        rememberMe: false
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const renderFormFields = () => {
        if (path === '/login' || path === '/Login') {
            return (
                <>
                    <div className="forms">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="johndoe@email.com"
                            required
                        />
                    </div>

                    <div className="forms password-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="senha"
                            value={formData.senha}
                            onChange={handleChange}
                            placeholder="Senha"
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <img
                                src={showPassword ? olhoAberto : olhoFechado}
                                alt={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                className="eye-icon"
                            />
                        </button>
                    </div>
                </>
            );
        }

        return (
            <>
                <div className="forms">
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Nome"
                        required
                    />
                </div>

                <div className="forms">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="johndoe@email.com"
                        required
                    />
                </div>

                <div className="forms">
                    <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        placeholder="(xx) xxxxx-xxxx"
                        pattern="\(\d{2}\)\s\d{5}-\d{4}"
                        required
                    />
                </div>

                <div className="form password-group">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="senha"
                        value={formData.senha}
                        onChange={handleChange}
                        placeholder="Senha"
                        required
                    />
                    <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <img
                            src={showPassword ? olhoAberto : olhoFechado}
                            alt={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            className="eye-icon"
                        />
                    </button>
                </div>
                <label className="checkbox-container">
                    <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        required
                    />
                    <span className="checkbox-text">Concordo com os Termos e Condições</span>
                </label>
            </>
        );
    };

    return (
    <form className='forms' onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(formData);
    }}>
        {renderFormFields()}
        <div className='forms-footer'>
            <span>
                {path === '/login' ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'}
                <button type="button" className='button-cad' onClick={handleNavigate}>{text}</button>
            </span>
            <ButtonAuth type="submit" title={title} />
        </div>
    </form>
);

};

export default Forms;