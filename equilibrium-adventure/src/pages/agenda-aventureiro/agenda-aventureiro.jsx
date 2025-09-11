import "./agenda-aventureiro.css"
import Homem from "../../assets/homem2.jpeg";
import Trilha from "../../assets/img10-catalogo.jpg";
import ButtonBack from "../../components/circle-back-button2/circle-back-button2";

const CriarAgendaAventureiro = () => {
    return (
        <>
            <div className="home-container-agenda">
                <ButtonBack />
                <div className="header-page">
                    <div className="imagem-guia">
                        <img src={Homem} />
                    </div>

                    <div className="nome-convites-guia">
                        <div className="nome-guia">
                            <p>Guilherme Lourenço</p>
                        </div>

                        <button>Ver Convites</button>
                    </div>
                </div>

                <div className="cards-father">
                    <div className="card-info-guia">
                        <p>Informações pessoais</p>
                        <div className="dados-guia">
                            <div className="padding-dados">
                                <ul>
                                    <li><p><b>Idade:</b> 20 anos</p></li>
                                    <li><p><b>E-mail:</b> julianaL@gmail.com</p></li>
                                </ul>
                                <button className="button-dados">Mais Informações</button>
                            </div>
                        </div>
                    </div>
                    <div className="card-imagem">
                        <p>Próximo Evento</p>
                        <div className="dados-guia">
                            <img src={Trilha} alt="EVENTO" />
                        </div>
                    </div>
                </div>

                <div class="space-agenda">
                    <p>Minha agenda</p>
                    <div className="agenda-aventureiro">
                        <div className="container">
                            <div className="linha">
                                <span>Nome da trilha</span>
                                <span>Data da trilha</span>
                                <button className="btn-info">Mais Informações</button>
                                <button className="btn-cancel">Cancelar Inscrição</button>
                            </div>

                            <div className="linha">
                                <span>Nome da trilha</span>
                                <span>Data da trilha</span>
                                <button className="btn-info">Mais Informações</button>
                                <button className="btn-cancel">Cancelar Inscrição</button>
                            </div>

                            <div className="linha">
                                <span>Nome da trilha</span>
                                <span>Data da trilha</span>
                                <button className="btn-info">Mais Informações</button>
                                <button className="btn-cancel">Cancelar Inscrição</button>
                            </div>

                            <div className="linha">
                                <span>Conversa guia</span>
                                <span>Data da conversa</span>
                                <button className="btn-info">Mais Informações</button>
                                <button className="btn-cancel">Cancelar Conversa</button>
                            </div>

                            <div className="linha">
                                <span>Conversa guia</span>
                                <span>Data da conversa</span>
                                <button className="btn-info">Mais Informações</button>
                                <button className="btn-cancel">Cancelar Conversa</button>
                            </div>

                            <div className="linha">
                                <span>Nome da trilha</span>
                                <span>Data da trilha</span>
                                <button className="btn-info">Mais Informações</button>
                                <button className="btn-cancel">Cancelar Inscrição</button>
                            </div>

                            <div className="linha">
                                <span>Nome da trilha</span>
                                <span>Data da trilha</span>
                                <button className="btn-info">Mais Informações</button>
                                <button className="btn-cancel">Cancelar Inscrição</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-agenda">
                    <p>Histórico</p>
                    <div className="agenda-aventureiro">
                        <div className="container">
                            <div className="linha">
                                <span>Nome da trilha</span>
                                <span>Data da trilha</span>
                                <span>Guia: Pedro</span>
                            </div>

                            <div className="linha">
                                <span>Nome da trilha</span>
                                <span>Data da trilha</span>
                                <span>Guia: Pedro</span>
                            </div>

                            <div className="linha">
                                <span>Nome da trilha</span>
                                <span>Data da trilha</span>
                                <span>Guia: Pedro</span>
                            </div>

                            <div className="linha">
                                <span>Conversa guia</span>
                                <span>Data da conversa</span>
                                <span>Guia: Ronaldo</span>
                            </div>

                            <div className="linha">
                                <span>Conversa guia</span>
                                <span>Data da conversa</span>
                                <span>Guia: Ronaldo</span>
                            </div>

                            <div className="linha">
                                <span>Nome da trilha</span>
                                <span>Data da trilha</span>
                                <span>Guia: Ronaldo</span>
                            </div>

                            <div className="linha">
                                <span>Nome da trilha</span>
                                <span>Data da trilha</span>
                                <span>Guia: Pedro</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CriarAgendaAventureiro