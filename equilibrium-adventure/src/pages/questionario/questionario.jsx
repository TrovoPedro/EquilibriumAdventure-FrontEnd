import React, { useState, useEffect } from "react";
import "./questionario.css";
import ButtonQuest from "../../components/button-questionario/button-questionario";
import { getPerguntas, postRespostas, calcularNivel, inicializarPerguntas } from "../../services/apiAventureiro";
import { useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls"
import { useScore } from "../../context/ScoreContext";
import { useAuth } from "../../context/AuthContext";
import PopUpOk from "../../components/pop-up-ok/pop-up-ok";

const Questionario = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});
  const [titleButton, setTitleButton] = useState("Próxima Questão");
  const [loading, setLoading] = useState(true);
  const [nivel, setNivel] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [nivelObtido, setNivelObtido] = useState('');
  const { salvarPontuacao } = useScore();
  const { usuario } = useAuth();

  useEffect(() => {
    const carregarPerguntas = async () => {
      try {
        await inicializarPerguntas(); // 🔹 garante que perguntas sejam criadas se não existirem
        const res = await getPerguntas();
        setQuestions(res.data);
      } catch (err) {
        console.error("Erro ao inicializar ou buscar perguntas:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarPerguntas();
  }, []);

  const handleSubmitAnswers = async () => {
    try {
      if (!usuario || !usuario.id) {
        alert("Por favor, faça login para enviar suas respostas.");
        return;
      }

      // Cria um objeto com todas as respostas, incluindo a última selecionada
      const todasRespostas = {
        ...answers,
        [questions[currentQuestionIndex].id]: selectedOption
      };

      if (Object.keys(todasRespostas).length !== questions.length) {
        alert("Por favor, responda todas as questões antes de finalizar.");
        return;
      }

      const respostasParaEnviar = Object.entries(todasRespostas).map(([perguntaId, alternativa]) => ({
        usuarioId: usuario.id,
        perguntaId: Number(perguntaId),
        alternativaEscolhida: Number(alternativa)
      }));

      await postRespostas(respostasParaEnviar);
      try {
        const resultadoNivel = await calcularNivel(usuario.id);
        const nivelCalculado = resultadoNivel?.nivel ?? resultadoNivel;

        const nivelObtido = typeof nivelCalculado === "string"
          ? nivelCalculado.toLowerCase()
          : String(nivelCalculado?.nivel ?? "EXPLORADOR").toLowerCase();

        setNivel(nivelObtido);
        setNivelObtido(nivelObtido);
        salvarPontuacao(nivelObtido);
        setShowSuccessPopup(true);

        setAnswers({});
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setTitleButton("Próxima Questão");
      } catch (calcError) {
        console.error("Erro ao calcular nível:", calcError);
        if (calcError.message?.includes("Informações pessoais")) {
          showError(calcError.message);
          navigate("/perfil");
          return;
        }
        alert(
          "Suas respostas foram salvas, mas houve um erro ao calcular seu nível. " +
          "Por favor, verifique se suas informações pessoais estão preenchidas e tente novamente."
        );
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

    // Atualiza as respostas com a seleção atual
    const novasRespostas = {
      ...answers,
      [questions[currentQuestionIndex].id]: selectedOption
    };
    setAnswers(novasRespostas);

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

  const handleOnClickBack = () => {
    if (currentQuestionIndex > 0) {
      // Salva a resposta atual antes de voltar (se houver)
      if (selectedOption !== null) {
        setAnswers({
          ...answers,
          [questions[currentQuestionIndex].id]: selectedOption
        });
      }

      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedOption(answers[questions[currentQuestionIndex - 1].id] || null);
      setTitleButton("Próxima Questão");
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
          <h2>Questão {currentQuestionIndex + 1}</h2>
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

          <div className="button-container">
            {currentQuestionIndex > 0 && (
              <ButtonQuest title="Voltar" onClick={handleOnClickBack} isBackButton />
            )}
            <ButtonQuest title={titleButton} onClick={handleOnClickNext} />
          </div>
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
      
      {showSuccessPopup && (
        <PopUpOk
          title="Questionário Concluído!"
          message={`Parabéns! Suas respostas foram enviadas com sucesso! Você foi classificado como: ${nivelObtido.toUpperCase()}`}
          onConfirm={() => {
            setShowSuccessPopup(false);
            navigate(routeUrls.ESCOLHER_GUIA, { state: { nivel: nivelObtido } });
            setAnswers({});
            setCurrentQuestionIndex(0);
            setSelectedOption(null);
            setTitleButton("Próxima Questão");
          }}
        />
      )}
    </div>
  );
};

export default Questionario;