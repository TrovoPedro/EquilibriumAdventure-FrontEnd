import React, { useState } from 'react';
import './forms.css';
import ButtonAuth from '../button-auth/button-auth';
import { useLocation } from 'react-router-dom';
import olhoAberto from '../../assets/olho-aberto.png';
import olhoFechado from '../../assets/olho-fechado.png';
import { maskTelefone } from '../../utils/maskTelefone';
import { validatePhone } from '../../utils/validatePhone';

const Forms = ({ title, handleSubmit, text, handleNavigate, isSubmitting = false }) => {
    const location = useLocation();
    const [phoneError, setPhoneError] = useState('');
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

        let newValue = value;


        if (name === "telefone") {
            const validation = validatePhone(value);
            if (!validation.isValid) {
                setPhoneError(validation.error);
                // Usa o valor truncado retornado pela validação
                newValue = validation.value;
            } else {
                setPhoneError('');
                newValue = maskTelefone(value);
            }
        }

        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : newValue
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
                        className={phoneError ? 'error' : ''}
                        required
                    />
                    {phoneError && <span className="error-message">{phoneError}</span>}
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
                    <span className="checkbox-text">
                        Concordo com os{' '}
                        <a 
                            onClick={(e) => {
                                e.preventDefault();
                                const link = document.createElement('a');
                                link.href = '/termos_uso_equilibrium_adventure_v2.pdf';
                                link.download = 'Termos-de-Uso.pdf';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            style={{
                                color: '#226144',
                                textDecoration: 'underline',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Termos e Condições
                        </a>
                    </span>
                </label>
            </>
        );
    };

    return (
        <form className='forms' onSubmit={(e) => {
            e.preventDefault();
            if (isSubmitting) return; // previne envios duplicados
            handleSubmit(formData);
        }}>
            {renderFormFields()}
            <div className='forms-footer'>
                <span>
                    {path.toLowerCase() === '/login' ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'}
                    <button type="button" className='button-cad' onClick={handleNavigate}>{text}</button>
                </span>
                <ButtonAuth type="submit" title={title} disabled={isSubmitting} />
            </div>
        </form>
    );

};

export default Forms;