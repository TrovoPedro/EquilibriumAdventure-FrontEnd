import React, { useEffect, useState } from "react";
import './EscolherGuia.css';
import { buscarGuias } from "../../services/apiTrilhas";
import routeUrls from "../../routes/routeUrls";
import { useNavigate } from "react-router-dom";

const EscolhaGuia = () => {
  const [guias, setGuias] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleOnClickGuia = (guia) => {
    alert(`Guia ${guia.nome} selecionado!`);
    navigate(routeUrls.CATALOGO_TRILHA);
  }

  return (
    <>
      <div className="fullscreen-bg"></div>
      <div className="overlay">
        <h1>Escolha o seu guia...</h1>
        <div className="guides">
          {guias.map((guia) => (
            <div key={guia.id} className="card-escolher-guia"  onClick={() => handleOnClickGuia(guia)}>
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
