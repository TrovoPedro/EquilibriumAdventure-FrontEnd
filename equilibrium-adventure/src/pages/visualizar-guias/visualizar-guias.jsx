import "./visualizar-guias.css";
import ButtonBack from "../../components/circle-back-button2/circle-back-button2";
import Header from "../../components/header/header";

const VisualizarGuias = () => {
    return (
        <>
            <Header />
            <div className="home-container">
                <div className="titulo-guia">
                    <ButtonBack />

                    <div className="titulo">
                        <p>Guias</p>
                    </div>
                </div>

                <div className="card-father-guias">
                    <div class="lista">
                        <div class="item">
                            <span>Ana Clara</span>
                            <button class="button-lista">Mais Informações</button>
                            <button class="button-lista2">Excluir</button>
                        </div>

                        <div class="item">
                            <span>Roberto</span>
                            <button class="button-lista">Mais Informações</button>
                            <button class="button-lista2">Excluir</button>
                        </div>

                        <div class="item">
                            <span>Júlia</span>
                            <button class="button-lista">Mais Informações</button>
                            <button class="button-lista2">Excluir</button>
                        </div>

                        <div class="item">
                            <span>Alberto</span>
                            <button class="button-lista">Mais Informações</button>
                            <button class="button-lista2">Excluir</button>
                        </div>

                        <div class="item">
                            <span>Eduardo</span>
                            <button class="button-lista">Mais Informações</button>
                            <button class="button-lista2">Excluir</button>
                        </div>

                        <div class="item">
                            <span>Vitória</span>
                            <button class="button-lista">Mais Informações</button>
                            <button class="button-lista2">Excluir</button>
                        </div>

                        <div class="item">
                            <span>Gabriel</span>
                            <button class="button-lista">Mais Informações</button>
                            <button class="button-lista2">Excluir</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default VisualizarGuias