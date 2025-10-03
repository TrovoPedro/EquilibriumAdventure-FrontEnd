import React, { useState, useEffect } from "react";
import "./questionario.css";
import ButtonQuest from "../../components/button-questionario/button-questionario";
import { getPerguntas, postRespostas, calcularNivel } from "../../services/apiAventureiro";
import { useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls"
import { useScore } from "../../context/ScoreContext";
import { useAuth } from "../../context/AuthContext";

const Questionario = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});
  const [titleButton, setTitleButton] = useState("Próxima Questão");
  const [loading, setLoading] = useState(true);
  const [nivel, setNivel] = useState(null);
  const { salvarPontuacao } = useScore();
  const { usuario } = useAuth();

  useEffect(() => {
    getPerguntas()
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar perguntas:", err);
        setLoading(false);
      });
  }, []);

  const handleSubmitAnswers = async () => {
    try {
      if (!usuario || !usuario.id) {
        alert("Por favor, faça login para enviar suas respostas.");
        return;
      }

      if (Object.keys(answers).length !== questions.length) {
        alert("Por favor, responda todas as questões antes de finalizar.");
        return;
      }

      const respostasParaEnviar = Object.entries(answers).map(([perguntaId, alternativa]) => ({
        usuarioId: usuario.id,
        perguntaId: Number(perguntaId),
        alternativaEscolhida: Number(alternativa)
      }));

      await postRespostas(respostasParaEnviar);

      try {
        const nivelCalculado = await calcularNivel(usuario.id);

        // Se for uma string (enum Nivel do backend), converte para minúsculo
        const nivelObtido = nivelCalculado.toLowerCase();
        setNivel(nivelObtido);
        

        alert(`Parabéns! Você foi classificado como: ${nivelObtido}`);

        salvarPontuacao(0, nivelObtido);

        navigate(routeUrls.ESCOLHER_GUIA, {
          state: { nivel: nivelObtido }
        });

        setAnswers({});
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setTitleButton("Próxima Questão");
      } catch (calcError) {
        console.error("Erro ao calcular nível:", calcError);
        
        // Verifica se é o erro específico de informações pessoais
        if (calcError.message?.includes('Informações pessoais')) {
          alert(calcError.message);
          navigate('/perfil');
          return;
        }
        
        alert("Suas respostas foram salvas, mas houve um erro ao calcular seu nível. " +
              "Por favor, verifique se suas informações pessoais estão preenchidas e tente novamente.");
      }
    } catch (err) {
      console.error("Erro ao enviar respostas:", err);
      if (err.response) {
        console.error("Detalhes do erro:", err.response.data);
        alert(`Falha ao enviar respostas: ${err.response.data.message || 'Erro no servidor'}`);
      } else if (err.request) {
        alert("Não foi possível conectar ao servidor. Verifique sua conexão.");
      } else {
        alert("Erro ao enviar respostas. Por favor, tente novamente.");
      }
    }
  };
  const handleOnClickNext = () => {
    if (selectedOption === null) {
      alert("Por favor, selecione uma opção antes de prosseguir.");
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestionIndex].id]: selectedOption,
    }));

    if (currentQuestionIndex === questions.length - 1) {
      handleSubmitAnswers();
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
    setSelectedOption(null);

    if (currentQuestionIndex === questions.length - 2) {
      setTitleButton("Finalizar");
    }
  };

  const handleNavigatorClick = (index) => {
    if (Object.keys(answers).length >= index) {
      setCurrentQuestionIndex(index);
      setSelectedOption(answers[questions[index].id] || null);
      setTitleButton(
        index === questions.length - 1 ? "Finalizar" : "Próxima Questão"
      );
    } else {
      alert("Por favor, responda as questões em ordem.");
    }
  };

  if (loading) return <p>Carregando perguntas...</p>;
  if (questions.length === 0) return <p>Nenhuma pergunta encontrada.</p>;

  return (
    <div className="questionario-wrapper">
      <div className="questionario-container">
        <div className="questionario-content">
          <h2>{questions[currentQuestionIndex].title}</h2>
          <p className="question-text">
            {questions[currentQuestionIndex].question}
          </p>

          <div className="options-container">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <label key={index} className="option-label">
                <input
                  type="radio"
                  name={`question-${questions[currentQuestionIndex].id}`}
                  value={option.valor}
                  checked={selectedOption === option.valor}
                  onChange={() => setSelectedOption(option.valor)}
                />
                <span className="option-text">{option.texto}</span>
              </label>
            ))}
          </div>

          <ButtonQuest title={titleButton} onClick={handleOnClickNext} />
        </div>

        <div className="question-navigator">
          <h3>Navegador de Perguntas</h3>
          <div className="navigator-grid">
            {questions.map((question, index) => (
              <button
                key={index}
                className={`navigator-button ${answers[question.id] !== undefined ? "answered" : ""
                  } ${currentQuestionIndex === index ? "active" : ""}`}
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