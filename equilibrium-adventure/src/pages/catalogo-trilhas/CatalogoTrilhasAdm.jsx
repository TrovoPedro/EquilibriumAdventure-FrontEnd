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
import { Route, useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";

const trilhas = [
  { img: catalogo1, alt: "Trilha montanha" },
  { img: catalogo2, alt: "Trilha nascente" },
  { img: catalogo3, alt: "Trilha bike" },
  { img: catalogo4, alt: "Trilha deserto" },
  { img: catalogo5, alt: "Trilha cachoeira" },
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
              <p>Digite o nome do evento que deseja achar</p>
            </div>
            <div className="search-box">
              <input type="text" placeholder="Escreva aqui" className="pesquisar-trilha" />
              <button>Procurar</button>
            </div>
          </div>
        </div>

        {/* Seção de destinos */}
        <section className="destinos">
          <h2>Eventos Ativos</h2>
          <div className="destinos-grid">
            <img src={trilhas[0].img} alt={trilhas[0].alt} className="destino-img destino-img1" />
            <img src={trilhas[1].img} alt={trilhas[1].alt} className="destino-img destino-img2" />
            <img src={trilhas[2].img} alt={trilhas[2].alt} className="destino-img destino-img3" />
            <img src={trilhas[3].img} alt={trilhas[3].alt} className="destino-img destino-img4" />
            <img src={trilhas[4].img} alt={trilhas[4].alt} className="destino-img destino-img5" />
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