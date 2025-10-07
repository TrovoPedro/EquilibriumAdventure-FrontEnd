import "./relatorio-anamnese.css"
import Header from "../../components/header/header-unified";

const RelatorioAnamnese = () => {
    return (
        <>
            <Header />
            <div className="home-container-relatorio">
                <div class="space-relatorio">
                    <p>Relatório</p>
                    <div className="relatorio">
                        <div className="form-container">
                            <div className="form-group">
                                <div className="label-col">
                                    <label>Nome:</label>
                                </div>
                                <input type="text" className="input1" />
                            </div>

                            <div className="form-group">
                                <div className="label-col">
                                    <label>Relatório Anamnese:</label>
                                </div>
                                <textarea type="text" className="input2" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-buttons">
                    <button className="button-salvar">Salvar Relatório</button>
                    <button className="button-voltar">Voltar</button>
                </div>
            </div>
        </>
    )
}
export default RelatorioAnamnese