import React, { useEffect, useState } from "react";
import './EscolherGuia.css';
import { buscarGuias } from "../../services/apiTrilhas";
import routeUrls from "../../routes/routeUrls";
import { useNavigate } from "react-router-dom";
import { useGuide } from "../../context/GuideContext";

const EscolherGuia = () => {
  const [guias, setGuias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { escolherGuia } = useGuide();

  const CARDS_PER_SLIDE = 4;

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

  const handleOnClickGuia = (guia) => {
    escolherGuia(guia);
    navigate(routeUrls.CATALOGO_TRILHA);
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
          onClick={() => navigate(routeUrls.LOGIN)}
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
                    src={guia.imagemBase64
                      ? `data:image/png;base64,${guia.imagemBase64}`
                      : "/assets/default-avatar.svg"}
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
                className={`indicator ${index === currentSlide ? 'indicator--active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default EscolherGuia;
