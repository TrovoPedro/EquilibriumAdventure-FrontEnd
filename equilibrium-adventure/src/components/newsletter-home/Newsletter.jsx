import "./Newsletter.css";

export default function Newsletter() {
  return (
    <section className="newsletter">
      <div className="newsletter-box">
        <p>Digite aqui o seu e-mail para ficar por dentro das nossas próximas aventuras juntos: </p>
        <form>
          <input type="email" placeholder="Seu e-mail" />
          <button type="submit" className="btn-enviar" >Enviar</button>
        </form>
      </div>
    </section>
  );
}
