import "./Feedbacks.css";
import feedbackImg1 from "../../assets/homem1.jpeg";
import feedbackImg2 from "../../assets/mulher1.jpeg";
import feedbackImg3 from "../../assets/homem2.jpeg";
import feedbackImg4 from "../../assets/mulher2.jpeg";
import feedbackImg5 from "../../assets/homem3.jpeg";
import feedbackImg6 from "../../assets/mulher3.jpeg";
import feedbackImg7 from "../../assets/homem4.jpeg";
import feedbackImg8 from "../../assets/mulher4.jpeg";

export default function Feedbacks() {
  const feedbacks = [
    { img: feedbackImg1, nome: "João Pedro", user: "@fjexplorer70", texto: "A experiência superou minhas expectativas" },
    { img: feedbackImg2, nome: "Camila", user: "@camilanature", texto: "O guia foi incrível e me ajudou a perder os meus medos" },
    { img: feedbackImg3, nome: "Pedro Henrique", user: "@pedrohtrilhas88", texto: "As paisagens eram de tirar o fôlego, foi incrível" },
    { img: feedbackImg4, nome: "Mariana", user: "@marianaaventura", texto: "Organização perfeita da equipe Equilibrium Adventure" },
    { img: feedbackImg5, nome: "João", user: "@joaonatureadventure", texto: "O pôr do sol no final da trilha estava lindo" },
    // { img: feedbackImg6, nome: "Aline", user: "@alineexplorer99", texto: "Perfeito para desconectar" },
    // { img: feedbackImg7, nome: "Carlos", user: "@carlosaventura", texto: "Trilha desafiadora, mas recompensadora" },
    // { img: feedbackImg8, nome: "Fernanda", user: "@fernandatrips", texto: "Ambiente incrível e energia contagiante" },
  ];

  return (
    <section className="feedbacks">
      <h4>Nossos Feedbacks</h4>
      <h2>A opinião dos aventureiros</h2>
      <div className="feedback-cards">
        {feedbacks.map((f, i) => (
          <div className="feedback-card" key={i}>
            <img src={f.img} alt={f.nome} />
            <div>
              <strong>{f.nome}</strong> <br></br>
              <span>{f.user}</span> <br></br> <br></br>
              <p>{f.texto}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
