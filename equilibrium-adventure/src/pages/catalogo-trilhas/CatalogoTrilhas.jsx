import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";
import "./CatalogoTrilhas.css";
import Header from "../../components/header/header-unified";
import BotpressChat from "../../components/botpress-chat/BotpressChat";
import catalogoFallback from "../../assets/chile.jpg"; // imagem padrão
import { buscarEventosAtivosPorGuia, buscarImagemEvento } from "../../services/apiEvento";
import { useGuide } from "../../context/GuideContext"

const CatalogoTrilhas = () => {
  const navigate = useNavigate();
  const { guiaSelecionado } = useGuide();
  const [trilhas, setTrilhas] = useState([]);
  const [loading, setLoading] = useState({ trilhas: true, anuncios: true });
  const [error, setError] = useState({ trilhas: null, anuncios: null });

  useEffect(() => {
    let isMounted = true;

    const carregarTrilhas = async () => {
      try {
        const trilhasData = await buscarEventosAtivosPorGuia(guiaSelecionado?.id || 0);
        const trilhasComImagens = await Promise.all(
          trilhasData.map(async (trilha) => {
            const imagemUrl = await buscarImagemEvento(trilha.id_evento);
            return { ...trilha, imagemUrl: imagemUrl || catalogoFallback };
          })
        );

        if (isMounted) {
          setTrilhas(trilhasComImagens);
          setError((prev) => ({ ...prev, trilhas: null }));
        }
      } catch (err) {
        console.error("Erro ao carregar trilhas:", err);
        if (isMounted)
          setError((prev) => ({ ...prev, trilhas: "Erro ao carregar trilhas." }));
      } finally {
        if (isMounted)
          setLoading((prev) => ({ ...prev, trilhas: false }));
      }
    };

    carregarTrilhas();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaibaMais = (eventoId) => {
      navigate(routeUrls.INSCRICAO_TRILHAS.replace(':id', eventoId));
  };
  const handleDetalhes = (eventoId) => {
      navigate(routeUrls.INSCRICAO_TRILHAS.replace(':id', eventoId));
  };

  return (
    <>
      <BotpressChat />
      <Header />
      <div className="home-container">
        {/* Seção de busca */}
        <div className="search-section">
          <div className="search-overlay">
            <div className="search-text-group">
              <h2>Pesquise sua próxima aventura</h2>
              <p>Bora achar sua próxima trilha?</p>
            </div>
            <div className="search-box">
              <input
                type="text"
                placeholder="Escreva aqui"
                className="pesquisar-trilha"
              />
              <button>Procurar</button>
            </div>
          </div>
        </div>

        {/* Seção de destinos */}
        <section className="destinos">
          <h2>Destinos que você vai amar conhecer</h2>
          {loading.trilhas ? (
            <p>Carregando trilhas...</p>
          ) : error.trilhas ? (
            <p className="erro-msg">{error.trilhas}</p>
          ) : (
            <div className="destinos-grid">
              {trilhas.map((trilha) => (
                <div className="destino-card" key={trilha.id_evento}>
                  <img
                    src={trilha.imagemUrl}
                    alt={trilha.nome}
                    className="destino-img"
                    loading="lazy"
                  />
                  <div className="destino-overlay">
                    <button
                      className="destino-detalhes-btn"
                      onClick={() => handleDetalhes(trilha.id_evento
                      )}
                    >
                      Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Seção de anúncios */}
        <section className="anuncios-trilhas">
          <h2 className="anuncios-titulo">Um mundo de opções para você escolher</h2>
          {loading.trilhas ? (
            <p>Carregando anúncios...</p>
          ) : error.trilhas ? (
            <p className="erro-msg">{error.trilhas}</p>
          ) : (
            <div className="anuncios-grid">
              {trilhas.map((trilha) => (
                <div className="anuncio-card" key={trilha.id_evento}>
                  <div className="anuncio-img-wrap">
                    <img
                      src={trilha.imagemUrl}
                      alt={trilha.titulo}
                      className="anuncio-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="anuncio-info">
                    <span className="anuncio-local">{trilha.rua}</span>
                    <h3 className="anuncio-titulo">{trilha.nome_evento}</h3>
                    <p className="anuncio-desc">{trilha.descricao}</p>
                    <div className="anuncio-footer">
                      <span className="anuncio-preco">
                        {trilha.preco}
                        <span className="anuncio-preco-unidade">/pessoa</span>
                      </span>
                      <div className="anuncio-btn-group">
                        <button
                          className="anuncio-btn"
                          onClick={() => handleSaibaMais(trilha.id_evento)}
                        >
                          Saiba Mais
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default CatalogoTrilhas;
