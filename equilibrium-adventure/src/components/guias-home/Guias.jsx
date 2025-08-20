import React, { useState } from 'react';
import "./Guias.css";
import guia1Img from "../../assets/beneficiario.png";
import guia2Img from "../../assets/guia2.png";
import guia3Img from "../../assets/guia3.png";

const guias = [
  {
    nome: 'Edgar de Mendonça',
    cidade: 'São Paulo, SP',
    depoimento:
      'Trilhar é liberdade. Adoro o som dos pássaros, o cheiro da terra molhada e as paisagens incríveis. Superar obstáculos e terminar com um mergulho na cachoeira é o que mais gosto. É renovador!',
    imagem: guia1Img, // Corrigido aqui
  },
  {
    nome: 'Letícia Mendes',
    cidade: 'Rio de Janeiro, RJ',
    depoimento:
      'Cada trilha é uma nova história. Amo compartilhar esse contato com a natureza e ver as pessoas se transformando a cada passo.',
    imagem: guia3Img, // Mantido igual
  },
   {
    nome: 'Carlos da Costa',
    cidade: 'Belo Horizonte, MG',
    depoimento:
      'Sou trilheiro porque o mundo não cabe numa sala. Prefiro o silêncio das árvores ao barulho da cidade, e cada raiz no caminho é um convite pra desacelerar. Não sigo trilhas, converso com elas.',
    imagem: guia2Img, // Corrigido aqui
  },
];

export default function Guias() {
  const [guiaAtual, setGuiaAtual] = useState(0);

  const proximoGuia = () => {
    setGuiaAtual((prev) => (prev + 1) % guias.length);
  };

  return (
    <section className="guia-section">
      <div className="guia-texto">
        <h4>Aventura Segura</h4>
        <h2>Nossos Guias</h2>
        <p>Os guias mais preparados para você</p>
        <div className="guia-depoimento">
          <p>"{guias[guiaAtual].depoimento}"</p>
          <span>
            — {guias[guiaAtual].nome}, {guias[guiaAtual].cidade}
          </span>
        </div>
        <button onClick={proximoGuia} className='guia-proximo'  >Ver próximo guia</button>
      </div>
      <div className="guia-imagem">
        <img src={guias[guiaAtual].imagem} alt={`Foto de ${guias[guiaAtual].nome}`} />
      </div>
    </section>
  );
}