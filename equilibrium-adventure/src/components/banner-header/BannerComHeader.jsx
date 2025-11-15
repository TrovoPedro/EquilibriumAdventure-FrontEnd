import "./Banner.css";
import bannerImg from "../../assets/img-teste2.jpg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function BannerComHeader() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Função para realizar scroll suave até uma seção específica
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className={`banner ${menuOpen ? 'menu-open' : ''}`}>
        <header className="main-header">
          <nav className={menuOpen ? 'nav open' : 'nav'}>
            <button
              className={`hamburger ${menuOpen ? 'is-active' : ''}`}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span />
              <span />
              <span />
            </button>

            <ul className={`menu ${menuOpen ? 'open' : ''}`}>
              <li><a href="#" onClick={() => { scrollToSection('trilhas-section'); setMenuOpen(false); }}>ACHAR TRILHA</a></li>
              <li><a href="#" onClick={() => { scrollToSection('eventos-section'); setMenuOpen(false); }}>EVENTOS</a></li>
              <li><a href="#" onClick={() => { scrollToSection('guias-section'); setMenuOpen(false); }}>NOSSOS GUIAS</a></li>
              <li><a href="#" onClick={() => { scrollToSection('feedbacks-section'); setMenuOpen(false); }}>FEEDBACKS</a></li>
              <li className="auth-group">
                <button onClick={() => { navigate("/Cadastro"); setMenuOpen(false); }} className="btn btn-create">CRIAR CONTA</button>
                <button onClick={() => { navigate("/Login"); setMenuOpen(false); }} className="btn btn-enter">ENTRAR</button>
              </li>
            </ul>
          </nav>
      </header>
      <div className="imagem-pai">
        <img src={bannerImg} alt="Banner trilha" className="banner-img" />
        <div className="banner-text">
          <h1>FAÇA AS MALAS</h1>
          <h2>Vamos para algum lugar incrível</h2>
        </div>
      </div>
    </div>
  );
}