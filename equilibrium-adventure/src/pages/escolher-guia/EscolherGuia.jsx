import React, { useEffect, useState } from "react";
import "./EscolherGuia.css";
import { buscarGuias } from "../../services/apiTrilhas";
import routeUrls from "../../routes/routeUrls";
import { useNavigate, useLocation } from "react-router-dom";
import { useGuide } from "../../context/GuideContext";
import { useScore } from "../../context/ScoreContext";
import useGoBack from "../../utils/useGoBack";

function EscolherGuia() {
  const [guias, setGuias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { escolherGuia } = useGuide();
  const { resetarPontuacao } = useScore();
  const goBack = useGoBack();

  const CARDS_PER_SLIDE = 4;

  const handleGoBack = () => {
    // Verifica se veio do login marcando uma flag no sessionStorage
    const vemDoLogin = sessionStorage.getItem('vemDoLogin');
    
    if (vemDoLogin === 'true') {
      // Limpa a sessão apenas se veio do login
      resetarPontuacao();
      sessionStorage.removeItem('usuario')
      sessionStorage.removeItem('anamnese');
      sessionStorage.removeItem('encaminharParaAnamnese');
      sessionStorage.removeItem('guiaSelecionado');
      sessionStorage.removeItem('vemDoLogin');
    }
    
    goBack();
  };

  useEffect(() => {
    const fetchGuias = async () => {
      try {
        const data = await buscarGuias();
        setGuias(data);
      } catch (error) {
        console.error("Erro ao buscar guias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuias();
  }, []);

  if (loading) {
    return <p style={{ color: "#fff" }}>Carregando guias...</p>;
  }

  const handleOnClickGuia = async (guia) => {
    try {
      // Escolhe o guia e aguarda a atualização do contexto
      await escolherGuia(guia);
      console.log('Guia selecionado:', guia);

      // Verifica se o usuário precisa fazer anamnese
      const encaminharParaAnamnese = JSON.parse(sessionStorage.getItem('encaminharParaAnamnese') || 'false');
      console.log('Encaminhar para anamnese:', encaminharParaAnamnese);

      // Força um pequeno delay antes da navegação
      await new Promise(resolve => setTimeout(resolve, 100));

      // Usa replace em vez de push para evitar problemas com o histórico
      const nextRoute = encaminharParaAnamnese ? routeUrls.AGENDAMENTO_ANAMNESE : routeUrls.CATALOGO_TRILHA;
      console.log('Tentando navegar para:', nextRoute);
      
      window.location.href = nextRoute;
    } catch (error) {
      console.error('Erro ao processar clique no guia:', error);
    }
  };

  const isCarousel = guias.length > CARDS_PER_SLIDE;
  const totalSlides = isCarousel ? Math.ceil(guias.length / CARDS_PER_SLIDE) : 1;

  const goToSlide = (index) => {
    setCurrentSlide(Math.max(0, Math.min(index, totalSlides - 1)));
  };

  const goToPrevSlide = () => {
    goToSlide(currentSlide - 1);
  };

  const goToNextSlide = () => {
    goToSlide(currentSlide + 1);
  };

  const getVisibleGuias = () => {
    if (!isCarousel) return guias;
    const start = currentSlide * CARDS_PER_SLIDE;
    return guias.slice(start, start + CARDS_PER_SLIDE);
  };

  return (
    <>
      <div className="fullscreen-bg"></div>
      <div className="overlay">
        <button
          className="close-btn-escolher-guia"
          aria-label="Fechar"
          onClick={handleGoBack}
        >
          ✕
        </button>
        <h1>Escolha o seu guia...</h1>
        <div className="guides-carousel-container">
          {isCarousel && currentSlide > 0 && (
            <button
              type="button"
              aria-label="Anterior"
              className="carousel-button carousel-button--left"
              onClick={goToPrevSlide}
            >
              ‹
            </button>
          )}

          <div className="guides-wrapper">
            <div className="guides">
              {getVisibleGuias().map((guia) => (
                <div
                  key={guia.id}
                  className="card-escolher-guia"
                  onClick={() => handleOnClickGuia(guia)}
                >
                  <img
                    src={
                      guia.imagemBase64
                        ? `data:image/png;base64,${guia.imagemBase64}`
                        : "/assets/default-avatar.svg"
                    }
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fallbackApplied) {
                        e.currentTarget.src = "/assets/default-avatar.svg";
                        e.currentTarget.dataset.fallbackApplied = "true";
                      }
                    }}
                    alt={guia.nome}
                  />
                  <p>{guia.nome}</p>
                </div>
              ))}
            </div>
          </div>

          {isCarousel && currentSlide < totalSlides - 1 && (
            <button
              type="button"
              aria-label="Próximo"
              className="carousel-button carousel-button--right"
              onClick={goToNextSlide}
            >
              ›
            </button>
          )}
        </div>

        {isCarousel && totalSlides > 1 && (
          <div className="carousel-indicators">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Ir para slide ${index + 1}`}
                className={`indicator ${index === currentSlide ? "indicator--active" : ""
                  }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default EscolherGuia;
