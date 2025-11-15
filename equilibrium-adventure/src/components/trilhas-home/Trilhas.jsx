import React, { useEffect, useState, useRef } from "react";
import "./Trilhas.css";
import trilhasImg1 from "../../assets/trilha1.jpg";
import trilhasImg2 from "../../assets/trilha2.jpg";
import trilhasImg3 from "../../assets/trilha3.jpg";
import { useNavigate } from "react-router-dom";
import { buscarGuias } from "../../services/apiTrilhas";
import { buscarEventosAtivosPorGuia, buscarImagemEvento } from "../../services/apiEvento";

const trilhasMock = [
  { img: trilhasImg1, title: "Lago das Carpas", km: "5,2 km", days: "5 Dias de Trilha" },
  { img: trilhasImg2, title: "Trilha do Bonete", km: "10 km", days: "7 Dias de Trilha" },
  { img: trilhasImg3, title: "Pedro do Macelo", km: "7,5 km", days: "10 Dias de Trilha" }
];

export default function Trilhas() {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCardClick = () => {
    navigate("/login");
  };

  const cardsRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateNav = () => {
    const el = cardsRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 5);
    setCanNext(el.scrollLeft + el.clientWidth + 5 < el.scrollWidth);
  };

  const scrollByCard = (dir = 1) => {
    const el = cardsRef.current;
    if (!el) return;
    const firstCard = el.querySelector('.card');
    const gapComputed = parseInt(getComputedStyle(el).gap || 16, 10) || 16;
    const cardWidth = firstCard ? firstCard.offsetWidth + gapComputed : Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
  };

  // mobile navigation (deck)
  const showNext = () => {
    setActiveIndex((prev) => (visibleEventos.length ? (prev + 1) % visibleEventos.length : 0));
  };

  const showPrev = () => {
    setActiveIndex((prev) => (visibleEventos.length ? (prev - 1 + visibleEventos.length) % visibleEventos.length : 0));
  };

  useEffect(() => {
    updateNav();
    const el = cardsRef.current;
    if (!el) return;
    const onScroll = () => updateNav();
    window.addEventListener('resize', updateNav);
    el.addEventListener('scroll', onScroll, { passive: true });
    // detect mobile breakpoint and set state
    const mql = window.matchMedia && window.matchMedia('(max-width: 900px)');
    const setMq = () => setIsMobile(mql ? mql.matches : window.innerWidth <= 900);
    setMq();
    if (mql && mql.addEventListener) mql.addEventListener('change', setMq);
    else if (mql && mql.addListener) mql.addListener(setMq);

    return () => {
      window.removeEventListener('resize', updateNav);
      el.removeEventListener('scroll', onScroll);
      if (mql && mql.removeEventListener) mql.removeEventListener('change', setMq);
      else if (mql && mql.removeListener) mql.removeListener(setMq);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, eventos.length]);

  useEffect(() => {
    let isMounted = true;

    const fetch = async () => {
      try {
        const guias = await buscarGuias();
        // pegar até 3 guias que são exibidas na home (usar as primeiras 3)
        const guiasExibidos = (guias || []).slice(0, 3);

        // Para cada guia, pegar eventos ativos
        const eventosPorGuia = await Promise.all(
          guiasExibidos.map(async (guia) => {
            try {
              const evs = await buscarEventosAtivosPorGuia(guia.id || guia.id_guia || guia.idGuia);
              return (evs || []).map(e => ({ ...e, guiaNome: guia.nome || guia.nome_completo || guia.nomeGuia }));
            } catch (err) {
              return [];
            }
          })
        );

        // selecionar até 3 eventos tentando diversificar por guia (round-robin)
        const buckets = eventosPorGuia.filter(arr => arr && arr.length > 0);
        const selecionados = [];
        let i = 0;
        while (selecionados.length < 3 && buckets.length > 0) {
          const bucket = buckets[i % buckets.length];
          if (bucket.length > 0) {
            selecionados.push(bucket.shift());
          }
          for (let j = buckets.length - 1; j >= 0; j--) if (buckets[j].length === 0) buckets.splice(j, 1);
          i++;
        }

        if (selecionados.length === 0) {
          // fallback para os mocks originais
          if (isMounted) {
            setEventos(trilhasMock.map((t, idx) => ({
              id: `mock-${idx}`,
              nome_evento: t.title,
              imagemUrl: t.img,
              distancia: t.km,
              dias: t.days
            })));
          }
        } else {
          // buscar imagem para cada evento selecionado
          const withImgs = await Promise.all(
            selecionados.map(async (ev, idx) => {
              let imagemUrl = trilhasMock[idx % trilhasMock.length].img;
              try {
                const url = await buscarImagemEvento(ev.id_evento || ev.id);
                if (url) imagemUrl = url;
              } catch (e) {
                // ignore, usar fallback
              }
              return { ...ev, imagemUrl };
            })
          );
          if (isMounted) setEventos(withImgs);
        }
      } catch (err) {
        console.error("Erro ao carregar trilhas/events:", err);
        // fallback mocks
        if (isMounted) setEventos(trilhasMock.map((t, idx) => ({
          id: `mock-${idx}`,
          nome_evento: t.title,
          imagemUrl: t.img,
          distancia: t.km,
          dias: t.days
        })));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetch();
    return () => { isMounted = false; };
  }, []);

  const getDistance = (ev) => {
    if (!ev || ev.distancia_km == null) return null;
    return `${ev.distancia_km} km`;
  };

  const isPedraAzul = (ev) => {
    if (!ev) return false;
    const name = (ev.nome_evento || ev.title || ev.name || '').toString().toLowerCase();
    return name.includes('pedra azul') || name.includes('trilha da pedra azul');
  };

  // Card customizado a ser exibido junto aos demais
  const customCard = {
    id: 'custom-trilha-mirante',
    nome_evento: 'Trilha do Mirante',
    imagemUrl: trilhasImg1,
    distancia_km: 3.2,
    dias: '1 Dia de Trilha'
  };

  const formatDate = (raw) => {
    if (!raw) return null;
    // se já vier em formato YYYY-MM-DD, converte para DD/MM/YYYY
    if (typeof raw === 'string' && raw.includes('-')) {
      const parts = raw.split('T')[0].split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    // se vier em timestamp numérico
    const num = Number(raw);
    if (!Number.isNaN(num)) {
      const d = new Date(num);
      return d.toLocaleDateString();
    }
    // fallback: retornar como string curta
    return String(raw).slice(0, 16);
  };

  // preparar lista visível: filtrar Pedra Azul e garantir card custom
  const visibleEventos = eventos.filter((t) => !isPedraAzul(t));
  if (!visibleEventos.some(e => e && (e.id === customCard.id || e.nome_evento === customCard.nome_evento))) {
    visibleEventos.push(customCard);
  }

  // keep activeIndex in range when visibleEventos changes
  useEffect(() => {
    if (activeIndex >= visibleEventos.length) setActiveIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleEventos.length]);

  return (
    <section className="trilhas">
      <h2>Seu próximo lugar favorito o aguarda</h2>
      <div className="cards-wrapper">
        <button
          className="trilhas-nav prev"
          onClick={() => (isMobile ? showPrev() : scrollByCard(-1))}
          aria-label="Anterior"
          disabled={!canPrev && !isMobile}
        >
          ‹
        </button>
        <div className={`cards ${isMobile ? 'stacked' : ''}`} ref={cardsRef}>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            isMobile ? (
              // render apenas o card ativo na versão mobile
              (() => {
                if (visibleEventos.length === 0) return null;
                const t = visibleEventos[activeIndex % visibleEventos.length];
                const distance = getDistance(t);
                const rawDate = t.data_ativacao || t.data_inicio || t.data || t.dataEvento || t.date || t.dias;
                const dateStr = formatDate(rawDate);
                return (
                  <div
                    className="card mobile-single"
                    key={t.id || activeIndex}
                    onClick={handleCardClick}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={t.imagemUrl} alt={t.nome_evento || t.title || 'Trilha'} />
                    <div className="card-info">
                      <h3>{t.nome_evento || t.title}</h3>
                      {distance && <p>{distance}</p>}
                      {dateStr && <span>{dateStr}</span>}
                    </div>
                  </div>
                );
              })()
            ) : (
              visibleEventos.map((t, i) => {
                const distance = getDistance(t);
                const rawDate = t.data_ativacao || t.data_inicio || t.data || t.dataEvento || t.date || t.dias;
                const dateStr = formatDate(rawDate);
                return (
                  <div className="card" key={t.id || i} onClick={handleCardClick} style={{ cursor: "pointer" }}>
                    <img src={t.imagemUrl} alt={t.nome_evento || t.title || 'Trilha'} />
                    <div className="card-info">
                      <h3>{t.nome_evento || t.title}</h3>
                      {distance && <p>{distance}</p>}
                      {dateStr && <span>{dateStr}</span>}
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
        <button
          className="trilhas-nav next"
          onClick={() => (isMobile ? showNext() : scrollByCard(1))}
          aria-label="Próximo"
          disabled={!canNext && !isMobile}
        >
          ›
        </button>
      </div>
    </section>
  );
}
