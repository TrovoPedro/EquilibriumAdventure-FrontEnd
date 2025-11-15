import React, { useState, useEffect, useRef } from 'react';
import "./Guias.css";
import { buscarGuias } from "../../services/apiTrilhas";
import axios from 'axios';
import noPhotoImg from "../../assets/imagem-do-usuario-grande.png";

export default function Guias() {
  const [guias, setGuias] = useState([]);
  const [guiaAtual, setGuiaAtual] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchGuias = async () => {
      try {
        const data = await buscarGuias();
        if (data && data.length > 0) {
          const guiasProcessados = data.map((guia) => {
            const hasValidBase64 = typeof guia.imagemBase64 === 'string' && guia.imagemBase64.trim().length > 100;
            return {
              id: guia.id,
              nome: guia.nome || 'Nome não informado',
              cidade: guia.endereco ? `${guia.endereco.cidade}, ${guia.endereco.estado}` : '',
              depoimento: guia.descricao || 'Depoimento não disponível no momento.',
              imagem: hasValidBase64 ? `data:image/png;base64,${guia.imagemBase64}` : null
            };
          });
          setGuias(guiasProcessados);
        } else {
          setGuias([]);
        }
      } catch (error) {
        console.error("Erro ao buscar guias:", error);
        setGuias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGuias();
  }, []);

  useEffect(() => {
    // set CSS variable --img-w on each .guia-imagem to match its img width
    const updateOverlayWidths = () => {
      if (!sectionRef.current) return;
      const wrappers = Array.from(sectionRef.current.querySelectorAll('.guia-imagem'));
      wrappers.forEach(w => {
        const img = w.querySelector('img');
        if (img) {
          const wpx = img.clientWidth || img.naturalWidth || 0;
          w.style.setProperty('--img-w', `${wpx}px`);
        }
      });
    };

    // make all images share the same width (desktop only)
    const equalizeImageWidths = () => {
      if (!sectionRef.current) return;
      const imgs = Array.from(sectionRef.current.querySelectorAll('.guia-imagem img'));
      if (imgs.length === 0) return;
      // compute current displayed widths
      const widths = imgs.map(i => i.clientWidth || i.naturalWidth || 0).filter(w => w > 0);
      if (widths.length === 0) return;
      const minWidth = Math.min(...widths);

      // Apply pixel width only on larger viewports to avoid breaking mobile responsiveness
      if (typeof window !== 'undefined' && window.innerWidth >= 768) {
        imgs.forEach(i => {
          i.style.width = `${minWidth}px`;
        });
      } else {
        // on mobile, don't force width — ensure wrappers still get accurate --img-w
          imgs.forEach(i => i.style.width = '');
      }

      // update wrappers' --img-w to match the applied width
      const wrappers = Array.from(sectionRef.current.querySelectorAll('.guia-imagem'));
      wrappers.forEach(w => w.style.setProperty('--img-w', `${minWidth}px`));
        // also set on the section so elements outside the wrapper (like the mobile button) can read it
        sectionRef.current.style.setProperty('--img-w', `${minWidth}px`);
    };

    const imgs = sectionRef.current ? Array.from(sectionRef.current.querySelectorAll('.guia-imagem img')) : [];
    const handlers = [];
    imgs.forEach(img => {
      if (!img.complete) {
        const h = () => updateOverlayWidths();
        img.addEventListener('load', h);
        handlers.push({ img, h });
      }
    });
    // initial update and on resize
    updateOverlayWidths();
    equalizeImageWidths();
    window.addEventListener('resize', updateOverlayWidths);
    window.addEventListener('resize', equalizeImageWidths);

    return () => {
      window.removeEventListener('resize', updateOverlayWidths);
      window.removeEventListener('resize', equalizeImageWidths);
      handlers.forEach(({ img, h }) => img.removeEventListener('load', h));
    };
  }, [guias]);

  const proximoGuia = () => {
    if (guias.length === 0) return;
    setGuiaAtual((prev) => (prev + 1) % guias.length);
    setShowInfo(false);
  };

  const handleImageClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      setShowInfo((s) => !s);
    }
  };

  if (loading) {
    return (
      <section className="guia-section">
        <div className="guia-texto">
          <h4>Aventura Segura</h4>
          <h2>Nossos Guias</h2>
          <p>Carregando guias...</p>
        </div>
        <div className="guia-imagem">
          <div style={{
            width: '100%',
            height: '300px',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px'
          }}>
            Carregando...
          </div>
        </div>
      </section>
    );
  }

  if (guias.length === 0) {
    return (
      <section className="guia-section">
        <div className="guia-texto">
          <h4>Aventura Segura</h4>
          <h2>Nossos Guias</h2>
          <p>Os guias mais preparados para você</p>
          <div className="guia-depoimento">
            <p>"Depoimento não disponível no momento."</p>
            <span>
              — Nenhum guia disponível no momento
            </span>
          </div>
        </div>
        <div className="guia-imagem">
          <img src={noPhotoImg} alt={`Nenhum guia disponível`} />
        </div>
      </section>
    );
  }

  return (
    <section className="guia-section" ref={sectionRef}>
      <div className="guia-texto">
        <h4>Aventura Segura</h4>
        <h2>Nossos Guias</h2>
        <p>Os guias mais preparados para você</p>
        <div className="guia-depoimento">
          <p>"{guias[guiaAtual].depoimento}"</p>
          <span>
            — {guias[guiaAtual].nome}
          </span>
        </div>
        <button onClick={proximoGuia} className='guia-proximo guia-proximo-desktop'>Ver próximo guia</button>
      </div>
      <div className="guia-imagem" onClick={handleImageClick} role="button" tabIndex={0} onKeyDown={(e)=>{ if(e.key === 'Enter') handleImageClick(); }}>
        <img src={guias[guiaAtual].imagem || noPhotoImg} alt={`Foto de ${guias[guiaAtual].nome}`} />
        <div className={`guia-overlay ${showInfo ? 'active' : ''}`}>
          <div className="overlay-content">
            <p className="overlay-depo">"{guias[guiaAtual].depoimento}"</p>
            <span className="overlay-nome">— {guias[guiaAtual].nome}</span>
            {guias[guiaAtual].cidade && (
              <span className="overlay-cidade">{guias[guiaAtual].cidade}</span>
            )}
          </div>
        </div>
      </div>
      <button onClick={proximoGuia} className='guia-proximo guia-proximo-full'>Ver próximo guia</button>
    </section>
  );
}