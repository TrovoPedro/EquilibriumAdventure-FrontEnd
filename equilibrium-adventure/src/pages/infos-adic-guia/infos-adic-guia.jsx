import "./infos-adic-guia.css";
import Header from "../../components/header/header";
import Mulher from "../../assets/mulher4.jpeg";
import Trilha from "../../assets/img10-catalogo.jpg";
import EscolhaDataCard from "../escolher-data/escolher-data";

import { useState } from "react";

const CriarInformacoesAdicionaisGuia = () => {
  const titulo = "Salvar Alterações";
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Header />
      <div className="home-container">
        <div className="card-guia">
          <div className="foto-guia"><img src={Mulher} alt="GUIA"/></div>
          <div className="info-guia">
            <p>Juliana Lopes Oliveira</p>
            <p>Guia</p>
          </div>
        </div>

        <div className="cards-father">
          <div className="card-info-guia">
            <p>Informações pessoais</p>
            <div className="dados-guia">
              <div className="padding-dados">
                <ul>
                  <li><p><b>Idade:</b> 28 anos</p></li>
                  <li><p><b>E-mail:</b> julianaL@gmail.com</p></li>
                  <li><p><b>Senha:</b> ********</p></li>
                  <li><p><b>Descrição:</b> Guia há 5 anos...</p></li>
                </ul>
                <button className="button-dados">Salvar Alterações</button>
              </div>
            </div>
          </div>

          <div className="card-imagem">
            <p>Próximo Evento</p>
            <div className="dados-guia">
              <img src={Trilha} alt="EVENTO"/>
            </div>
          </div>
        </div>

        <div className="cards-eventos">
          <div className="eventos-anamnese-ativos">
            <div className="filtro-button-data">
              <button className="button-add-data" onClick={() => setOpenModal(true)}>
                Adicionar Datas Para Anamnese
              </button>
              <select name="" id="" className="filtro-data">
                <option value="0" disabled selected>Filtrar Data</option>
              </select>
            </div>

            {/* Renderiza o popup somente se openModal for true */}
            {openModal && <EscolhaDataCard onClose={() => setOpenModal(false)} />}

            <div className="father-card1">
              <p>Aventureiros para Anamnese:</p>
              <div className="card-eventos1">
                <div className="inicial-data">
                  <div className="cubo-inicial" style={{ backgroundColor: "blue" }}>J</div>
                  <p>Jan 2, 14:30</p>
                </div>
                <div className="nome-button">
                  <p>João Ribeiro</p>
                  <button>Relatório</button>
                </div>
              </div>
            </div>

            {/* outros cards... */}
          </div>
        </div>
      </div>
    </>
  );
};

export default CriarInformacoesAdicionaisGuia;
