import React, { useState, useEffect } from "react";
import "./CatalogoTrilhas.css";
import Header from "../../components/header/header-unified";
import { useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";
import { buscarEventosPorGuia, buscarEventosAtivosPorGuia, buscarImagemEvento } from "../../services/apiEvento";
import { useAuth } from "../../context/AuthContext";
import catalogo1 from "../../assets/img12-catalogo.jpg";

const CatalogoTrilhas = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [eventosBase, setEventosBase] = useState([]);
  const [eventosAtivos, setEventosAtivos] = useState([]);
  const [loading, setLoading] = useState({ base: true, ativos: true });
  const [error, setError] = useState({ base: null, ativos: null });
  const [termoPesquisa, setTermoPesquisa] = useState("");

  const filtrarEventos = (eventos) => {
    const termo = termoPesquisa.toLowerCase().trim();
    if (!termo) return eventos;

    return eventos.filter(evento =>
      evento.nome_evento?.toLowerCase().includes(termo) ||
      evento.descricao?.toLowerCase().includes(termo) ||
      evento.rua?.toLowerCase().includes(termo) ||
      evento.nivel_dificuldade?.toLowerCase().includes(termo)
    );
  };

  useEffect(() => {
    let isMounted = true;

    const carregarEventos = async () => {
      if (!usuario?.id) return;

      try {
        const eventosData = await buscarEventosPorGuia(usuario.id);

        const eventosComImagens = await Promise.all(
          eventosData.map(async (evento) => {
            const imagemUrl = await buscarImagemEvento(evento.id_evento);
            return { ...evento, imagemUrl: imagemUrl || catalogo1 };
          })
        );

        if (isMounted) {
          setEventosBase(eventosComImagens);
          setError(prev => ({ ...prev, base: null }));
        }
      } catch (err) {
        console.error("Erro ao carregar eventos base:", err);
        if (isMounted) {
          setError(prev => ({ ...prev, base: "Erro ao carregar os eventos base." }));
        }
      } finally {
        if (isMounted) setLoading(prev => ({ ...prev, base: false }));
      }

      try {
        const eventosAtivosData = await buscarEventosAtivosPorGuia(usuario.id);

        const ativosComImagens = await Promise.all(
          eventosAtivosData.map(async (evento) => {
            const imagemUrl = await buscarImagemEvento(evento.id_evento);
            return { ...evento, imagemUrl: imagemUrl || catalogo1 };
          })
        );

        if (isMounted) {
          setEventosAtivos(ativosComImagens);
          setError(prev => ({ ...prev, ativos: null }));
        }
      } catch (err) {
        console.error("Erro ao carregar eventos ativos:", err);
        if (isMounted) {
          setError(prev => ({ ...prev, ativos: "Erro ao carregar os eventos ativos." }));
        }
      } finally {
        if (isMounted) setLoading(prev => ({ ...prev, ativos: false }));
      }
    };

    carregarEventos();

    return () => {
      isMounted = false;
    };
  }, [usuario]);


  const handleOnClick = (action, eventoId) => {
    if (action === "ativar") {
      navigate(routeUrls.ATIVAR_EVENTO.replace(':id', eventoId));
    } else if (action === "editar") {
      navigate(routeUrls.EDITAR_EVENTO.replace(':id', eventoId));
    } else if (action === "detalhes") {
      const eventoSelecionado = eventosAtivos.find(ev => ev.id_evento === eventoId);
      if (eventoSelecionado && eventoSelecionado.id_ativacao) {
        sessionStorage.setItem('ativacaoSelecionadaId', eventoSelecionado.id_ativacao);
        navigate(routeUrls.DETALHES_EVENTO.replace(':id', eventoSelecionado.id_ativacao));
      }
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
              <h2>Olá, {usuario?.nome || 'Guia'}</h2>
              <p>Bora ver como estão seus eventos?</p>
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

        {/* Seção de eventos ativos */}
        <section className="anuncios-trilhas">
          <h2 className="anuncios-titulo" style={{ textAlign: 'left' }}>Eventos Ativos</h2>
          {loading.ativos && <p className="loading-text">Carregando eventos ativos...</p>}
          {error.ativos && <p className="error-text">{error.ativos}</p>}
          {!loading.ativos && !error.ativos && (
            <div className="anuncios-grid">
              {filtrarEventos(eventosAtivos).length > 0 ? (
                filtrarEventos(eventosAtivos).map((evento, idx) => (
                  <div className="anuncio-card" key={`ativo-${evento.id_evento}-${evento.id_ativacao || idx}`}>
                    <div className="anuncio-img-wrap">
                      <img
                        src={evento.imagemUrl || catalogo1}
                        alt={evento.nome_evento}
                        className="anuncio-img"
                        onError={(e) => (e.target.src = catalogo1)}
                      />
                    </div>
                    <div className="anuncio-info">
                      <span className="anuncio-local">{evento.rua}</span>
                      <h3 className="anuncio-titulo">{evento.nome_evento}</h3>
                      <p className="anuncio-desc">{evento.descricao}</p>
                      <div className="anuncio-footer">
                        <div className="anuncio-detalhes">
                          {evento.data_ativacao && <span>Data: {evento.data_ativacao.split('-').reverse().join('/')}</span>}
                          <span>Dificuldade: {evento.nivel_dificuldade}</span>
                          <span>Distância: {evento.distancia_km}km</span>
                          <span>Horário: {evento.hora_inicio} - {evento.hora_final}</span>
                        </div>
                        <span className="anuncio-preco">R${evento.preco}<span className="anuncio-preco-unidade">/pessoa</span></span>
                        <div className="anuncio-btn-group">
                          <button className="anuncio-btn" onClick={() => handleOnClick("detalhes", evento.id_evento)}>Detalhes</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-events-text">Nenhum evento ativo encontrado.</p>
              )}
            </div>
          )}
        </section>

        {/* Seção de eventos base */}
        <section className="anuncios-trilhas">
          <h2 className="anuncios-titulo">Eventos Base</h2>
          {loading.base && <p className="loading-text">Carregando eventos base...</p>}
          {error.base && <p className="error-text">{error.base}</p>}
          {!loading.base && !error.base && (
            <div className="anuncios-grid">
              {filtrarEventos(eventosBase).length > 0 ? (
                filtrarEventos(eventosBase).map((evento, idx) => (
                  <div className="anuncio-card" key={`base-${evento.id_evento}-${idx}`}>
                    <div className="anuncio-img-wrap">
                      <img
                        src={evento.imagemUrl || catalogo1}
                        alt={evento.nome_evento}
                        className="anuncio-img"
                        onError={(e) => (e.target.src = catalogo1)}
                      />
                    </div>
                    <div className="anuncio-info">
                      <h3 className="anuncio-titulo">{evento.nome_evento}</h3>
                      <span className="anuncio-local">{evento.local}</span>
                      <h3 className="anuncio-titulo">{evento.titulo}</h3>
                      <p className="anuncio-desc">{evento.descricao}</p>
                      <div className="anuncio-footer">
                        <div className="anuncio-btn-group">
                          <button className="anuncio-ativar-btn" onClick={() => handleOnClick("ativar", evento.id_evento)}>Ativar</button>
                          <button className="anuncio-btn" onClick={() => handleOnClick("editar", evento.id_evento)}>Editar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-events-text">Nenhum evento base encontrado.</p>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
};
export default CatalogoTrilhas;