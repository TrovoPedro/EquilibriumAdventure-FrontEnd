import "./infos-adic-guia.css";
import Header from "../../components/header/header";
import Mulher from "../../assets/mulher4.jpeg";
import Trilha from "../../assets/img10-catalogo.jpg";
import ButtonAlterar from "../../components/button-padrao/button-alterar"
import Evento1 from "../../assets/img10-catalogo.jpg";
import Evento2 from "../../assets/img11-catalogo.jpg";
import Evento3 from "../../assets/img12-catalogo.jpg";

const CriarInformacoesAdicionaisGuia = (title, onClick) => {
    const titulo = "Salvar Alterações";

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
                    <button className="button-add-data"> Adicionar Datas Para Anamnese</button>
                    <select name="" id="" className="filtro-data">
                        <option value="0" disabled selected>Filtrar Data</option>
                    </select>
                </div>

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
                <div className="father-card1">
                    <p>Eventos Ativos:</p>
                    <div className="card-eventos1">
                        <div className="inicial-data">
                            <div className="imagem-cubo"><img src={Evento1} alt="EVENTO"/></div>

                            <p>Fev 02, 10:00</p>
                        </div>
                        
                        <div className="nome-button">
                            <p>Cachoeira</p>

                            <button>Mais Informações</button>
                        </div> 
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
      </div>
    </>
    )
}
export default CriarInformacoesAdicionaisGuia