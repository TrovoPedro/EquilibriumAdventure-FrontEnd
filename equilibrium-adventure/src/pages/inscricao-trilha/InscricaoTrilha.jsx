import "./InscricaoTrilhas.css";
import Header from "../../components/header/header-unified";
import CircleBackButton from "../../components/circle-back-button/circle-back-button";
import trilhaImg from "../../assets/cachoeiralago.jpg";
import MapaTrilha from "../../components/mapa-trilha/MapaTrilha";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useScore } from "../../context/ScoreContext";
import { useNavigate } from "react-router-dom";
import Comentarios from '../../components/comentarios/Comentarios';
import routeUrls from "../../routes/routeUrls";

const comentariosIniciais = [
	{ nome: "Guilherme", texto: "Gostei muito dessa trilha me ajudou bastante a superar meu medo de altura" },
	{ nome: "Rebeca", texto: "Fiquei com bastante medo no início mas no final deu para aproveitar muito" },
];

const InscricaoTrilhasLimitado = ({ idEvento, nivelNecessario }) => {
	// Rolar para o topo ao entrar na tela
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, []);
	const [comentarios, setComentarios] = useState(comentariosIniciais);
	const [novoComentario, setNovoComentario] = useState("");
	const [inscrito, setInscrito] = useState(false);
	const { usuario } = useAuth();
	const { nivel } = useScore();
	const navigate = useNavigate();

	// Verificar se o usuário está inscrito
	useEffect(() => {
		const verificarInscricao = async () => {
			try {
				if (usuario?.id_usuario && idEvento) {
					const response = await api.get(`/inscricoes/${idEvento}/${usuario.id_usuario}`);
					setInscrito(!!response.data); // Se encontrou inscrição, está inscrito
				}
			} catch (error) {
				console.error("Erro ao verificar inscrição:", error);
			}
		};

		verificarInscricao();
	}, [usuario, idEvento]);

	// Verifica se o nível do usuário é suficiente
	const nivelSuficiente = nivel >= nivelNecessario;

	const handleInscrever = async () => {
		try {
			if (!usuario?.id_usuario || !idEvento) return;

			await api.post('/inscricoes', {
				fk_aventureiro: usuario.id_usuario,
				fk_ativacao_evento: idEvento,
				data_inscricao: new Date()
			});

			setInscrito(true);
		} catch (error) {
			console.error("Erro ao fazer inscrição:", error);
			// Aqui você pode adicionar uma notificação de erro
		}
	};

	const handleComentario = (e) => {
		e.preventDefault();
		if (novoComentario.trim() === "") return;
		setComentarios([...comentarios, { nome: "Você", texto: novoComentario }]);
		setNovoComentario("");
	};

	return (
		<div className="inscricao-trilha-container" style={{position: 'relative'}}>
			<Header />
			<CircleBackButton onClick={() => navigate(-1)} />
			<span className="inscricao-trilha-header-separator"></span>
			<div className="inscricao-trilha-header">
				<img src={trilhaImg} alt="Trilha Pedra do Baú" />
				<div className="inscricao-trilha-info">
					<div><b>Título:</b> Pedra do Baú</div>
					<div><b>Data:</b> 12/05/2025</div>
					<div><b>Nível:</b> Aventureiro</div>
					<div><b>Descrição:</b> Uma trilha desbravadora desafia seus limites e revela paisagens incríveis. É esforço e descoberta em perfeita harmonia.</div>
				</div>
			</div>

			<form className="inscricao-trilha-dados" autoComplete="off">
				<div className="inscricao-trilha-form-row">
					<div className="inscricao-trilha-form-group">
						<label>Distância:</label>
						<input type="text" value="15km" disabled />
					</div>
					<div className="inscricao-trilha-form-group">
						<label>Categoria:</label>
						<input type="text" value="Escalada" disabled />
					</div>
					<div className="inscricao-trilha-form-group">
						<label>Preço:</label>
						<input type="text" value="R$100,00" disabled />
					</div>
					<div className="inscricao-trilha-form-group">
						<label>Hora de Início:</label>
						<input type="text" value="08:00" disabled />
					</div>
				</div>
				<div className="inscricao-trilha-form-row">
					<div className="inscricao-trilha-form-group">
						<label>Hora de Fim:</label>
						<input type="text" value="12:00" disabled />
					</div>
					<div className="inscricao-trilha-form-group">
						<label>Duração Estimada:</label>
						<input type="text" value="4h" disabled />
					</div>
					<div className="inscricao-trilha-form-group">
						<label>Quantidade de Inscritos:</label>
						<input type="text" value="8" disabled />
					</div>
					<div className="inscricao-trilha-form-group">
						<label>Limite de Inscritos:</label>
						<input type="text" value="10" disabled />
					</div>
				</div>
			</form>

					{/* Mensagem de alerta removida conforme solicitado */}
					<button 
						className={`inscricao-trilha-btn ${inscrito ? 'disabled' : ''}`}
						onClick={() => {
							if (inscrito) return;
							if (nivelSuficiente) {
								handleInscrever();
							} else {
								navigate(routeUrls.AGENDAR_ANAMNESE);
							}
						}}
						disabled={inscrito}
					>
						{inscrito ? 'Já Inscrito' : nivelSuficiente ? 'Se Inscrever' : 'Agendar Anamnese'}
					</button>

			<Comentarios 
				comentariosIniciais={comentariosIniciais}
				onEnviarComentario={async (comentario) => {
					// Aqui você pode implementar a lógica de salvamento do comentário
					console.log('Enviando comentário:', comentario);
				}}
			/>

			   <div className="card inscricao-trilha-mapa">
				   <h3>Mapa da Trilha</h3>
				   <MapaTrilha 
					   gpxFile="/assets/gpx-files/trilha-cachoeira-dos-grampos-fumaca.gpx"
					   altura="450px"
				   />
			   </div>
		</div>
	);
};

export default InscricaoTrilhasLimitado;