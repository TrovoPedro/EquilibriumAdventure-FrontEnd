
import "./Trilhas.css";
import trilhasImg1 from "../../assets/trilha1.jpg";
import trilhasImg2 from "../../assets/trilha2.jpg";
import trilhasImg3 from "../../assets/trilha3.jpg";
import { useNavigate } from "react-router-dom";


export default function Trilhas() {
  const trilhas = [
    { img: trilhasImg1, title: "Lago das Carpas", km: "5,2 km", days: "5 Dias de Trilha" },
    { img: trilhasImg2, title: "Trilha do Bonete", km: "10 km", days: "7 Dias de Trilha" },
    { img: trilhasImg3, title: "Pedro do Macelo", km: "7,5 km", days: "10 Dias de Trilha" }
  ];
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/login");
  };

  return (
    <section className="trilhas">
      <h2>Seu próximo lugar favorito o aguarda</h2>
      <div className="cards">
        {trilhas.map((t, i) => (
          <div className="card" key={i} onClick={handleCardClick} style={{ cursor: "pointer" }}>
            <img src={t.img} alt={t.title} />
            <div className="card-info">
              <h3>{t.title}</h3>
              <p>{t.km}</p>
              <span>{t.days}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
