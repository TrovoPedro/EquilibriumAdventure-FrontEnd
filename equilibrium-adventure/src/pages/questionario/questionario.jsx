import React, { useState, useEffect } from "react";
import "./questionario.css";
import ButtonQuest from "../../components/button-questionario/button-questionario";
import { getPerguntas, postRespostas } from "../../services/apiAventureiro";
import { Route, useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls"
import { useScore } from "../../context/ScoreContext";

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
    else nivelamento = "Expert";

    return { total, nivelamento };
  };

  // Enviar respostas para o json-server
  const handleSubmitAnswers = async () => {
    const resultado = calcularNivel(answers);

    try {
      await postRespostas({
        respostas: answers,
        total: resultado.total,
        nivel: resultado.nivelamento,
        data: new Date().toISOString(),
      });

      setNivel(resultado);

      alert(
        `Respostas enviadas! Parabéns você é um ${resultado.nivelamento}`
      );

      salvarPontuacao(resultado.total, resultado.nivelamento);

      navigate(routeUrls.ESCOLHER_GUIA, { state: { nivel: resultado.nivelamento } });
      
      // Resetar
      setAnswers({});
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setTitleButton("Próxima Questão");
    } catch (err) {
      console.error("Erro ao enviar respostas:", err);
      alert("Falha ao enviar respostas.");
    }
  };

  // Avançar para próxima questão
  const handleOnClickNext = () => {
    if (selectedOption === null) {
      alert("Por favor, selecione uma opção antes de prosseguir.");
      return;
    }

    // Salvar a resposta atual
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestionIndex].id]: selectedOption,
    }));

    // Última questão → envia respostas
    if (currentQuestionIndex === questions.length - 1) {
      handleSubmitAnswers();
      return;
    }

    // Avançar
    setCurrentQuestionIndex((prev) => prev + 1);
    setSelectedOption(null);

    // Atualizar botão
    if (currentQuestionIndex === questions.length - 2) {
      setTitleButton("Finalizar");
    }
  };

  // Voltar ou navegar pelo grid
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
            {questions.map((_, index) => (
              <button
                key={index}
                className={`navigator-button ${
                  answers[questions[index].id] ? "answered" : ""
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