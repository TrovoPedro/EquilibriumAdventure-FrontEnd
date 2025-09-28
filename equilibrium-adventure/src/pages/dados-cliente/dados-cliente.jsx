import React, { useEffect, useState } from "react";
import "./dados-cliente.css";
import CircleBackButton from "../../components/circle-back-button/circle-back-button";
import InfoPessoaisCard from "../../components/info-pessoais-card/info-pessoais-card";
import EnderecoCard from "../../components/endereco-card/endereco-card";
import { buscarPerfilCompleto } from "../../services/apiInformacoesPessoais";
import { obterEstatisticasQuestionario, listarPerguntasComRespostas } from "../../services/apiQuestionarioRespostas";

export default function DadosCliente() {
	const [dadosCliente, setDadosCliente] = useState(null);
	const [agendamentoData, setAgendamentoData] = useState(null);
	const [respostasQuestionario, setRespostasQuestionario] = useState("");
	const [perguntasComRespostas, setPerguntasComRespostas] = useState([]);
	const [loading, setLoading] = useState(true);
	const [erro, setErro] = useState(null);

	// ID fixo = 1
	const usuarioIdFixo = 1;

	useEffect(() => {
		carregarDadosCliente();
		buscarAgendamentoAnamnese();
		carregarRespostasQuestionario();
	}, []);

	const carregarDadosCliente = async () => {
		try {
			setLoading(true);
			console.log("🔍 Carregando dados do cliente ID:", usuarioIdFixo);
			
			// Buscar dados completos do perfil
			const dados = await buscarPerfilCompleto(usuarioIdFixo);
			console.log("✅ Dados recebidos:", dados);
			
			setDadosCliente(dados);
			
		} catch (error) {
			console.error("❌ Erro ao carregar dados:", error);
			setErro("Erro ao carregar dados do cliente");
		} finally {
			setLoading(false);
		}
	};

	const carregarRespostasQuestionario = async () => {
		try {
			console.log("📋 Carregando respostas do questionário para ID:", usuarioIdFixo);
			
			// Buscar dados estruturados das perguntas e respostas
			const dadosEstruturados = await listarPerguntasComRespostas(usuarioIdFixo);
			console.log("✅ Perguntas com respostas:", dadosEstruturados);
			
			setPerguntasComRespostas(dadosEstruturados);
			
			// Também manter o texto formatado para compatibilidade
			const estatisticas = await obterEstatisticasQuestionario(usuarioIdFixo);
			setRespostasQuestionario(estatisticas.respostasFormatadas);
			
		} catch (error) {
			console.error("❌ Erro ao carregar questionário:", error);
			setRespostasQuestionario("Erro ao carregar respostas do questionário");
			setPerguntasComRespostas([]);
		}
	};

	const formatarDataParaInput = (dataIso) => {
		if (!dataIso) return "";
		try {
			const data = new Date(dataIso);
			const year = data.getFullYear();
			const month = String(data.getMonth() + 1).padStart(2, '0');
			const day = String(data.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		} catch (error) {
			return "";
		}
	};

	const formatarDataParaExibicao = (dataIso) => {
		if (!dataIso) return "";
		try {
			const data = new Date(dataIso);
			const day = String(data.getDate()).padStart(2, '0');
			const month = String(data.getMonth() + 1).padStart(2, '0');
			const year = data.getFullYear();
			return `${day}/${month}/${year}`;
		} catch (error) {
			return "";
		}
	};

	const buscarAgendamentoAnamnese = async () => {
		try {
			console.log("📅 Buscando agendamento para ID:", usuarioIdFixo);
			
			const response = await fetch(`http://localhost:8080/agendamentos/por-aventureiro/${usuarioIdFixo}`);
			
			if (response.ok) {
				const agendamentos = await response.json();
				if (agendamentos && agendamentos.length > 0) {
					const agendamento = agendamentos[0];
					setAgendamentoData(agendamento);
					console.log("✅ Agendamento encontrado:", agendamento);
				} else {
					console.log("📭 Nenhum agendamento encontrado - usando data atual");
					setAgendamentoData(null);
				}
			} else if (response.status === 204) {
				console.log("📭 Nenhum agendamento encontrado - usando data atual");
				setAgendamentoData(null);
			}
		} catch (error) {
			console.error("❌ Erro ao buscar agendamento:", error);
			setAgendamentoData(null);
		}
	};

	const formatarData = (dataIso) => {
		if (!dataIso) return "Não informado";
		try {
			const data = new Date(dataIso);
			return data.toLocaleDateString("pt-BR");
		} catch (error) {
			return "Data inválida";
		}
	};

	const formatarHora = (dataIso) => {
		if (!dataIso) return "Não informado";
		try {
			const data = new Date(dataIso);
			return data.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
		} catch (error) {
			return "Hora inválida";
		}
	};

	if (loading) {
		return (
			<div className="dados-cliente-container">
				<div className="carregando">Carregando dados do cliente...</div>
			</div>
		);
	}

	if (erro) {
		return (
			<div className="dados-cliente-container">
				<div className="erro">{erro}</div>
			</div>
		);
	}

	return (
		<div className="dados-cliente-container">
			<CircleBackButton onClick={() => window.history.back()} />
			<h1 className="titulo-dados-cliente">
				Dados do Cliente
				{dadosCliente && (
					<span className="info-aventureiro">
						- {dadosCliente.nome} ({dadosCliente.nivel || 'Nível não informado'})
					</span>
				)}
			</h1>

			<InfoPessoaisCard 
				formData={{
					nome: dadosCliente?.nome || "",
					email: dadosCliente?.email || "",
					telefone: dadosCliente?.telefoneContato || dadosCliente?.telefone || "",
					dataNascimento: formatarDataParaExibicao(dadosCliente?.dataNascimento),
					cpf: dadosCliente?.cpf || "",
					rg: dadosCliente?.rg || "",
					idiomas: dadosCliente?.idioma || "",
					contatoEmergencia: dadosCliente?.contatoEmergencia || ""
				}}
				onInputChange={() => {}} // Função vazia pois é somente leitura
				readOnly={true} // Todos os campos são somente leitura
			/>
			<EnderecoCard 
				formData={{
					cep: dadosCliente?.endereco?.cep || "",
					cidade: dadosCliente?.endereco?.cidade || "",
					estado: dadosCliente?.endereco?.estado || "",
					bairro: dadosCliente?.endereco?.bairro || "",
					numero: dadosCliente?.endereco?.numero || "",
					complemento: dadosCliente?.endereco?.complemento || ""
				}}
				onInputChange={() => {}} // Função vazia pois é somente leitura
				onCepSearch={() => {}} // Função vazia pois é somente leitura
				loading={false}
				readOnly={true} // Todos os campos são somente leitura
			/>

			<div className="dados-card">
				<h2 className="dados-card-title">3 - Data Da Conversa</h2>
				<div className="dados-card-grid">
					<div className="dados-card-group">
						<label>Data</label>
						<div className="dados-card-display">
							{agendamentoData ? formatarData(agendamentoData.dataDisponivel) : formatarData(new Date())}
						</div>
					</div>
					<div className="dados-card-group">
						<label>Hora</label>
						<div className="dados-card-display">
							{agendamentoData ? formatarHora(agendamentoData.dataDisponivel) : new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
						</div>
					</div>
				</div>
			</div>

			{/* Card 4 - Relatório Anamnese */}
			<div className="dados-card">
				<h2 className="dados-card-title">4 - Relatório Anamnese (Caso Tenha)</h2>
				<textarea
					className="dados-card-textarea"
					rows="4"
					value={dadosCliente?.relatorioAnamnese || ""}
					placeholder={dadosCliente?.relatorioAnamnese ? "" : "Nenhum relatório de anamnese disponível"}
					readOnly={true}
				></textarea>
			</div>

			{/* Card 5 - Respostas Questionário Nivelamento */}
			<div className="dados-card">
				<h2 className="dados-card-title">5 - Respostas Questionário Nivelamento</h2>
				{perguntasComRespostas.length > 0 ? (
					<div className="questionario-lista">
						{perguntasComRespostas.map((item, index) => (
							<div key={item.id || index} className="pergunta-item">
								<div className="pergunta-numero">Pergunta {index + 1}</div>
								<div className="pergunta-texto">{item.textoPergunta}</div>
								
								{/* Exibir todas as alternativas */}
								{item.alternativas && item.alternativas.length > 0 && (
									<div className="alternativas-section">
										<div className="alternativas-titulo">Alternativas:</div>
										<ul className="alternativas-lista">
											{item.alternativas.map((alternativa, altIndex) => {
												// Lógica simples: valor escolhido - 1 = índice da alternativa
												// Se escolhido = 1 → alternativa índice 0
												// Se escolhido = 2 → alternativa índice 1  
												// Se escolhido = 3 → alternativa índice 2
												// Se escolhido = 4 → alternativa índice 3
												const isEscolhida = item.alternativaEscolhida === (alternativa.second + 1);
												
												return (
													<li 
														key={altIndex} 
														className={`alternativa-item ${isEscolhida ? 'alternativa-escolhida' : ''}`}
													>
														<span className="alternativa-texto">{alternativa.first}</span>
														<span className="alternativa-valor">(Alternativa: {alternativa.second + 1})</span>
														{isEscolhida && <span className="marcador-escolhida">✓ ESCOLHIDA</span>}
													</li>
												);
											})}
										</ul>
									</div>
								)}
								
								{/* Status da resposta */}
								<div className="status-resposta">
									{(() => {
										if (item.alternativaEscolhida === null || item.alternativaEscolhida === undefined) {
											return <span className="nao-respondida">❌ Não respondida</span>;
										}
										
										// Verificar se existe alternativa para o valor escolhido (valor - 1 = índice)
										const indiceEscolhido = item.alternativaEscolhida - 1;
										const alternativaValida = item.alternativas?.find(alt => alt.second === indiceEscolhido);
										
										if (alternativaValida) {
											return <span className="respondida">✅ Respondida</span>;
										} else {
											return <span className="resposta-invalida">⚠️ Resposta inválida (valor escolhido: {item.alternativaEscolhida})</span>;
										}
									})()}
								</div>
							</div>
						))}
						<div className="questionario-resumo">
							<strong>Total de questões respondidas:</strong> {
								perguntasComRespostas.filter(p => {
									if (p.alternativaEscolhida === null || p.alternativaEscolhida === undefined) return false;
									// Verificar se existe alternativa para valor escolhido - 1
									const indiceEscolhido = p.alternativaEscolhida - 1;
									return p.alternativas?.find(alt => alt.second === indiceEscolhido);
								}).length
							} de {perguntasComRespostas.length}
						</div>
					</div>
				) : (
					<div className="questionario-vazio">
						<p>Nenhuma resposta de questionário disponível</p>
					</div>
				)}
			</div>
		</div>
	);
}