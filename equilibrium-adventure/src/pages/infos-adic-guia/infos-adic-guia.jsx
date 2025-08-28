import "./infos-adic-guia.css";
import Header from "../../components/header/header";
import Mulher from "../../assets/mulher4.jpeg";
import Trilha from "../../assets/img10-catalogo.jpg";

const CriarInformacoesAdicionaisGuia = () => {
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
                        <button>Salvar Alterações</button>
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
      </div>
    </>
    )
}
export default CriarInformacoesAdicionaisGuia