import "./InscricaoTrilhas.css";
import Header from "../../components/header/header-unified";
import CircleBackButton from "../../components/circle-back-button/circle-back-button";
import MapaTrilha from "../../components/mapa-trilha/MapaTrilha";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useScore } from "../../context/ScoreContext";
import { useNavigate, useParams } from "react-router-dom";
import Comentarios from '../../components/comentarios/Comentarios';
import routeUrls from "../../routes/routeUrls";
import { buscarImagemEvento, buscarEventoPorId, buscarGpx } from "../../services/apiEvento";
import trilhaImg from "../../assets/cachoeiralago.jpg";
import { listarComentariosPorEvento, adicionarComentario } from '../../services/apiComentario';
import { verificarInscricao, criarInscricao } from "../../services/apiInscricao";

const InscricaoTrilhasLimitado = () => {
  const { id } = useParams(); // Pega o ID da URL
  const [evento, setEvento] = useState(null);
  const [imagemEvento, setImagemEvento] = useState(null);
  const [gpxData, setGpxData] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [inscrito, setInscrito] = useState(false);
  const { usuario } = useAuth();
  const { nivel } = useScore();
  const navigate = useNavigate();

  const nivelOrdem = {
    'Explorador': 1,
    'Aventureiro': 2,
    'Desbravador': 3
  };


  // Scroll para o topo ao abrir a tela
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Buscar evento e integrar campos do backend
  useEffect(() => {
    const carregarEvento = async () => {
      try {
        const eventoData = await buscarEventoPorId(id);

        if (eventoData.length > 0) {
          const ativacao = eventoData[0]; // pega a primeira ativação
          setEvento({
            idAtivacao: ativacao.idAtivacao,
            nome: ativacao.evento?.nome || "",
            descricao: ativacao.evento?.descricao || "",
            nivel_dificuldade: ativacao.evento?.nivelDificuldade || "",
            distancia_km: ativacao.evento?.distanciaKm || 0,
            responsavel: ativacao.evento?.responsavel || "",
            endereco: ativacao.evento?.endereco || "",
            caminho_arquivo_evento: ativacao.evento?.caminhoArquivoEvento || "",
            preco: ativacao.preco,
            horaInicio: ativacao.horaInicio,
            horaFinal: ativacao.horaFinal,
            tempoEstimado: ativacao.tempoEstimado,
            limiteInscritos: ativacao.limiteInscritos,
            dataAtivacao: ativacao.dataAtivacao,
            tipo: ativacao.tipo,
            estado: ativacao.estado,
          });
        } else {
          console.error("Nenhuma ativação encontrada para este evento");
        }

        const imagemUrl = await buscarImagemEvento(id);
        setImagemEvento(imagemUrl);
      } catch (error) {
        console.error("Erro ao carregar evento:", error);
      }
    };
    carregarEvento();
  }, [id]);

  useEffect(() => {
    const carregarComentarios = async () => {
      try {
        if (id) {
          const comentariosData = await listarComentariosPorEvento(id);
          setComentarios(comentariosData);
        }
      } catch (error) {
        console.error("Erro ao carregar comentários:", error);
      }
    };
    carregarComentarios();
  }, [evento]);

  const handleEnviarComentario = async (comentarioObj) => {
    try {
      const comentarioCriado = await adicionarComentario({
        texto: comentarioObj.texto,
        idUsuario: usuario.id,
        idAtivacaoEvento: id
      });
      setComentarios(prev => [...prev, {
        nome: comentarioCriado.nomeUsuario,
        texto: comentarioCriado.texto
      }]);
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
    }
  };

  useEffect(() => {
    const carregarGpx = async () => {
      try {
        const gpx = await buscarGpx(id); // id do evento
        setGpxData(gpx);
      } catch (error) {
        console.error(error);
      }
    };
    carregarGpx();
  }, [id]);

  useEffect(() => {
    const checarInscricao = async () => {
      try {
        if (usuario?.id_usuario && id) {
          const data = await verificarInscricao(usuario.id_usuario, id);
          setInscrito(data.jaInscrito); // true ou false
        }
      } catch (error) {
        console.error("Erro ao verificar inscrição:", error);
      }
    };
    checarInscricao();
  }, [usuario, id]);

  const podeParticipar = () => {
    const nivelUsuario = nivelOrdem[nivel] || 0;
    const nivelTrilha = nivelOrdem[evento.nivel_dificuldade] || 0;
    return nivelUsuario >= nivelTrilha;
  };

  const handleInscrever = async () => {
    try {
      await criarInscricao(id, usuario.id);
      alert("Inscrição realizada com sucesso!");
      setInscrito(true);
    } catch (error) {
      console.error("Erro ao fazer inscrição:", error);

      // Mostra mensagens vindas do backend
      if (error.response && error.response.data) {
        alert(error.response.data.message || error.response.data);
      } else {
        alert("Erro ao realizar inscrição. Tente novamente mais tarde.");
      }
    }
  };

  // Mostrar loading enquanto não carrega o evento
  if (!evento) return <p>Carregando evento...</p>;

  return (
    <div className="inscricao-trilha-container" style={{ position: 'relative' }}>
      <Header />
      <CircleBackButton onClick={() => navigate(-1)} />

      <div className="inscricao-trilha-header">
        <img src={imagemEvento || trilhaImg} alt={evento.nome} />
        <div className="inscricao-trilha-info">
          <div><b>Título:</b> {evento.nome}</div>
          <div><b>Nível:</b> {evento.nivel_dificuldade}</div>
          <div><b>Data:</b> {evento.dataAtivacao ? new Date(evento.dataAtivacao).toLocaleDateString() : "N/A"}</div>
          <div><b>Descrição:</b> {evento.descricao}</div>

        </div>
      </div>

      <form className="inscricao-trilha-dados">
        <div className="inscricao-trilha-form-row">
          <div className="inscricao-trilha-form-group">
            <label>Distância:</label>
            <input type="text" value={`${evento.distancia_km} km`} disabled />
          </div>
          <div className="inscricao-trilha-form-group">
            <label>Categoria:</label>
            <input type="text" value={evento.tipo || "N/A"} disabled />
          </div>
          <div className="inscricao-trilha-form-group">
            <label>Preço:</label>
            <input type="text" value={`R$ ${evento.preco?.toFixed(2) || "0,00"}`} disabled />
          </div>
        </div>

        <div className="inscricao-trilha-form-row">
          <div className="inscricao-trilha-form-group">
            <label>Hora de Início:</label>
            <input type="text" value={evento.horaInicio || "N/A"} disabled />
          </div>
          <div className="inscricao-trilha-form-group">
            <label>Hora de Término:</label>
            <input type="text" value={evento.horaFinal || "N/A"} disabled />
          </div>
          <div className="inscricao-trilha-form-group">
            <label>Data:</label>
            <input type="text" value={evento.dataAtivacao ? new Date(evento.dataAtivacao).toLocaleDateString() : "N/A"} disabled />
          </div>
        </div>

        <div className="inscricao-trilha-form-row endereco-row">
          <div className="inscricao-trilha-form-group full-width">
            <label>Endereço:</label>
            <input
              type="text"
              disabled
              className="endereco-input"
              value={
                evento.endereco
                  ? `${evento.endereco.rua || ""}, ${evento.endereco.numero || ""} - ${evento.endereco.bairro || ""}, ${evento.endereco.cidade || ""} - ${evento.endereco.estado || ""}, CEP: ${evento.endereco.cep || ""}`
                  : "Endereço não disponível"
              }
            />
          </div>
        </div>
      </form >

      <button
        className={`inscricao-trilha-btn ${inscrito ? 'disabled' : ''}`}
        onClick={() => {
          if (inscrito) return;

          if (!podeParticipar()) {
            alert("Seu nível atual não permite participar dessa trilha!");
            return;
          }

          handleInscrever();
        }}
        disabled={inscrito}
      >
        {inscrito ? 'Já Inscrito' : 'Se Inscrever'}
      </button>



      <Comentarios comentariosIniciais={comentarios} onEnviarComentario={handleEnviarComentario} />

      <div className="card inscricao-trilha-mapa">
        <h3>Mapa da Trilha</h3>
        <MapaTrilha
          gpxFile={
            gpxData
              ? URL.createObjectURL(new Blob([gpxData], { type: "application/gpx+xml" }))
              : "/assets/gpx-files/trilha-cachoeira-dos-grampos-fumaca.gpx"
          }
          altura="450px"
        />
      </div>
    </div >
  );
};

export default InscricaoTrilhasLimitado;
