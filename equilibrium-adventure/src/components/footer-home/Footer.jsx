import "./Footer.css";
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loadingLink, setLoadingLink] = useState(null);

  // Função para navegação suave para seções
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
      return true;
    } else {
      // Se a seção não existir, rola para o topo da página
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
  };

  // Função para lidar com cliques nos links
  const handleLinkClick = async (e, sectionId) => {
    e.preventDefault();
    setLoadingLink(sectionId);
    
    try {
      // Se não estiver na página Home, navegar para lá primeiro
      if (location.pathname !== '/') {
        navigate('/');
        // Aguardar um pouco para a página carregar antes de fazer o scroll
        setTimeout(() => {
          scrollToSection(sectionId);
          setLoadingLink(null);
        }, 300);
      } else {
        // Se já estiver na Home, fazer scroll direto
        scrollToSection(sectionId);
        setTimeout(() => setLoadingLink(null), 500);
      }
    } catch (error) {
      console.error('Erro na navegação:', error);
      setLoadingLink(null);
    }
  };

  // Função para navegação entre páginas
  const handlePageNavigation = (e, route) => {
    e.preventDefault();
    setLoadingLink(route);
    navigate(route);
    setTimeout(() => setLoadingLink(null), 300);
  };

  // Função para abrir WhatsApp
  const openWhatsApp = () => {
    const phoneNumber = "5511973005528"; // +55 11 97300-5528
    const message = "Olá! Gostaria de obter mais informações sobre a Equilibrium Adventure.";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Abre em uma nova aba
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Função para verificar se o link está ativo
  const isActive = (sectionId) => {
    return location.pathname === '/' && location.hash === `#${sectionId}`;
  };

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section footer-brand">
            <h3>Equilibrium Adventure</h3>
            <p>Reserve sua trilha em minutos e tenha o controle total por muito mais tempo. Conecte-se com a natureza de forma segura e inesquecível.</p>
            <div className="social-icons">
              <a href="https://www.instagram.com/equilibrium_adventure?igsh=YW8wa2hyaXJ3cDRq" className="social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>       
              <a 
                href="#" 
                className="social-link" 
                aria-label="WhatsApp" 
                onClick={(e) => {
                  e.preventDefault();
                  openWhatsApp();
                }}
                style={{ cursor: 'pointer' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.488"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Navegação</h4>
            <ul>
              <li>
                <a 
                  href="#home" 
                  onClick={(e) => handleLinkClick(e, 'home')}
                  className={`${isActive('home') ? 'active' : ''} ${loadingLink === 'home' ? 'loading' : ''}`}
                >
                  🏠 Home
                </a>
              </li>
              <li>
                <a 
                  href="#trilhas-section" 
                  onClick={(e) => handleLinkClick(e, 'trilhas-section')}
                  className={`${isActive('trilhas-section') ? 'active' : ''} ${loadingLink === 'trilhas-section' ? 'loading' : ''}`}
                >
                  🥾 Trilhas
                </a>
              </li>
              <li>
                <a 
                  href="#eventos-section" 
                  onClick={(e) => handleLinkClick(e, 'eventos-section')}
                  className={`${isActive('eventos-section') ? 'active' : ''} ${loadingLink === 'eventos-section' ? 'loading' : ''}`}
                >
                  🎯 Eventos
                </a>
              </li>
              <li>
                <a 
                  href="#guias-section" 
                  onClick={(e) => handleLinkClick(e, 'guias-section')}
                  className={`${isActive('guias-section') ? 'active' : ''} ${loadingLink === 'guias-section' ? 'loading' : ''}`}
                >
                  🧭 Nossos Guias
                </a>
              </li>
              <li>
                <a 
                  href="#feedbacks-section" 
                  onClick={(e) => handleLinkClick(e, 'feedbacks-section')}
                  className={`${isActive('feedbacks-section') ? 'active' : ''} ${loadingLink === 'feedbacks-section' ? 'loading' : ''}`}
                >
                  💬 Feedback
                </a>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Suporte</h4>
            <ul>
              <li><a href="#faq" onClick={(e) => handleLinkClick(e, 'faq')}>Ajuda/FAQ</a></li>
              <li>
                <a 
                  href="#contato" 
                  onClick={(e) => {
                    e.preventDefault();
                    openWhatsApp();
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  Entre em Contato
                </a>
              </li>
              <li><a href="/Termos de Uso.pdf" download="Termos-de-Uso.pdf" target="_blank">Termos de Uso</a></li>
              <li><a href="/Politica-de-Privacidade.pdf" download="Politica-de-Privacidade.pdf" target="_blank">Política de Privacidade</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contato</h4>
            <ul>
              <li>
                <span className="contact-icon">📱</span>
                <a>(11) 97300-5528</a>
              </li>
              <li>
                <span className="contact-icon">📍</span>
                <span>São Paulo, SP - Brasil</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-copyright">
            <p>&copy; 2024 Equilibrium Adventure.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
