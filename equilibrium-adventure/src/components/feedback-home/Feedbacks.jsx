import "./Feedbacks.css";
import { useEffect, useState } from "react";

export default function Feedbacks() {
  const feedbacks = [
    { 
      nome: "João Pedro", 
      texto: "A experiência superou minhas expectativas! As trilhas são bem organizadas e os guias muito atenciosos.",
      rating: 5
    },
    { 
      nome: "Camila Santos", 
      texto: "O guia foi incrível e me ajudou a perder os meus medos. Recomendo para quem quer se aventurar com segurança!",
      rating: 5
    },
    { 
      nome: "Pedro Henrique", 
      texto: "As paisagens eram de tirar o fôlego, foi incrível. Voltarei em breve para novas aventuras.",
      rating: 5
    },
    { 
      nome: "Mariana Costa", 
      texto: "Organização perfeita da equipe Equilibrium Adventure. Tudo foi planejado nos mínimos detalhes.",
      rating: 5
    },
    { 
      nome: "João Silva", 
      texto: "O pôr do sol no final da trilha estava lindo. Uma experiência inesquecível!",
      rating: 5
    },
    { 
      nome: "Luana Silva", 
      texto: "Equipe atenciosa e trilha muito bem sinalizada! Perfeito para iniciantes.",
      rating: 5
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? 'filled' : ''}`}
      >
        ★
      </span>
    ));
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handle = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', handle);
    else mq.addListener(handle);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handle);
      else mq.removeListener(handle);
    };
  }, []);

  const handleNext = () => {
    setCurrentIndex((i) => (i + 1) % feedbacks.length);
  };

  const renderCard = (feedback, index, delay = 0) => (
    <article
      className="feedback-card"
      key={index}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="feedback-content">
        <div className="feedback-quote">
          <span className="quote-mark">"</span>
          <p className="feedback-texto">{feedback.texto}</p>
        </div>
        
        <div className="feedback-rating">
          {renderStars(feedback.rating)}
        </div>
        
        <div className="feedback-author">
          <div className="feedback-avatar-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div className="feedback-user-info">
            <span className="feedback-nome">{feedback.nome}</span>
          </div>
        </div>
      </div>
      {isMobile && (
        <button
          type="button"
          className="feedback-next-button"
          onClick={handleNext}
          aria-label="Próximo feedback"
        >
          ›
        </button>
      )}
    </article>
  );

  return (
    <section className="feedbacks">
      <div className="feedbacks-container">
        <div className="feedbacks-header">
          <p className="feedbacks-subtitle">Nossos Feedbacks</p>
          <h2>Opinião dos Aventureiros</h2>
        </div>
        
        <div className="feedback-cards-container">
          {isMobile
            ? renderCard(feedbacks[currentIndex], currentIndex, 0)
            : feedbacks.map((feedback, index) => renderCard(feedback, index, index * 0.1))
          }
        </div>
      </div>
    </section>
  );
}
