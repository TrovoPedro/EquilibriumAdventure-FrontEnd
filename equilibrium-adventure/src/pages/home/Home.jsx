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
        <BannerComHeader />
        <Trilhas />
        <Eventos />
        <Guias />
        <Feedbacks />
      </main>
      <Footer />
    </>
  );
}

export default Home;
