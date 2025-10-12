import "./relatorio-anamnese.css"
import { gerarRelatorioAnamnese } from "../../services/chamadasAPIAgenda";
import { buscarUsuarioPorId } from "../../services/api";
import { data, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import useGoBack from "../../utils/useGoBack";
import Header from "../../components/header/header-unified";
import Header from "../../components/header/header-unified";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RelatorioAnamnese = () => {

    const [nome, setNome] = useState("");
    const navigate = useNavigate();


    const handleExibirNome = async () => {
        try {
            const usuarioLocal = localStorage.getItem("usuario");
            const userId = usuarioLocal ? JSON.parse(usuarioLocal).id : null;
            const usuario = await buscarUsuarioPorId(userId);
            setNome(usuario.nome);
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
        }
    };

    useEffect(() => {
        handleExibirNome();
    }, []);

    const [relatorio, setRelatorio] = useState("");
    const [userId, setUserId] = useState(10);
    
    const handleSalvarRelatorio = async () => {
        try {
            // setRelatorio(document.querySelector('.input2').value.trim());
            // const userId = localStorage.getItem("usuario");
            if (!relatorio) {
                alert("O relatório não pode estar vazio.");
                return false;
            }
            setUserId(10);
            const data = await gerarRelatorioAnamnese({ userId, relatorio });
            alert("Relatório salvo com sucesso!");
            return true;
        } catch (error) {
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
                    <button onClick={useGoBack} className="button-voltar">Voltar</button>
                </div>
            </div>
        </>
    )
}
export default RelatorioAnamnese