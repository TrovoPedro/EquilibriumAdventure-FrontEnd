import "./InscricaoTrilhas.css";
import Header from "../../components/header/header-usuario";
import trilhaImg from "../../assets/img10-catalogo.jpg";
import imagemTeste from "../../assets/img10-catalogo.jpg"
import React, { useState } from "react";

const comentariosIniciais = [
	{ nome: "Guilherme", texto: "Gostei muito dessa trilha me ajudou bastante a superar meu medo de altura" },
	{ nome: "Rebeca", texto: "Fiquei com bastante medo no início mas no final deu para aproveitar muito" },
];

const InscricaoTrilhasLimitado = () => {
	const [comentarios, setComentarios] = useState(comentariosIniciais);
	const [novoComentario, setNovoComentario] = useState("");

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
					<button className="inscricao-trilha-btn">Agendar Conversa</button>

			<div className="inscricao-trilha-comentarios">
				{comentarios.map((c, i) => (
					<div className="inscricao-trilha-comentario" key={i}>
						<b>{c.nome}</b><br />
						{c.texto}
					</div>
				))}
				<form className="inscricao-trilha-form" onSubmit={handleComentario}>
					<input
						type="text"
						placeholder="Escreva aqui um comentário"
						value={novoComentario}
						onChange={e => setNovoComentario(e.target.value)}
						maxLength={120}
					/>
					<button type="submit">Enviar</button>
				</form>
			</div>

			   <div style={{ margin: '0 0 8px 0' }}>
				   <b style={{ color: '#2d4636', fontWeight: 500, fontSize: 22 }}>
					   O que esperar da sua próxima trilha:
				   </b>
			   </div>
			   <div className="inscricao-trilha-mapa">
				   <img
					   src={imagemTeste}
					   alt="Mapa da trilha"
					   style={{ width: "100%", borderRadius: 8, border: '1px solid #bdbdbd' }}
				   />
			   </div>
		</div>
	);
};

export default InscricaoTrilhasLimitado;