import React from "react";
import "./CatalogoTrilhas.css";
import Header from "../../components/header/header";
import catalogo1 from "../../assets/chile.jpg";
import catalogo2 from "../../assets/amazonia.jpg";
import catalogo3 from "../../assets/montanha.jpg";
import catalogo4 from "../../assets/pordosol.jpg";
import catalogo5 from "../../assets/cachoeira.jpg";
import catalogo6 from "../../assets/pedra.jpg";
import catalogo7 from "../../assets/caminhoarvores.jpg";
import catalogo8 from "../../assets/cachoeiralago.jpg";
import { useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";

const trilhasAtivas = [
  {
    img: catalogo1,
    local: "Chile",
    titulo: "Aventura nos Andes",
    descricao: "Descubra as majestosas montanhas chilenas em uma experiência única.",
    preco: "R$200",
    nota: 4.9,
    reviews: 150,
  },
  {
    img: catalogo2,
    local: "Amazônia",
    titulo: "Expedição Amazônica",
    descricao: "Mergulhe na exuberante floresta tropical e sua biodiversidade.",
    preco: "R$180",
    nota: 4.8,
    reviews: 98,
  },
  {
    img: catalogo3,
    local: "Serra da Mantiqueira",
    titulo: "Pico das Águias",
    descricao: "Conquiste um dos pontos mais altos da região sudeste.",
    preco: "R$140",
    nota: 4.7,
    reviews: 230,
  },
];


// Agora cada anúncio usa uma imagem diferente do assets (6 a 13):
const anuncios = [
  {
    img: catalogo6,
    local: "Minas Gerais",
    titulo: "Trilha da Serra do Cipó",
    descricao: "Explore cachoeiras e montanhas em um dos destinos mais bonitos de MG.",
    preco: "R$120",
    nota: 4.8,
    reviews: 320,
  },
  {
    img: catalogo7,
    local: "Chapada Diamantina",
    titulo: "Caminho das Águas Claras",
    descricao: "Aventura por rios cristalinos e paisagens de tirar o fôlego.",
    preco: "R$150",
    nota: 4.9,
    reviews: 210,
  },
  {
    img: catalogo8,
    local: "Petrópolis",
    titulo: "Trilha do Imperador",
    descricao: "História e natureza em um só passeio pelas montanhas do RJ.",
    preco: "R$100",
    nota: 4.7,
    reviews: 180,
  },
];

const CatalogoTrilhas = () => {

  const navigate = useNavigate();

  const handleOnClick = (action) => {
    if (action === "ativar") {
      navigate(routeUrls.ATIVAR_EVENTO);
    } else if (action === "editar") {
      navigate(routeUrls.EDITAR_EVENTO);
    } else if (action === "detalhes") {
      // Adicione aqui a navegação para a página de detalhes
      console.log("Navegar para detalhes do evento");
    }
  };


  return (
    <>
      <Header />
      <div className="home-container">
        {/* Seção de busca */}
        <div className="search-section">
          <div className="search-overlay">
            <div className="search-text-group">
              <h2>Olá, Edgar</h2>
              <p>Bora ver como estão seus eventos?</p>
            </div>
            <div className="search-box">
              <input type="text" placeholder="Escreva aqui" className="pesquisar-trilha" />
              <button>Procurar</button>
            </div>
          </div>
        </div>

        {/* Seção de eventos ativos */}
        <section className="anuncios-trilhas">
          <h2 className="anuncios-titulo" style={{textAlign: 'left'}}>Eventos Ativos</h2>
          <div className="anuncios-grid">
            {trilhasAtivas.map((trilha, idx) => (
              <div className="anuncio-card" key={idx}>
                <div className="anuncio-img-wrap">
                  <img src={trilha.img} alt={trilha.titulo} className="anuncio-img" />
                </div>
                <div className="anuncio-info">
                  <span className="anuncio-local">{trilha.local}</span>
                  <h3 className="anuncio-titulo">{trilha.titulo}</h3>
                  <p className="anuncio-desc">{trilha.descricao}</p>
                  <div className="anuncio-footer">
                    <span className="anuncio-preco">{trilha.preco}<span className="anuncio-preco-unidade">/pessoa</span></span>
                    <div className="anuncio-btn-group">
                      <button className="anuncio-btn" onClick={() => handleOnClick("detalhes")}>Detalhes</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Seção de anúncios de trilhas */}
        <section className="anuncios-trilhas">
          <h2 className="anuncios-titulo">Eventos Base</h2>
          <div className="anuncios-grid">
            {anuncios.map((anuncio, idx) => (
              <div className="anuncio-card" key={idx}>
                <div className="anuncio-img-wrap">
                  <img src={anuncio.img} alt={anuncio.titulo} className="anuncio-img" />
                </div>
                <div className="anuncio-info">
                  <span className="anuncio-local">{anuncio.local}</span>
                  <h3 className="anuncio-titulo">{anuncio.titulo}</h3>
                  <p className="anuncio-desc">{anuncio.descricao}</p>
                  <div className="anuncio-footer">
                    <span className="anuncio-preco">{anuncio.preco}<span className="anuncio-preco-unidade">/pessoa</span></span>
                    <div className="anuncio-btn-group">
                      <button className="anuncio-ativar-btn" onClick={() => handleOnClick("ativar")}>Ativar</button>
                      <button className="anuncio-btn" onClick={() => handleOnClick("editar")}>Editar</button>
                    </div>
                  </div>
                </div>
              </div>
            ))} 
          </div>
        </section>
      </div>
    </>
  );
};
export default CatalogoTrilhas;