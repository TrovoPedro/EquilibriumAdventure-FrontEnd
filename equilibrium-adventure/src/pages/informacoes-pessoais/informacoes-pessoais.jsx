
import React from "react";
import "./informacoes-pessoais.css";
import CircleBackButton from "../../components/circle-back-button/circle-back-button";
import InfoPessoaisCard from "../../components/info-pessoais-card/info-pessoais-card";
import EnderecoCard from "../../components/endereco-card/endereco-card";

export default function InformacoesPessoais() {
	return (
		<div className="editar-dados-container">  
			<CircleBackButton onClick={() => window.history.back()} />
			<h1 className="titulo-editar-dados">Dados da Conta</h1>
			<InfoPessoaisCard />
			<EnderecoCard />
			<button className="salvar-btn">Salvar Alterações</button>
		</div>
	);
}
