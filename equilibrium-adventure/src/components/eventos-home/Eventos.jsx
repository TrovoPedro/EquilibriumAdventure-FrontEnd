
import "./Eventos.css";
import eventosImg from "../../assets/img-teste.png";
import { useNavigate } from "react-router-dom";

export default function Eventos() {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/login");
  };

  return (
    <div className="eventos-container">
      <section className="eventos">
        <div className="eventos-content">
          <div className="evento-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
            <img src={eventosImg} alt="Trilha da Pedra Grande" />
            <div>
              <h3>Trilha da Pedra Grande</h3>
              <p>14-29 Junho</p>
              <span>por Edgar de Mendonça</span>
              <div className="evento-icons">
                <span>👥 10 pessoas confirmadas</span>
                <span>♡</span>
              </div>
            </div>
          </div>

          <div className="evento-tipos">
            <p className="eventos-subtitle">Para aproveitar</p>
            <h2>Encontre o evento ideal para você</h2>
            <ul>
              <li>
                <span className="tipo explorador"></span> 
                <div>
                  <span>Explorador</span>
                  <p>Trilha leve e acessível, perfeita para quem está começando a explorar a natureza.</p>
                </div>
              </li>
              <li>
                <span className="tipo aventureiro"></span> 
                <div>
                  <span>Aventureiro</span>
                  <p>Trilha com nível moderado, indicada para quem busca novos desafios com segurança.</p>
                </div>
              </li>
              <li>
                <span className="tipo desbravador"></span> 
                <div>
                  <span>Desbravador</span>
                  <p>Trilha mais exigente, voltada a quem já tem experiência e deseja uma imersão completa.</p>
                </div>
              </li>
            </ul>
          </div>
          {/* fechamento da div eventos-content */}
        </div>
      </section>
    </div>
  );
}
