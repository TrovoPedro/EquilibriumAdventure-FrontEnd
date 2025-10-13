import React, { useState, useEffect } from 'react';
import "./Guias.css";
import { buscarGuias } from "../../services/apiTrilhas";
import axios from 'axios';
import guia1Img from "../../assets/beneficiario.png";
import guia2Img from "../../assets/guia2.png";
import guia3Img from "../../assets/guia3.png";

// Guias de fallback (dados estáticos para caso não haja guias no backend)
const guiasFallback = [
  {
    nome: 'Edgar de Mendonça',
    cidade: 'São Paulo, SP',
    depoimento:
      'Trilhar é liberdade. Adoro o som dos pássaros, o cheiro da terra molhada e as paisagens incríveis. Superar obstáculos e terminar com um mergulho na cachoeira é o que mais gosto. É renovador!',
    imagem: guia1Img,
  },
  {
    nome: 'Letícia Mendes',
    cidade: 'Rio de Janeiro, RJ',
    depoimento:
      'Cada trilha é uma nova história que se revela a cada passo dado. Sinto uma paixão imensa em compartilhar esse contato profundo com a natureza, onde o silêncio das árvores e o frescor do ar renovam a alma.',
    imagem: guia3Img,
  },
  {
    nome: 'Carlos da Costa',
    cidade: 'Belo Horizonte, MG',
    depoimento:
      'Sou trilheiro porque o mundo não cabe numa sala. Prefiro o silêncio das árvores ao barulho da cidade, e cada raiz no caminho é um convite pra desacelerar. Não sigo trilhas, converso com elas.',
    imagem: guia2Img,
  },
];

export default function Guias() {
  const [guias, setGuias] = useState(guiasFallback);
  const [guiaAtual, setGuiaAtual] = useState(0);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchGuias = async () => {
      try {
        const data = await buscarGuias();
        if (data && data.length > 0) {
          // Processar dados dos guias do backend
          const guiasProcessados = data.map((guia) => ({
            id: guia.id,
            nome: guia.nome || 'Nome não informado',
            cidade: guia.endereco ? `${guia.endereco.cidade}, ${guia.endereco.estado}` : 'Localização não informada',
            depoimento: guia.descricao || 'Depoimento não disponível no momento.',
            imagem: guia.imagemBase64 
              ? `data:image/png;base64,${guia.imagemBase64}` 
              : guia1Img // Usar imagem padrão se não houver imagem
          }));
          setGuias(guiasProcessados);
        } else {
          // Se não houver guias no backend, usar os guias de fallback
          setGuias(guiasFallback);
        }
      } catch (error) {
        console.error("Erro ao buscar guias:", error);
        // Em caso de erro, usar os guias de fallback
        setGuias(guiasFallback);
      } finally {
        setLoading(false);
      }
    };

    fetchGuias();
  }, []);

  const proximoGuia = () => {
    setGuiaAtual((prev) => (prev + 1) % guias.length);
  };

  if (loading) {
    return (
      <section className="guia-section">
        <div className="guia-texto">
          <h4>Aventura Segura</h4>
          <h2>Nossos Guias</h2>
          <p>Carregando guias...</p>
        </div>
        <div className="guia-imagem">
          <div style={{
            width: '100%',
            height: '300px',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px'
          }}>
            Carregando...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="guia-section">
      <div className="guia-texto">
        <h4>Aventura Segura</h4>
        <h2>Nossos Guias</h2>
        <p>Os guias mais preparados para você</p>
        <div className="guia-depoimento">
          <p>"{guias[guiaAtual].depoimento}"</p>
          <span>
            — {guias[guiaAtual].nome}
          </span>
        </div>
        <button onClick={proximoGuia} className='guia-proximo'>Ver próximo guia</button>
      </div>
      <div className="guia-imagem">
        <img src={guias[guiaAtual].imagem} alt={`Foto de ${guias[guiaAtual].nome}`} />
      </div>
    </section>
  );
}