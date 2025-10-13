import "./relatorio-anamnese.css"
import Header from "../../components/header/header-unified";
import ButtonBack from "../../components/circle-back-button2/circle-back-button2";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RelatorioAnamnese = () => {

    const [nome, setNome] = useState("");
    const navigate = useNavigate();


    const handleExibirNome = async () => {
        try {
            const userId = 10; // Substitua pelo ID do usuário que você deseja buscar
            const usuario = await buscarUsuarioPorId(userId);
            setNome(usuario.nome);
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
        }
    };

    useEffect(() => {
        // chama a função ao montar a página
        handleExibirNome();
    }, []);

    const [relatorio, setRelatorio] = useState("");
    const [userId, setUserId] = useState(10);
    
    const handleSalvarRelatorio = async () => {
        try {
            // setRelatorio(document.querySelector('.input2').value.trim());
            // const userId = localStorage.getItem("usuario");
            console.log("userId:", userId);
            console.log("relatorio:", relatorio);
            setUserId(10);
            const data = await gerarRelatorioAnamnese({ userId, relatorio });
            alert("Relatório salvo com sucesso!");
            console.log("Relatório salvo:", data);
            return true;
        } catch (error) {
            console.error("Erro ao salvar relatório:", error);
            alert("Erro ao salvar relatório. Tente novamente.");
            return false;
        }
    };
    return (
        <>
            <Header />
            <div className="home-container-relatorio">
                <div className="div-title">
                    <div className="editar-evento-header">
                        <ButtonBack onClick={() => navigate(-1)} />
                        <h1 className="h1-title">Relatório de Anamnese</h1>
                    </div>
                </div>
                <div className="form-card-anamnese">
                    <form className="form-container" onSubmit={async (e) => {
                        e.preventDefault();
                        const ok = await handleSalvarRelatorio();
                        if (ok) navigate("/catalogo-trilhas");
                    }}>
                        <div className="form-group">
                            <label htmlFor="nome">Nome:</label>
                            <input id="nome" type="text" disabled value={nome} className="input1"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="relatorio">Relatório Anamnese:</label>
                            <textarea id="relatorio" type="text" className="input2" onChange={(e) => setRelatorio(e.target.value)} />
                        </div>
                        <div className="form-actions">
                            <button className="button-salvar" type="submit">Salvar Relatório</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
export default RelatorioAnamnese