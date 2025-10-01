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

  // Buscar perguntas no backend
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

  // Função para calcular a pontuação final e nível
  const calcularNivel = (respostas) => {
    const total = Object.values(respostas).reduce(
      (acc, valor) => acc + Number(valor),
      0
    );

    let nivelamento = "";
    if (total <= 10) nivelamento = "Explorador";
    else if (total <= 20) nivelamento = "Aventureiro";
    else if (total <= 27) nivelamento = "Desbravador";
    else nivelamento = "Desbravador";

    return { total, nivelamento };
  };

  const handleSubmitAnswers = async () => {
    try {
      const respostasParaEnviar = Object.entries(answers).map(([perguntaId, alternativa]) => ({
        usuarioId: usuario.id,
        perguntaId: Number(perguntaId),
        alternativaEscolhida: Number(alternativa)
      }));

      await postRespostas(respostasParaEnviar);

      const nivelCalculado = await calcularNivel(`/respostas/calcular-nivel/${usuario.id}`);

      setNivel(nivelCalculado.data);

      alert(`Respostas enviadas! Parabéns você é um ${nivelCalculado.data}`);

      salvarPontuacao(0, nivelCalculado.data);

      navigate(routeUrls.ESCOLHER_GUIA, {
        state: { nivel: nivelCalculado.data }
      });

      setAnswers({});
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setTitleButton("Próxima Questão");
    } catch (err) {
      console.error("Erro ao enviar respostas:", err);
      alert("Falha ao enviar respostas.");
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