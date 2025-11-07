import React, { useState, useEffect } from 'react';
import "./Guias.css";
import { buscarGuias } from "../../services/apiTrilhas";
import axios from 'axios';
import noPhotoImg from "../../assets/imagem-do-usuario-grande.png";

export default function Guias() {
  const [guias, setGuias] = useState([]);
  const [guiaAtual, setGuiaAtual] = useState(0);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchGuias = async () => {
      try {
        const data = await buscarGuias();
        if (data && data.length > 0) {
          // Processar dados dos guias do backend
          const guiasProcessados = data.map((guia) => {
            const hasValidBase64 = typeof guia.imagemBase64 === 'string' && guia.imagemBase64.trim().length > 100;
            return {
              id: guia.id,
              nome: guia.nome || 'Nome não informado',
              cidade: guia.endereco ? `${guia.endereco.cidade}, ${guia.endereco.estado}` : 'Localização não informada',
              depoimento: guia.descricao || 'Depoimento não disponível no momento.',
              imagem: hasValidBase64 ? `data:image/png;base64,${guia.imagemBase64}` : null // usar placeholder quando inválido
            };
          });
          setGuias(guiasProcessados);
        } else {
          // Se não houver guias no backend, não usar mocks — mostrar placeholder
          setGuias([]);
        }
      } catch (error) {
        console.error("Erro ao buscar guias:", error);
        // Em caso de erro, não usar mocks — manter lista vazia para mostrar placeholder
        setGuias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGuias();
  }, []);

  const proximoGuia = () => {
    if (guias.length === 0) return;
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
  // Se não houver guias, mostrar placeholder sem mocks
  if (guias.length === 0) {
    return (
      <section className="guia-section">
        <div className="guia-texto">
          <h4>Aventura Segura</h4>
          <h2>Nossos Guias</h2>
          <p>Os guias mais preparados para você</p>
          <div className="guia-depoimento">
            <p>"Depoimento não disponível no momento."</p>
            <span>
              — Nenhum guia disponível no momento
            </span>
          </div>
        </div>
        <div className="guia-imagem">
          <img src={noPhotoImg} alt={`Nenhum guia disponível`} />
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
        <img src={guias[guiaAtual].imagem || noPhotoImg} alt={`Foto de ${guias[guiaAtual].nome}`} />
      </div>
    </section>
  );
}