import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";
import "./CatalogoTrilhas.css";
import Header from "../../components/header/header-unified";
import BotpressChat from "../../components/botpress-chat/BotpressChat";
import catalogoFallback from "../../assets/img12-catalogo.jpg"; // imagem padrão
import { buscarEventosAtivosPorGuia, buscarImagemEvento } from "../../services/apiEvento";
import { useGuide } from "../../context/GuideContext";

const CatalogoTrilhas = () => {
  const navigate = useNavigate();
  const { guiaSelecionado } = useGuide();
  const [trilhas, setTrilhas] = useState([]);
  const [loading, setLoading] = useState({ trilhas: true, anuncios: true });
  const [error, setError] = useState({ trilhas: null, anuncios: null });
  const [termoPesquisa, setTermoPesquisa] = useState("");
  
  // Estados dos filtros temporários (antes de aplicar)
  const [filtroDataTemp, setFiltroDataTemp] = useState("");
  const [filtroNivelTemp, setFiltroNivelTemp] = useState("");
  const [filtroCategoriaTemp, setFiltroCategoriaTemp] = useState("");
  
  // Estados dos filtros aplicados
  const [filtroData, setFiltroData] = useState("");
  const [filtroNivel, setFiltroNivel] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  useEffect(() => {
    let isMounted = true;

    // fallback do guia via sessionStorage
    const stored = sessionStorage.getItem("guiaSelecionado");
    const storedGuide = stored ? JSON.parse(stored) : null;
    const guideId = guiaSelecionado?.id || storedGuide?.id || 0;

    const carregarTrilhas = async () => {
      if (!guideId) {
        if (isMounted) {
          setTrilhas([]);
          setLoading((prev) => ({ ...prev, trilhas: false }));
        }
        return;
      }

      try {
        setLoading((prev) => ({ ...prev, trilhas: true }));

        const trilhasData = await buscarEventosAtivosPorGuia(guideId);

        const trilhasComImagens = await Promise.all(
          trilhasData.map(async (trilha) => {
            const imagemUrl = await buscarImagemEvento(trilha.id_evento);
            return { ...trilha, imagemUrl: imagemUrl || catalogoFallback };
          })
        );

        // FILTRO: apenas eventos cujo log é diferente de "FINALIZADO"
        const trilhasAtivas = trilhasComImagens.filter(
          (trilha) => (trilha.log || "").trim().toUpperCase() !== "FINALIZADO"
        );

        if (isMounted) {
          setTrilhas(trilhasAtivas);
          setError((prev) => ({ ...prev, trilhas: null }));
        }
      } catch (err) {
        console.error("Erro ao carregar trilhas:", err);
        if (isMounted) {
          setError((prev) => ({
            ...prev,
            trilhas: "Erro ao carregar trilhas.",
          }));
        }
      } finally {
        if (isMounted)
          setLoading((prev) => ({ ...prev, trilhas: false }));
      }
    };

    carregarTrilhas();

    const handleFocus = () => carregarTrilhas();
    window.addEventListener("focus", handleFocus);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", handleFocus);
    };
  }, [guiaSelecionado?.id]);

  const handleSaibaMais = (ativacaoId) => {
    navigate(routeUrls.INSCRICAO_TRILHAS.replace(":id", ativacaoId));
  };

  const handleDetalhes = (ativacaoId) => {
    const trilhaSelecionada = trilhas.find(
      (trilha) => trilha.id_ativacao === ativacaoId
    );
    if (trilhaSelecionada) {
      sessionStorage.setItem(
        "ativacaoSelecionadaId",
        trilhaSelecionada.id_ativacao
      );
      navigate(
        routeUrls.DETALHES_EVENTO.replace(
          ":id",
          trilhaSelecionada.id_ativacao
        )
      );
    }
  };

  const filtrarEventos = (eventos) => {
    const termo = termoPesquisa.toLowerCase().trim();
    
    return eventos.filter((evento) => {
      // Filtro de pesquisa por texto
      const matchTexto = !termo || 
        (evento.nome_evento || "").toLowerCase().includes(termo) ||
        (evento.descricao || "").toLowerCase().includes(termo) ||
        (evento.rua || "").toLowerCase().includes(termo) ||
        (evento.nivel_dificuldade || "").toLowerCase().includes(termo);
      
      // Filtro por data
      const matchData = !filtroData || evento.data_ativacao === filtroData;
      
      // Filtro por nível
      const matchNivel = !filtroNivel || 
        (evento.nivel_dificuldade || "").toLowerCase() === filtroNivel.toLowerCase();
      
      // Filtro por categoria
      const matchCategoria = !filtroCategoria || 
        (evento.tipo || "").toLowerCase() === filtroCategoria.toLowerCase();
      
      return matchTexto && matchData && matchNivel && matchCategoria;
    });
  };

  const limparFiltros = () => {
    setFiltroDataTemp("");
    setFiltroNivelTemp("");
    setFiltroCategoriaTemp("");
    setFiltroData("");
    setFiltroNivel("");
    setFiltroCategoria("");
    setTermoPesquisa("");
  };

  const aplicarFiltros = () => {
    setFiltroData(filtroDataTemp);
    setFiltroNivel(filtroNivelTemp);
    setFiltroCategoria(filtroCategoriaTemp);
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
                placeholder="Pesquisar eventos..."
                className="pesquisar-trilha"
                value={termoPesquisa}
                onChange={(e) => setTermoPesquisa(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Seção de Filtros */}
        <div className="filtros-section">
          <div className="filtros-container">
            <div className="filtros-titulo-grupo">
              <h3 className="filtros-titulo">Filtrar Resultados</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="limpar-filtros-btn" onClick={limparFiltros}>
                  Limpar Filtros
                </button>
                <button className="limpar-filtros-btn" onClick={aplicarFiltros}>
                  Aplicar Filtros
                </button>
              </div>
            </div>
            
            <div className="filtros-grid">
              {/* Filtro por Data */}
              <div className="filtro-item">
                <label htmlFor="filtro-data">Data do Evento</label>
                <input
                  id="filtro-data"
                  type="date"
                  value={filtroDataTemp}
                  onChange={(e) => setFiltroDataTemp(e.target.value)}
                  className="filtro-input"
                />
              </div>

              {/* Filtro por Nível */}
              <div className="filtro-item">
                <label htmlFor="filtro-nivel">Nível de Dificuldade</label>
                <select
                  id="filtro-nivel"
                  value={filtroNivelTemp}
                  onChange={(e) => setFiltroNivelTemp(e.target.value)}
                  className="filtro-select"
                >
                  <option value="">Todos os níveis</option>
                  <option value="explorador">Explorador</option>
                  <option value="aventureiro">Aventureiro</option>
                  <option value="desbravador">Desbravador</option>
                </select>
              </div>

              {/* Filtro por Categoria */}
              <div className="filtro-item">
                <label htmlFor="filtro-categoria">Categoria</label>
                <select
                  id="filtro-categoria"
                  value={filtroCategoriaTemp}
                  onChange={(e) => setFiltroCategoriaTemp(e.target.value)}
                  className="filtro-select"
                >
                  <option value="">Todas as categorias</option>
                  <option value="cachoeira">Cachoeira</option>
                  <option value="montanhismo">Montanhismo</option>
                  <option value="trilha">Trilha</option>
                  <option value="rapel">Rapel</option>
                  <option value="escalada">Escalada</option>
                  <option value="camping">Camping</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de destinos */}
        <section className="destinos">
          <h2 className="destinos-titulo">Destinos que você vai amar conhecer</h2>
          {loading.trilhas ? (
            <p>Carregando trilhas...</p>
          ) : error.trilhas ? (
            <p className="erro-msg">{error.trilhas}</p>
          ) : (
            <div className="destinos-grid">
              {filtrarEventos(trilhas).length > 0 ? (
                filtrarEventos(trilhas)
                  .slice(0, 5)
                  .map((trilha) => (
                    <div className="destino-card" key={trilha.id_ativacao}>
                      <img
                        src={trilha.imagemUrl}
                        alt={trilha.nome || trilha.nome_evento}
                        className="destino-img"
                        loading="lazy"
                      />
                      <div className="destino-overlay">
                        <button
                          className="destino-detalhes-btn"
                          onClick={() =>
                            handleSaibaMais(trilha.id_ativacao)
                          }
                        >
                          Detalhes
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                <span className="no-events-text">
                  Nenhum destino encontrado para sua pesquisa.
                </span>
              )}
            </div>
          )}
        </section>

        {/* Seção de anúncios */}
        <section className="anuncios-trilhas">
          <h2 className="anuncios-titulo">
            Um mundo de opções para escolher
          </h2>
          {loading.trilhas ? (
            <p>Carregando anúncios...</p>
          ) : error.trilhas ? (
            <p className="erro-msg">{error.trilhas}</p>
          ) : (
            <div className="anuncios-grid">
              {filtrarEventos(trilhas).length > 0 ? (
                filtrarEventos(trilhas).map((trilha) => (
                  <div className="anuncio-card" key={trilha.id_ativacao}>
                    <div className="anuncio-img-wrap">
                      <img
                        src={trilha.imagemUrl}
                        alt={trilha.titulo || trilha.nome_evento}
                        className="anuncio-img"
                        loading="lazy"
                      />
                    </div>
                    <div className="anuncio-info">
                      <span className="anuncio-local">{trilha.rua}</span>
                      <h3 className="anuncio-titulo">{trilha.nome_evento}</h3>
                      <p className="anuncio-desc">{trilha.descricao}</p>
                      <div className="anuncio-footer">
                        <div className="anuncio-detalhes">
                          {trilha.data_ativacao && (
                            <span>
                              Data:{" "}
                              {trilha.data_ativacao
                                .split("-")
                                .reverse()
                                .join("/")}
                            </span>
                          )}
                        </div>
                        <span className="anuncio-preco">
                          R${trilha.preco}
                          <span className="anuncio-preco-unidade">
                            /pessoa
                          </span>
                        </span>
                        <div className="anuncio-btn-group">
                          <button
                            className="anuncio-btn"
                            onClick={() =>
                              handleSaibaMais(trilha.id_ativacao)
                            }
                          >
                            Saiba Mais
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <span className="no-events-text">
                  Nenhum anúncio encontrado para sua pesquisa.
                </span>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default CatalogoTrilhas;
