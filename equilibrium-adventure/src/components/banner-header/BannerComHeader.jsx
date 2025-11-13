import "./Banner.css";
import bannerImg from "../../assets/img-teste2.jpg";
import { useNavigate } from "react-router-dom";

export default function BannerComHeader() {
  const navigate = useNavigate();

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
    <div className="banner">
      <header className="main-header">
          <nav>
            <ul className="menu">
              <li><a href="#" onClick={() => scrollToSection('trilhas-section')}>ACHAR TRILHA</a></li>
              <li><a href="#" onClick={() => scrollToSection('eventos-section')}>EVENTOS</a></li>
              <li><a href="#" onClick={() => scrollToSection('guias-section')}>NOSSOS GUIAS</a></li>
              <li><a href="#" onClick={() => scrollToSection('feedbacks-section')}>FEEDBACKS</a></li>
              <li onClick={() => navigate("/Cadastro")} className="btn btn-create">CRIAR CONTA</li>
              <li onClick={() => navigate("/Login")} className="btn btn-enter">ENTRAR</li>
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