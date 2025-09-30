import "./Feedbacks.css";
import feedbackImg1 from "../../assets/homem1.jpeg";
import feedbackImg2 from "../../assets/mulher1.jpeg";
import feedbackImg3 from "../../assets/homem2.jpeg";
import feedbackImg4 from "../../assets/mulher2.jpeg";
import feedbackImg5 from "../../assets/homem3.jpeg";

const twitterIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginLeft: 6}}>
    <circle cx="12" cy="12" r="12" fill="#E8F5FD"/>
    <path d="M19.633 7.997c.013.176.013.353.013.53 0 5.39-4.104 11.61-11.61 11.61v-.003A11.56 11.56 0 013 17.548c.243.029.486.044.73.045a8.2 8.2 0 005.088-1.753 4.1 4.1 0 01-3.827-2.844c.247.047.499.072.752.072.36 0 .713-.048 1.05-.14a4.096 4.096 0 01-3.287-4.016v-.052a4.08 4.08 0 001.852.52A4.1 4.1 0 014.8 6.29a11.63 11.63 0 008.437 4.28 4.1 4.1 0 016.978-3.736 8.19 8.19 0 002.6-.993 4.1 4.1 0 01-1.803 2.263 8.19 8.19 0 002.357-.646 8.8 8.8 0 01-2.05 2.12z" fill="#1DA1F2"/>
  </svg>
);

export default function Feedbacks() {
  const feedbacks = [
    { 
      img: feedbackImg1, 
      nome: "João Pedro", 
      user: "@fjexplorer70", 
      texto: "A experiência superou minhas expectativas! As trilhas são bem organizadas e os guias muito atenciosos.",
      rating: 5
    },
    { 
      img: feedbackImg2, 
      nome: "Camila Santos", 
      user: "@camilanature", 
      texto: "O guia foi incrível e me ajudou a perder os meus medos. Recomendo para quem quer se aventurar com segurança!",
      rating: 5
    },
    { 
      img: feedbackImg3, 
      nome: "Pedro Henrique", 
      user: "@pedrohtrilhas88", 
      texto: "As paisagens eram de tirar o fôlego, foi incrível. Voltarei em breve para novas aventuras.",
      rating: 5
    },
    { 
      img: feedbackImg4, 
      nome: "Mariana Costa", 
      user: "@marianaaventura", 
      texto: "Organização perfeita da equipe Equilibrium Adventure. Tudo foi planejado nos mínimos detalhes.",
      rating: 5
    },
    { 
      img: feedbackImg5, 
      nome: "João Silva", 
      user: "@joaonatureadventure", 
      texto: "O pôr do sol no final da trilha estava lindo. Uma experiência inesquecível!",
      rating: 5
    },
    { 
      img: feedbackImg2, 
      nome: "Lucas Silva", 
      user: "@lucastrilhas", 
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

  return (
    <section className="feedbacks">
      <div className="feedbacks-container">
        <div className="feedbacks-header">
          <p className="feedbacks-subtitle">Nossos Feedbacks</p>
          <h2>Opinião dos Aventureiros</h2>
        </div>
        
        <div className="feedback-cards-container">
          {feedbacks.map((feedback, index) => (
            <article
              className="feedback-card"
              key={index}
              style={{ animationDelay: `${index * 0.1}s` }}
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
                  <img 
                    src={feedback.img} 
                    alt={feedback.nome} 
                    className="feedback-avatar" 
                  />
                  <div className="feedback-user-info">
                    <span className="feedback-nome">{feedback.nome}</span>
                    <span className="feedback-user">{feedback.user}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
