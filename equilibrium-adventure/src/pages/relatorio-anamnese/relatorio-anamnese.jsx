import "./relatorio-anamnese.css"
import Header from "../../components/header/header-unified";
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
                <div className="space-relatorio">
                    <p>Relatório</p>
                    <div className="relatorio">
                        <div className="form-container">
                            <div className="form-group">
                                <div className="label-col">
                                    <label>Nome:</label>
                                </div>
                                <input type="text" disabled value={nome} className="input1"/>
                            </div>

                            <div className="form-group">
                                <div className="label-col">
                                    <label>Relatório Anamnese:</label>
                                </div>
                                <textarea type="text" className="input2" onChange={(e) => setRelatorio(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-buttons">
                    <button className="button-salvar" onClick={async () => {
                            const ok = await handleSalvarRelatorio();
                            if (ok) navigate("/catalogo-trilhas");
                        }}>Salvar Relatório</button>
                    <button className="button-voltar">Voltar</button>
                </div>
            </div>
        </>
    )
}
export default RelatorioAnamnese