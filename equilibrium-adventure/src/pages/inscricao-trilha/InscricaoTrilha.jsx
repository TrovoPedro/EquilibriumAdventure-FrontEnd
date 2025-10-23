import "./InscricaoTrilhas.css";
import Header from "../../components/header/header-unified";
import CircleBackButton from "../../components/circle-back-button/circle-back-button";
import MapaTrilha from "../../components/mapa-trilha/MapaTrilha";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useScore } from "../../context/ScoreContext";
import { useNavigate, useParams } from "react-router-dom";
import Comentarios from '../../components/comentarios/Comentarios';
import { buscarImagemEvento, buscarEventoAtivoPorId, buscarGpx } from "../../services/apiEvento";
import trilhaImg from "../../assets/cachoeiralago.jpg";
import { listarComentariosPorAtivacao, adicionarComentario } from '../../services/apiComentario';
import { verificarInscricao, criarInscricao, cancelarInscricao } from "../../services/apiInscricao";

const InscricaoTrilhasLimitado = () => {
  const { id } = useParams(); // ID do evento
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Buscar evento e ativação
  useEffect(() => {
    const carregarEvento = async () => {
      try {
        const eventoData = await buscarEventoAtivoPorId(id);

        if (eventoData.length > 0) {
          const ativacao = eventoData[0];
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

          const imagemUrl = await buscarImagemEvento(ativacao.evento.idEvento);
          setImagemEvento(imagemUrl || null);
          console.log("Evento carregado:", ativacao);
        } else {
          console.error("Nenhuma ativação encontrada para este evento");
        }
      } catch (error) {
        console.error("Erro ao carregar evento:", error);
      }
    };
    carregarEvento();
  }, [id]);

  // Carregar comentários
  const carregarComentarios = async () => {
    if (id) {
      const comentariosData = await listarComentariosPorAtivacao(id);
      setComentarios(comentariosData);
    }
  };

  useEffect(() => {
    if (id) {
      carregarComentarios();
    }
  }, [id]);


  const handleEnviarComentario = async (comentarioObj) => {
    const comentarioCriado = await adicionarComentario({
      texto: comentarioObj.texto,
      idUsuario: usuario.id,
      idAtivacaoEvento: id // ⚠ aqui mudou
    });

    setComentarios(prev => [...prev, {
      nome: comentarioCriado.nomeUsuario,
      texto: comentarioCriado.texto
    }]);
  };


  useEffect(() => {
    const carregarGpx = async () => {
      if (!evento?.idAtivacao) return;

      try {
        const gpx = await buscarGpx(evento.idAtivacao); // ✅ usa idAtivacao
        setGpxData(gpx);
      } catch (error) {
        console.error("Erro ao carregar GPX:", error);
      }

    };

    carregarGpx();
  }, [evento]);
  // Checar inscrição
  const checarInscricao = async () => {
    try {
      if (usuario?.id && evento?.idAtivacao) {
        const data = await verificarInscricao(usuario.id, evento.idAtivacao);
        setInscrito(data.jaInscrito);
      }
    } catch (error) {
      console.error("Erro ao verificar inscrição:", error);
    }
  };

  useEffect(() => {
    checarInscricao();
    return () => setInscrito(false);
  }, [usuario?.id, evento?.idAtivacao]);

  // Cancelar inscrição
  const handleCancelarInscricao = async () => {
    if (!window.confirm("Tem certeza que deseja cancelar sua inscrição?")) return;

    try {
      await cancelarInscricao(usuario.id, evento.idAtivacao);
      alert("Inscrição cancelada com sucesso!");
      setInscrito(false);
    } catch (error) {
      console.error("Erro ao cancelar inscrição:", error);
      alert(error.message || "Erro ao cancelar inscrição. Tente novamente.");
    }
  };

  // Verifica se usuário pode participar
  const podeParticipar = () => {
    const nivelUsuario = nivelOrdem[nivel] || 0;
    const nivelTrilha = nivelOrdem[evento.nivel_dificuldade] || 0;
    return nivelUsuario >= nivelTrilha;
  };

  // Inscrever usuário
  const handleInscrever = async () => {
    try {
      await criarInscricao(evento.idAtivacao, usuario.id);
      alert("Inscrição realizada com sucesso!");
      setInscrito(true);

      await checarInscricao();
    } catch (error) {
      console.error("Erro ao fazer inscrição:", error);
      if (error.response && error.response.data) {
        alert(error.response.data.message || error.response.data);
      } else {
        alert("Erro ao realizar inscrição. Tente novamente mais tarde.");
      }
    }
  };

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
        className={`inscricao-trilha-btn ${inscrito ? 'btn-cancelar' : 'btn-inscrever'}`}
        onClick={() => {
          if (inscrito) {
            handleCancelarInscricao();
            return;
          }

          if (!podeParticipar()) {
            alert("Seu nível atual não permite participar dessa trilha!");
            return;
          }

          handleInscrever();
        }}
      >
        {inscrito ? 'Cancelar inscrição' : 'Se Inscrever'}
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