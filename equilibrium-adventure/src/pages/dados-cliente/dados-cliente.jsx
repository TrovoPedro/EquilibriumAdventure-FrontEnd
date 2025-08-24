import React, { useEffect } from "react";
import "./dados-cliente.css";
import CircleBackButton from "../../components/circle-back-button/circle-back-button";
import InfoPessoaisCard from "../../components/info-pessoais-card/info-pessoais-card";
import EnderecoCard from "../../components/endereco-card/endereco-card";

export default function DadosCliente() {
	useEffect(() => {
		// Dados fixos para cada input
		const dadosFixos = {
			nome: "João Silva",
			email: "joao@email.com",
			senha: "********",
			telefone: "(11) 99999-9999",
			"data-nascimento": "2000-01-01",
			cpf: "123.456.789-00",
			rg: "12.345.678-9",
			idiomas: "Português, Inglês",
			"contato-emergencia": "Maria Silva (11) 98888-8888",
			cep: "12345-678",
			cidade: "São Paulo",
			estado: "SP",
			bairro: "Centro",
			numero: "123",
			complemento: "Apto 45",
		};
			Object.keys(dadosFixos).forEach((id) => {
				const input = document.getElementById(id);
				if (input) {
					input.value = dadosFixos[id];
					input.placeholder = "";
					input.readOnly = true;
				}
			});
	}, []);

	return (
		<div className="dados-cliente-container">
			<CircleBackButton onClick={() => window.history.back()} />
			<h1 className="titulo-dados-cliente">Dados do Cliente</h1>

			<InfoPessoaisCard />
			<EnderecoCard />

			<div className="dados-card">
				<h2 className="dados-card-title">3 - Data Da Conversa</h2>
				<div className="dados-card-grid">
					<div className="dados-card-group">
						<label>Data</label>
						<div className="dados-card-display">12/09/2025</div>
					</div>
					<div className="dados-card-group">
						<label>Hora</label>
						<div className="dados-card-display">14:30</div>
					</div>
				</div>
			</div>

			{/* Card 4 - Relatório Anamnese */}
			<div className="dados-card">
				<h2 className="dados-card-title">4 - Relatório Anamnese (Caso Tenha)</h2>
				<textarea
					className="dados-card-textarea"
					rows="4"
					placeholder=""
				></textarea>
			</div>

			{/* Card 5 - Respostas do Questionário */}
			<div className="dados-card">
				<h2 className="dados-card-title">
					5 - Respostas Do Questionário De Nivelamento
				</h2>
				<textarea
					className="dados-card-textarea"
					rows="4"
					placeholder=""
				></textarea>
			</div>
		</div>
	);
}
