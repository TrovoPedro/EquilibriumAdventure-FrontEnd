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
                    <div className="lista">
                        <div className="item">
                            <span>Ana Clara</span>
                            <button className="button-lista">Mais Informações</button>
                            <button className="button-lista2">Excluir</button>
                        </div>

                        <div className="item">
                            <span>Roberto</span>
                            <button className="button-lista">Mais Informações</button>
                            <button className="button-lista2">Excluir</button>
                        </div>

                        <div className="item">
                            <span>Júlia</span>
                            <button className="button-lista">Mais Informações</button>
                            <button className="button-lista2">Excluir</button>
                        </div>

                        <div className="item">
                            <span>Alberto</span>
                            <button className="button-lista">Mais Informações</button>
                            <button className="button-lista2">Excluir</button>
                        </div>

                        <div className="item">
                            <span>Eduardo</span>
                            <button className="button-lista">Mais Informações</button>
                            <button className="button-lista2">Excluir</button>
                        </div>

                        <div className="item">
                            <span>Vitória</span>
                            <button className="button-lista">Mais Informações</button>
                            <button className="button-lista2">Excluir</button>
                        </div>

                        <div className="item">
                            <span>Gabriel</span>
                            <button className="button-lista">Mais Informações</button>
                            <button className="button-lista2">Excluir</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default VisualizarGuias