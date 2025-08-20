import React, { useState } from 'react';
import './forms.css';
import ButtonAuth from '../button-auth/button-auth';
import { useLocation } from 'react-router-dom';

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
        if (path === '/login') {
            return (
                <>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="johndoe@email.com"
                            required
                        />
                    </div>

                    <div className="form-group password-group">
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
                            {showPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                    </div>
                </>
            );
        }

        return (
            <>
                <div className="form-group">
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="johndoe@email.com"
                        required
                    />
                </div>

                <div className="form-group">
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

                <div className="form-group password-group">
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
                        {showPassword ? "👁️" : "👁️‍🗨️"}
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
        <form className='forms'>
            {renderFormFields()}
            <div className='forms-footer'>
                <span>
                    {path === '/login' ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'}
                    <button type="button" className='button-cad' onClick={handleNavigate}>{text}</button>
                </span>
                <ButtonAuth onClick={handleSubmit} title={title} />
            </div>
        </form>
    );
};

export default Forms;