import React, { useState } from 'react';
import './forms.css';
import ButtonAuth from '../button-auth/button-auth';
import { useLocation } from 'react-router-dom';

const Forms = ({ title, handleSubmit }) => {
    const location = useLocation();
    const path = location.pathname;
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        telefone: '',
        senha: ''
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const renderFormFields = () => {
        if (path === '/login' || path === '/Login') {
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
            </>
        );
    };

    return (
        <form className='forms'>
            {renderFormFields()}
            <div className='forms-footer'>
                <span>
                    Ainda não tem conta?
                    <button type="button" className='button-cad'>Cadastre-se</button>
                </span>
                <ButtonAuth onClick={handleSubmit} title={title} />
            </div>
        </form>
    );
};

export default Forms;