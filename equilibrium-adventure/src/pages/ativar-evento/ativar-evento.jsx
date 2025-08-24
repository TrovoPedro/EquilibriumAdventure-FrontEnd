import React from "react";
import Header from "../../components/header/header";
import "./ativar-evento.css";
import leftArrow from "../../assets/left-arrow-green.png";

export default function AtivarEvento() {
  return (
    <>
      <Header />
      <div className="ativar-evento-container">
        <div className="ativar-evento-header">
          <span className="back-arrow-circle">
            <img className="back-arrow" src={leftArrow} alt="Voltar" />
          </span>
          <span className="ativar-evento-title">Ativar Evento (Nome do evento)</span>
        </div>
        <div className="ativar-evento-form-wrapper">
          <form className="ativar-evento-form">
            <div className="form-row">
              <div className="form-group">
                <label>Hora de Início:</label>
                <input type="text" name="horaInicio" placeholder="08:00" />
              </div>
              <div className="form-group">
                <label>Hora de Fim:</label>
                <input type="text" name="horaFim" placeholder="12:00" />
              </div>
              <div className="form-group">
                <label>Duração:</label>
                <input type="text" name="duracao" placeholder="4h" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Preço:</label>
                <input type="text" name="preco" placeholder="R$ 100,00" />
              </div>
              <div className="form-group">
                <label>Limite Inscritos:</label>
                <input type="text" name="limiteInscritos" placeholder="30" />
              </div>
              <div className="form-group">
                <label>Data do Evento:</label>
                <input type="date" name="dataEvento" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group form-group-full">
                <label>Categoria:</label>
                <input type="text" name="categoria" placeholder="Cachoeira, Montanhismo, etc." />
              </div>
            </div>
            <div className="form-row form-row-end">
              <button className="ativar-evento-btn" type="submit">Ativar Evento</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
