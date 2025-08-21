import React from "react";
import './EscolherGuia.css';
import guia1Img from "../../assets/beneficiario.png";
import guia2Img from "../../assets/guia2.png";
import guia3Img from "../../assets/guia3.png";

const EscolhaGuia = () => {
  return (
    <>
      {/* fundo separado */}
      <div className="fullscreen-bg"></div>

      {/* conteúdo em cima */}
      <div className="overlay">
        <h1>Escolha o seu guia...</h1>
        <div className="guides">
          <div className="card-escolher-guia">
            <img src={guia1Img} alt="Edgar" />
            <p>Edgar</p>
          </div>
          <div className="card-escolher-guia">
            <img src={guia3Img} alt="Bia" />
            <p className="highlight">Bia</p>
          </div>
          <div className="card-escolher-guia">
            <img src={guia2Img} alt="Luis" />
            <p>Luis</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EscolhaGuia;