// import Header from "./pages/Header.jsx";

import BannerComHeader from "../../components/banner-header/BannerComHeader.jsx";
import Trilhas from "../../components/trilhas-home/Trilhas.jsx";
import Eventos from "../../components/eventos-home/Eventos.jsx";
import Guias from "../../components/guias-home/Guias.jsx";
import Feedbacks from "../../components/feedback-home/Feedbacks.jsx";
import Footer from "../../components/footer-home/Footer.jsx";

const Home = () => {
  return (
    <>
      <main>
        <div id="home">
          <BannerComHeader />
        </div>
        <div id="trilhas-section">
          <Trilhas />
        </div>
        <div id="eventos-section">
          <Eventos />
        </div>
        <div id="guias-section">
          <Guias />
        </div>
        <div id="feedbacks-section">
          <Feedbacks />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Home;
