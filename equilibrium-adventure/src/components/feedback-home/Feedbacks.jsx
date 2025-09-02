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
  // Todos os feedbacks do mesmo tamanho e mais feedbacks para enfeitar
  // Os cards do meio (colunas 2 e 3) serão maiores
  const feedbacks = [
    { img: feedbackImg1, nome: "João Pedro", user: "@fjexplorer70", texto: "A experiência superou minhas expectativas", middle: false },
    { img: feedbackImg2, nome: "Camila", user: "@camilanature", texto: "O guia foi incrível e me ajudou a perder os meus medos", middle: true },
    { img: feedbackImg3, nome: "Pedro Henrique", user: "@pedrohtrilhas88", texto: "As paisagens eram de tirar o fôlego, foi incrível", middle: true },
    { img: feedbackImg4, nome: "Mariana", user: "@marianaaventura", texto: "Organização perfeita da equipe Equilibrium Adventure", middle: false },
    { img: feedbackImg5, nome: "João", user: "@joaonatureadventure", texto: "O pôr do sol no final da trilha estava lindo", middle: false },
    { img: feedbackImg2, nome: "Lucas Silva", user: "@lucastrilhas", texto: "Equipe atenciosa e trilha muito bem sinalizada!", middle: true },
    { img: feedbackImg3, nome: "Fernanda Lima", user: "@feraventura", texto: "Recomendo para quem quer contato real com a natureza.", middle: true },
    { img: feedbackImg4, nome: "Carlos Souza", user: "@carlostrip", texto: "Voltarei com certeza! Experiência única.", middle: false },
  ];

  return (
    <section className="feedbacks">
      <h2>O que os aventureiros acham</h2>
      <div className="feedback-cards-grid">
        {feedbacks.map((f, i) => (
          <div
            className={`feedback-card-modern${f.middle ? ' feedback-card-middle' : ' feedback-card-edge'}`}
            key={i}
          >
            <div className="feedback-card-header">
              <img src={f.img} alt={f.nome} className="feedback-avatar" />
              <div className="feedback-user-info">
                <span className="feedback-nome">{f.nome}</span>
                <span className="feedback-user">{f.user}</span>
              </div>
            </div>
            <p className="feedback-texto">{f.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
