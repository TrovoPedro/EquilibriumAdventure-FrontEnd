import React, { useEffect, useState } from "react";
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
              return (evs || [])
                .filter(e => (e.log || "").trim().toUpperCase() !== "FINALIZADO")
                .map(e => ({ ...e, guiaNome: guia.nome || guia.nome_completo || guia.nomeGuia }));
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

  return (
    <section className="trilhas">
      <h2>Seu próximo lugar favorito o aguarda</h2>
      <div className="cards">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          eventos.map((t, i) => {
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
        )}
      </div>
    </section>
  );
}
