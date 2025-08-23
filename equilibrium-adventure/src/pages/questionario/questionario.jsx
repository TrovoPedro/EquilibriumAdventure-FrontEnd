import React, { useState } from 'react';
import './questionario.css';
import ButtonQuest from '../../components/button-questionario/button-questionario';

const Questionario = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [answers, setAnswers] = useState({});
    const [titleButton, setTitleButton] = useState('Próxima Questão');

    const questions = [
        {
            id: 1,
            title: 'Questão 1',
            question: 'Qual é o tipo de ambiente em que você se sente mais confortável ao fazer trilhas?',
            options: [
                'Florestas ou trilhas sombreadas',
                'Montanhas ou terrenos elevados',
                'Áreas costeiras ou praias',
                'Diversificados'
            ]
        },
        {
            id: 2,
            title: 'Questão 2',
            question: 'Qual é o tipo de ambiente em que você se sente mais confortável ao fazer trilhas?',
            options: [
                'Florestas ou trilhas sombreadas',
                'Montanhas ou terrenos elevados',
                'Áreas costeiras ou praias',
                'Diversificados'
            ]
        },
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
        },
        {
            id: 4,
            title: 'Questão 4',
            question: 'Qual é o tipo de ambiente em que você se sente mais confortável ao fazer trilhas?',
            options: [
                'Florestas ou trilhas sombreadas',
                'Montanhas ou terrenos elevados',
                'Áreas costeiras ou praias',
                'Diversificados'
            ]
        }
    ];


    const handleOnClickNext = () => {
        if (!selectedOption) {
            alert('Por favor, selecione uma opção antes de prosseguir.');
            return;
        }

        // Salvar a resposta atual
        setAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: selectedOption
        }));

        // Verificar se é a última questão
        if (currentQuestionIndex === 11) {
            // Aqui você pode implementar a lógica para salvar no banco
            handleSubmitAnswers();
            return;
        }

        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption('');

        // Atualizar título do botão na penúltima questão
        if (currentQuestionIndex === 10) {
            setTitleButton('Finalizar');
        }
    };

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    // Navegar diretamente para uma questão específica
    const handleNavigatorClick = (index) => {
        if (Object.keys(answers).length >= index) {
            setCurrentQuestionIndex(index);
            setSelectedOption(answers[index] || '');
            setTitleButton(index === 11 ? 'Finalizar' : 'Próxima Questão');
        } else {
            alert('Por favor, responda as questões em ordem.');
        }
    };

    return (
        <div className="questionario-wrapper">
            <div className="questionario-container">
                <div className="questionario-content">
                    <h2>Questão {currentQuestionIndex + 1}</h2>
                    <p className="question-text">{questions[currentQuestionIndex].question}</p>

                    <div className="options-container">
                        {questions[currentQuestionIndex].options.map((option, index) => (
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

                    <ButtonQuest title={titleButton} onClick={handleOnClickNext} />
                </div>

                <div className="question-navigator">
                    <h3>Navegador de Perguntas</h3>
                    <div className="navigator-grid">
                        {[...Array(12)].map((_, index) => (
                            <button
                                key={index}
                                className={`navigator-button ${answers[index] ? 'answered' : ''} ${currentQuestionIndex === index ? 'active' : ''}`}
                                onClick={() => handleNavigatorClick(index)}
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