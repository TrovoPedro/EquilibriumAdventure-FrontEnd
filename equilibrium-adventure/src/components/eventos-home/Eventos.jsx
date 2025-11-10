import React, { useEffect, useState } from "react";
import "./Eventos.css";
import eventosImg from "../../assets/img-teste.png";
import { useNavigate } from "react-router-dom";
import { buscarGuias } from "../../services/apiTrilhas";
import { buscarEventosAtivosPorGuia, buscarImagemEvento } from "../../services/apiEvento";
import { listarInscritos } from "../../services/apiInscricao";

const eventoMock = {
  nome: "Trilha da Pedra Grande",
  data: "14-29 Junho",
  guia: "Edgar de Mendonça",
  inscritos: 10,
  imagem: eventosImg
};

export default function Eventos() {
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleCardClick = () => {
    navigate("/login");
  };

  useEffect(() => {
    let isMounted = true;

    const fetchEvento = async () => {
      try {
        const guias = await buscarGuias();
        if (!guias || guias.length === 0) {
          if (isMounted) setEvento(eventoMock);
          return;
        }

        // Pegar eventos de todos os guias
        const eventosPorGuia = await Promise.all(
          guias.map(async (guia) => {
            try {
              const evs = await buscarEventosAtivosPorGuia(guia.id || guia.id_guia || guia.idGuia);
              return (evs || []).map(e => ({ 
                ...e, 
                guiaNome: guia.nome || guia.nome_completo || guia.nomeGuia 
              }));
            } catch (err) {
              return [];
            }
          })
        );

        // Pegar o primeiro evento disponível
        const todosEventos = eventosPorGuia.flat().filter(e => e);
        
        if (todosEventos.length === 0) {
          if (isMounted) setEvento(eventoMock);
          return;
        }

        const primeiroEvento = todosEventos[0];

        // Buscar imagem do evento
        let imagemUrl = eventosImg;
        try {
          const url = await buscarImagemEvento(primeiroEvento.id_evento || primeiroEvento.id);
          if (url) imagemUrl = url;
        } catch (e) {
          // usar fallback
        }

        // Buscar quantidade de inscritos
        let qtdInscritos = 0;
        try {
          const inscritos = await listarInscritos(primeiroEvento.id_ativacao || primeiroEvento.idAtivacao);
          qtdInscritos = Array.isArray(inscritos) ? inscritos.length : 0;
        } catch (e) {
          // ignore
        }

        if (isMounted) {
          setEvento({
            nome: primeiroEvento.nome_evento || primeiroEvento.nome || eventoMock.nome,
            data: formatDate(primeiroEvento.data_ativacao || primeiroEvento.dataAtivacao || primeiroEvento.data),
            guia: primeiroEvento.guiaNome || eventoMock.guia,
            inscritos: qtdInscritos,
            imagem: imagemUrl
          });
        }
      } catch (err) {
        console.error("Erro ao carregar evento:", err);
        if (isMounted) setEvento(eventoMock);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEvento();
    return () => { isMounted = false; };
  }, []);

  const formatDate = (raw) => {
    if (!raw) return eventoMock.data;
    
    // Se já vier em formato YYYY-MM-DD, converte para formato legível
    if (typeof raw === 'string' && raw.includes('-')) {
      const parts = raw.split('T')[0].split('-');
      if (parts.length === 3) {
        const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        const dia = parseInt(parts[2]);
        const mes = meses[parseInt(parts[1]) - 1];
        return `${dia} ${mes}`;
      }
    }
    
    return String(raw).slice(0, 16);
  };

  const eventoExibido = evento || eventoMock;

  return (
    <div className="eventos-container">
      <section className="eventos">
        <div className="eventos-content">
          {loading ? (
            <div className="evento-card" style={{ cursor: "pointer" }}>
              <p>Carregando...</p>
            </div>
          ) : (
            <div className="evento-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
              <img src={eventoExibido.imagem} alt={eventoExibido.nome} />
              <div>
                <h3>{eventoExibido.nome}</h3>
                <p>{eventoExibido.data}</p>
                <span>por {eventoExibido.guia}</span>
                <div className="evento-icons">
                  <span>👥 {eventoExibido.inscritos} pessoas confirmadas</span>
                  <span>♡</span>
                </div>
              </div>
            </div>
          )}

          <div className="evento-tipos">
            <p className="eventos-subtitle">Para aproveitar</p>
            <h2>Encontre o evento ideal para você</h2>
            <ul>
              <li>
                <span className="tipo explorador"></span> 
                <div>
                  <span>Explorador</span>
                  <p>Trilha leve e acessível, perfeita para quem está começando a explorar a natureza.</p>
                </div>
              </li>
              <li>
                <span className="tipo aventureiro"></span> 
                <div>
                  <span>Aventureiro</span>
                  <p>Trilha com nível moderado, indicada para quem busca novos desafios com segurança.</p>
                </div>
              </li>
              <li>
                <span className="tipo desbravador"></span> 
                <div>
                  <span>Desbravador</span>
                  <p>Trilha mais exigente, voltada a quem já tem experiência e deseja uma imersão completa.</p>
                </div>
              </li>
            </ul>
          </div>
          {/* fechamento da div eventos-content */}
        </div>
      </section>
    </div>
  );
}
