import "./Banner.css";
import bannerImg from "../../assets/img-teste2.jpg";
import { useNavigate } from "react-router-dom";

export default function BannerComHeader() {
  const navigate = useNavigate();
  return (
    <div className="banner">
      <header className="main-header">
          <nav>
            <ul className="menu">
              <li><a href="#">HOME</a></li>
              <li><a href="#">ACHAR TRILHA</a></li>
              <li><a href="#">NOSSOS GUIAS</a></li>
              <li><a href="#">FEEDBACKS</a></li>
              <li onClick = {()=>navigate("/Cadastro")} className="btn"> CRIAR CONTA</li>
              <li onClick = {()=>navigate("/Login")} className="btn"> ENTRAR</li>
            </ul>
          </nav>
      </header>

  <img src={bannerImg} alt="Banner trilha" className="banner-img" />
      <div className="banner-text">
        <h1 className="text-wrap">Faça as malas, vamos para algum lugar incrível!</h1>
      </div>
    </div>
  );
}