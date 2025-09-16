import React, { useState } from "react";
import "./infos-adic-guia.css";
import Header from "../../components/header/header";
import Beneficiario from "../../assets/beneficiario.png";
import Trilha from "../../assets/cachoeiralago.jpg";
import ButtonAlterar from "../../components/button-padrao/button-alterar"
import Evento1 from "../../assets/cachoeiralago.jpg";
import Evento2 from "../../assets/chile.jpg";
import Evento3 from "../../assets/img12-catalogo.jpg";
import EscolhaDataCard from "../escolher-data/escolher-data";

const CriarInformacoesAdicionaisGuia = (title, onClick) => {
    const [showEscolherData, setShowEscolherData] = useState(false);
    const titulo = "Salvar Alterações";

    return (
    <>
      <Header />
      <div className="home-container">
        <div className="card-guia">
            <div className="foto-guia"><img src={Beneficiario} alt="GUIA"/></div>
            <div className="info-guia">
                <p>Edgar Oliveira</p>
                <p>Guia</p>
            </div>
        </div>

        <div className="cards-father">
            <div className="card-info-guia">
                <p>Informações pessoais</p>
                <div className="dados-guia">
                    <div className="padding-dados">
                        <ul>
                            <li><p><b>E-mail:</b> edgarmoliveira@gmail.com</p></li>
                            <li><p><b>Senha:</b> ********</p></li>
                            <li><p><b>Descrição:</b> Guia há 10 anos...</p></li>
                        </ul>
                        {/* <ButtonAlterar title={titulo} onClick={onClick}/> */}
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
                    <button
                        className="button-add-data"
                        onClick={() => setShowEscolherData(true)}
                    >
                        Adicionar Datas Para Anamnese
                    </button>
                    <select name="" id="" className="filtro-data">
                        <option value="0" disabled selected>Filtrar Data</option>
                    </select>
                </div>

               
                    <p>Aventureiros para Anamnese:</p>
                    <div className="card-eventos">
                        <div className="inicial-data">
                            <div className="cubo-inicial" style={{ backgroundColor: "blue" }}>J</div>

                            <p>Jan 2, 14:30</p>
                        </div>
                    
                        <div className="nome-button">
                            <p>João Ribeiro</p>

                            <button>Relatório</button>
                        </div>
                    </div>
               

                <div className="card-eventos">
                    <div className="inicial-data">
                        <div className="cubo-inicial" style={{ backgroundColor: "#ea96cf" }}>C</div>

                        <p>Fev 24, 11:30</p>
                    </div>
                    
                    <div className="nome-button">
                        <p>Carolina Andrade</p>

                        <button>Relatório</button>
                    </div>
                </div>

                <div className="card-eventos">
                    <div className="inicial-data">
                        <div className="cubo-inicial" style={{ backgroundColor: "#b11c1cff" }}>L</div>

                        <p>Abr 15, 10:00</p>
                    </div>
                    
                    <div className="nome-button">
                        <p>Leandro Alves</p>

                        <button>Relatório</button>
                    </div>
                </div>
            </div>

            <div className="eventos-anamnese-ativos">
                <select name="" id="" className="filtro-data">
                        <option value="0" disabled selected>Filtrar Data</option>
                </select>
                    <p>Eventos Ativos:</p>
                    <div className="card-eventos">
                        <div className="inicial-data">
                            <div className="imagem-cubo"><img src={Evento1} alt="EVENTO"/></div>

                            <p>Fev 02, 10:00</p>
                        </div>
                        
                        <div className="nome-button">
                            <p>Cachoeira</p>

                            <button>Mais Informações</button>
                        </div> 
                    </div>

                <div className="card-eventos">
                    <div className="inicial-data">
                        <div className="imagem-cubo"><img src={Evento2} alt="EVENTO"/></div>

                        <p>Mar 13, 17:00</p>
                    </div>
                    
                    <div className="nome-button">
                        <p>Montanha</p>

                        <button>Mais Informações</button>
                    </div>
                </div>

                <div className="card-eventos">
                    <div className="inicial-data">
                        <div className="imagem-cubo"><img src={Evento3} alt="EVENTO"/></div>

                        <p>Mai 29, 08:00</p>
                    </div>
                    
                    <div className="nome-button">
                        <p>Trilha</p>

                        <button>Mais Informações</button>
                    </div>
                </div>
            </div>
        </div>
        {showEscolherData && (
            <EscolhaDataCard
                onClose={() => setShowEscolherData(false)}
                fkAventureiro={null}
            />
        )}
      </div>
    </>
    )
}
export default CriarInformacoesAdicionaisGuia