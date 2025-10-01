import "./InscricaoTrilhas.css";
import Header from "../../components/header/header-usuario";
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
		<div className="inscricao-trilha-container">
			<Header />
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

			<div className="inscricao-trilha-dados">
				<span><b>Distância:</b> 15km</span>
				<span><b>Categoria:</b> Escalada</span>
				<span><b>Preço:</b> R$100,00</span>
				<span><b>Hora de Início:</b> 08:00</span>
				<span><b>Hora de Fim:</b> 12:00</span>
				<span><b>Duração Estimada:</b> 4h</span>
				<span><b>Quantidade de Inscritos:</b> 8</span>
				<span><b>Limite de Inscritos:</b> 10</span>
			</div>

					{!nivelSuficiente && (
						<div style={{
							margin: '24px 0 8px 0',
							padding: '16px',
							background: '#fff3cd',
							border: '1px solid #ffeeba',
							borderRadius: '8px',
							color: '#856404',
							fontSize: '18px',
							fontWeight: 500
						}}>
							Você ainda não possui a experiência necessária para realizar esta trilha. Para liberar seu acesso, agende uma conversa com um dos nossos guias.
						</div>
					)}
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

			   <div style={{ margin: '40px 0 8px 0' }}>
				   <b style={{ color: '#2d4636', fontWeight: 500, fontSize: 22 }}>
					   O que esperar da sua próxima trilha:
				   </b>
			   </div>
			   <MapaTrilha 
				   gpxFile="/assets/gpx-files/trilha-cachoeira-dos-grampos-fumaca.gpx"
				   altura="450px"
			   />
		</div>
	);
};

export default InscricaoTrilhasLimitado;