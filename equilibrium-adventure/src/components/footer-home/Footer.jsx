import "./Footer.css";

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div>
          <h3>Equilibrium Adventure</h3>
          <p>Reserve sua trilha em minutos e tenha o controle total por muito mais tempo.</p>
        </div>
        <div>
          <h4>Empresa</h4>
          <ul>
            <li>Home</li>
            <li>Achar Trilha</li>
            <li>Seu Destino</li>
            <li>Nossos Guias</li>
            <li>Acesso Guia</li>
          </ul>
        </div>
        <div>
          <h4>Contato</h4>
          <ul><li>Ajuda/FAQ</li></ul>
        </div>
        <div>
          <h4>Mais</h4>
          <ul>
            <li>Instagram</li>
            <li>Telefone</li>
            <li>E-mail</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
