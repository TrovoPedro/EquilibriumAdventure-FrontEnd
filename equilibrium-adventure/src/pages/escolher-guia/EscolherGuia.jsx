import React, { useEffect, useState } from "react";
import './EscolherGuia.css';
import { buscarGuias } from "../../services/apiTrilhas";

const EscolhaGuia = () => {
  const [guias, setGuias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuias = async () => {
      try {
        const data = await buscarGuias(); // chamada no axios
        setGuias(data);
      } catch (error) {
        console.error("Erro ao buscar guias:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGuias();
  }, []);

  if (loading) {
    return <p style={{ color: "#fff" }}>Carregando guias...</p>;
  }

  return (
    <>
      <div className="fullscreen-bg"></div>
      <div className="overlay">
        <h1>Escolha o seu guia...</h1>
        <div className="guides">
          {guias.map((guia) => (
            <div key={guia.id} className="card-escolher-guia">
              <img
                src={guia.imagemBase64
                  ? `data:image/png;base64,${guia.imagemBase64}`
                  : "/default-avatar.png"}
                alt={guia.nome}
              />
              <p>{guia.nome}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EscolhaGuia;
