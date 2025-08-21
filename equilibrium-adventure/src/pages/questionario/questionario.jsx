import React, { useState } from 'react';
import './questionario.css';
import ButtonQuest from '../../components/button-questionario/button-questionario';

const Questionario = () => {
    const [selectedOption, setSelectedOption] = useState('');

    const questions = [
        {
            id: 3,
            title: 'Questão 3',
            question: 'Qual é o tipo de ambiente em que você se sente mais confortável ao fazer trilhas?',
            options: [
                'Florestas ou trilhas sombreadas',
                'Montanhas ou terrenos elevados',
                'Áreas costeiras ou praias',
                'Diversificados'
            ]
        }
    ];

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    return (
        <div className="questionario-wrapper">
            <div className="questionario-container">
                <div className="questionario-content">
                    <h2>{questions[0].title}</h2>
                    <p className="question-text">{questions[0].question}</p>

                    <div className="options-container">
                        {questions[0].options.map((option, index) => (
                            <label key={index} className="option-label">
                                <input
                                    type="radio"
                                    name="question"
                                    value={option}
                                    checked={selectedOption === option}
                                    onChange={() => handleOptionChange(option)}
                                />
                                <span className="option-text">{option}</span>
                            </label>
                        ))}
                    </div>

                    <ButtonQuest title="Próxima Questão" onClick={() => console.log('Próxima questão')} />
                </div>


                <div className="question-navigator">
                    <h3>Navegador de Perguntas</h3>
                    <div className="navigator-grid">
                        {[...Array(12)].map((_, index) => (
                            <button
                                key={index}
                                className="navigator-button"
                                onClick={() => console.log(`Questão ${index + 1}`)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
            );
};

            export default Questionario;