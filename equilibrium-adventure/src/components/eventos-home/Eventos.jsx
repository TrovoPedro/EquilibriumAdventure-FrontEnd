import "./Eventos.css";
import eventosImg from "../../assets/img-teste.png";

export default function Eventos() {
  return (
    <div className="eventos-container">
      <section className="eventos">
        <div className="evento-card">
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
          <h4>Para aproveitar</h4>
          <h2>Encontre o evento ideal para você</h2>
          <ul>
            <li><span className="tipo explorador"></span> Explorador <p>Trilha leve e acessível, perfeita para quem está começando a explorar a natureza.</p></li>
            <li><span className="tipo aventureiro"></span> Aventureiro <p>Trilha com nível moderado, indicada para quem busca novos desafios com segurança.</p></li>
            <li><span className="tipo desbravador"></span> Desbravador <p> Trilha mais exigente, voltada a quem já tem experiência e deseja uma imersão completa.</p></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
