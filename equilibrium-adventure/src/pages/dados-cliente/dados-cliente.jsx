import React, { useEffect, useRef, useState } from "react";
import "./dados-cliente.css";
import CircleBackButton from "../../components/circle-back-button/circle-back-button";
import InfoPessoaisCard from "../../components/info-pessoais-card/info-pessoais-card";
import EnderecoCard from "../../components/endereco-card/endereco-card";
import { buscarPerfilCompleto } from "../../services/apiInformacoesPessoais";
import { obterEstatisticasQuestionario, listarPerguntasComRespostas } from "../../services/apiQuestionarioRespostas";
import { 
	formatarDataParaInput, 
	formatarDataParaExibicao, 
	formatarData, 
	formatarHora
} from "../../utils/dateValidations";

import { useParams } from "react-router-dom";

export default function DadosCliente() {
	const { id: idUsuarioParam } = useParams();
	const [dadosCliente, setDadosCliente] = useState(null);
	const [agendamentoData, setAgendamentoData] = useState(null);
	const [respostasQuestionario, setRespostasQuestionario] = useState("");
	const [perguntasComRespostas, setPerguntasComRespostas] = useState([]);
	const [loading, setLoading] = useState(true);
	const [erro, setErro] = useState(null);
	const [currentSlide, setCurrentSlide] = useState(0);
	const carrosselRef = useRef(null);

	const usuarioIdFixo = idUsuarioParam || 1;

	useEffect(() => {
		carregarDadosCliente();
		buscarAgendamentoAnamnese();
		carregarRespostasQuestionario();
	}, [usuarioIdFixo]);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (perguntasComRespostas.length === 0) return;
			const container = carrosselRef.current;
			if (!container) return;
			
			switch (event.key) {
				case 'ArrowLeft':
					event.preventDefault();
					container.scrollBy({ left: -container.clientWidth, behavior: 'smooth' });
					break;
				case 'ArrowRight':
					event.preventDefault();
					container.scrollBy({ left: container.clientWidth, behavior: 'smooth' });
					break;
				case 'Home':
					event.preventDefault();
					container.scrollTo({ left: 0, behavior: 'smooth' });
					break;
				case 'End':
					event.preventDefault();
					container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
					break;
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [perguntasComRespostas.length]);

	useEffect(() => {
		const container = carrosselRef.current;
		if (!container) return;

		const onScroll = () => {
			const width = container.clientWidth || 1;
			const idx = Math.round(container.scrollLeft / width);
			const clamped = Math.min(perguntasComRespostas.length - 1, Math.max(0, idx));
			setCurrentSlide(clamped);
		};

		container.addEventListener('scroll', onScroll, { passive: true });
		onScroll();

		return () => {
			container.removeEventListener('scroll', onScroll);
		};
	}, [perguntasComRespostas.length]);

	useEffect(() => {
		const container = carrosselRef.current;
		if (container) {
			container.scrollTo({ left: 0, behavior: 'auto' });
		}
	}, [perguntasComRespostas.length]);

	const scrollToSlide = (index) => {
		const container = carrosselRef.current;
		if (!container) return;
		const width = container.clientWidth;
		container.scrollTo({ left: index * width, behavior: 'smooth' });
	};

	const carregarDadosCliente = async () => {
		try {
			setLoading(true);
			console.log("Carregando dados do cliente ID:", usuarioIdFixo);
			
			let dadosCliente = null;
			
			try {
				const dados = await buscarPerfilCompleto(usuarioIdFixo);
				console.log("Dados completos recebidos:", dados);
				dadosCliente = dados;
			} catch (error) {
				console.log("Perfil completo não encontrado, buscando dados básicos");
				
				try {
					const { buscarDadosUsuario } = await import("../../services/apiUsuario");
					const dadosBasicos = await buscarDadosUsuario(usuarioIdFixo);
					console.log("Dados básicos recebidos:", dadosBasicos);
					dadosCliente = dadosBasicos;
				} catch (userError) {
					console.error("Erro ao buscar dados básicos:", userError);
					setErro("Nenhum dado do cliente encontrado");
					return;
				}
			}
			
			setDadosCliente(dadosCliente);
			
		} catch (error) {
			console.error("Erro geral ao carregar dados:", error);
			setErro("Erro ao carregar dados do cliente");
		} finally {
			setLoading(false);
		}
	};

	const carregarRespostasQuestionario = async () => {
		try {
			console.log("Carregando respostas do questionario para ID:", usuarioIdFixo);
			
			const dadosEstruturados = await listarPerguntasComRespostas(usuarioIdFixo);
			console.log("Perguntas com respostas carregadas");
			
			setPerguntasComRespostas(dadosEstruturados);
			setCurrentSlide(0); 
			
			const estatisticas = await obterEstatisticasQuestionario(usuarioIdFixo);
			setRespostasQuestionario(estatisticas.respostasFormatadas);
			
		} catch (error) {
			console.error("Erro ao carregar questionario:", error.message);
			setRespostasQuestionario("Erro ao carregar respostas do questionário");
			setPerguntasComRespostas([]);
			setCurrentSlide(0);
		}
	};



	const buscarAgendamentoAnamnese = async () => {
		try {
			console.log("Buscando agendamento para ID:", usuarioIdFixo);
			
			const response = await fetch(`http://localhost:8080/agendamentos/por-aventureiro/${usuarioIdFixo}`);
			
			if (response.ok) {
				const agendamentos = await response.json();
				if (agendamentos && agendamentos.length > 0) {
					const agendamento = agendamentos[0];
					setAgendamentoData(agendamento);
					console.log("Agendamento encontrado");
				} else {
					console.log("Nenhum agendamento encontrado - usando data atual");
					setAgendamentoData(null);
				}
			} else if (response.status === 204) {
				console.log("Nenhum agendamento encontrado - usando data atual");
				setAgendamentoData(null);
			}
		} catch (error) {
			console.error("Erro ao buscar agendamento:", error.message);
			setAgendamentoData(null);
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
					telefone: dadosCliente?.telefoneContato || dadosCliente?.telefone_contato || dadosCliente?.telefone || "",
					dataNascimento: formatarDataParaExibicao(dadosCliente?.dataNascimento),
					cpf: dadosCliente?.cpf || "",
					rg: dadosCliente?.rg || "",
					idiomas: dadosCliente?.idioma || "",
					contatoEmergencia: dadosCliente?.contatoEmergencia || ""
				}}
				onInputChange={() => {}} 
				readOnly={true} 
			/>
			<EnderecoCard 
				formData={{
					cep: dadosCliente?.endereco?.cep || "",
					rua: dadosCliente?.endereco?.rua || "",
					cidade: dadosCliente?.endereco?.cidade || "",
					estado: dadosCliente?.endereco?.estado || "",
					bairro: dadosCliente?.endereco?.bairro || "",
					numero: dadosCliente?.endereco?.numero || "",
					complemento: dadosCliente?.endereco?.complemento || ""
				}}
				onInputChange={() => {}}
				onCepSearch={() => {}} 
				loading={false}
				readOnly={true} 
			/>

			<div className="dados-card">
				<h2 className="dados-card-title">3 - Data Da Conversa</h2>
				<div className="dados-card-grid">
					<div className="dados-card-group">
						<label>Data</label>
						<div className="dados-card-display">
							{agendamentoData ? formatarData(agendamentoData.dataDisponivel) : "Não agendado"}
						</div>
					</div>
					<div className="dados-card-group">
						<label>Hora</label>
						<div className="dados-card-display">
							{agendamentoData ? formatarHora(agendamentoData.dataDisponivel) : "Não agendado"}
						</div>
					</div>
				</div>
			</div>

			<div className="dados-card">
				<h2 className="dados-card-title">4 - Relatório Anamnese</h2>
				<textarea
					className="dados-card-textarea"
					rows="4"
					value={dadosCliente?.relatorioAnamnese || ""}
					placeholder={dadosCliente?.relatorioAnamnese ? "" : "Nenhum relatório de anamnese disponível"}
					readOnly={true}
				></textarea>
			</div>

			<div className="dados-card">
				<h2 className="dados-card-title">5 - Respostas Questionário Nivelamento</h2>
				{perguntasComRespostas.length > 0 ? (
					<div className="questionario-carrossel">
						<div className="carrossel-navigation carrossel-navigation--info-only">
							<div className="carrossel-info">
								<span className="pergunta-atual">{currentSlide + 1}</span>
								<span className="separador">de</span>
								<span className="total-perguntas">{perguntasComRespostas.length}</span>
							</div>
						</div>
						<div className="carrossel-container" ref={carrosselRef}>
							<div className="carrossel-track">
								{perguntasComRespostas.map((item, index) => (
									<div key={item.id || index} className="carrossel-slide">
										<div className="pergunta-item">
											<div className="pergunta-numero">Pergunta {index + 1}</div>
											<div className="pergunta-texto">{item.textoPergunta}</div>
											
											{item.alternativas && item.alternativas.length > 0 && (
												<div className="alternativas-section">
													<div className="alternativas-titulo">Alternativas:</div>
													<ul className="alternativas-lista">
														{item.alternativas.map((alternativa, altIndex) => {
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
											
											<div className="status-resposta">
												{(() => {
													if (item.alternativaEscolhida === null || item.alternativaEscolhida === undefined) {
														return <span className="nao-respondida">Nao respondida</span>;
													}
													
													const indiceEscolhido = item.alternativaEscolhida - 1;
													const alternativaValida = item.alternativas?.find(alt => alt.second === indiceEscolhido);
													
													if (alternativaValida) {
														return <span className="respondida">Respondida</span>;
													} else {
														return <span className="resposta-invalida">Resposta invalida (valor escolhido: {item.alternativaEscolhida})</span>;
													}
												})()}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="carrossel-indicators">
							{perguntasComRespostas.map((_, index) => (
								<button
									key={index}
									className={`indicator ${index === currentSlide ? 'active' : ''}`}
									onClick={() => scrollToSlide(index)}
								/>
							))}
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