import "./InscricaoTrilhas.css";
import Header from "../../components/header/header-unified";
import CircleBackButton from "../../components/circle-back-button/circle-back-button";
import MapaTrilha from "../../components/mapa-trilha/MapaTrilha";
import React, { useState, useEffect } from "react";
import { showSuccess, showError, showWarning } from "../../utils/swalHelper";
import { convertDateToBrazilian } from "../../utils/dateConversions";
import { useAuth } from "../../context/AuthContext";
import { useScore } from "../../context/ScoreContext";
import { useNavigate, useParams } from "react-router-dom";
import Comentarios from '../../components/comentarios/Comentarios';
import { buscarImagemEvento, buscarEventoAtivoPorId, buscarGpx } from "../../services/apiEvento";
import trilhaImg from "../../assets/cachoeiralago.jpg";
import { listarComentariosPorAtivacao, adicionarComentario } from '../../services/apiComentario';
import { verificarInscricao, criarInscricao, cancelarInscricao, listarInscritos } from "../../services/apiInscricao";
import Swal from 'sweetalert2';

const InscricaoTrilhasLimitado = () => {
  // Compartilhar trilha
  const handleCompartilhar = () => {
    const url = window.location.href;
    const titulo = evento?.nome || "Trilha";
    const texto = `Confira a trilha: ${titulo}`;
    if (navigator.share) {
      navigator.share({
        title: titulo,
        text: texto,
        url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      showSuccess("Link da trilha copiado para área de transferência!");
    }
  };
  const { id } = useParams(); // ID do evento
  const [evento, setEvento] = useState(null);
  const [imagemEvento, setImagemEvento] = useState(null);
  const [gpxData, setGpxData] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [inscrito, setInscrito] = useState(false);
  const [inscritosCount, setInscritosCount] = useState(0);
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

        if (ativacao.idAtivacao) {
          console.log("Buscando GPX:", ativacao.evento.idEvento);
          const gpx = await buscarGpx(ativacao.evento.idEvento);
          setGpxData(gpx);
        }

        console.log("Evento carregado:", ativacao);
      } else {
        console.error("Nenhuma ativação encontrada para este evento");
      }
    } catch (error) {
      console.error("Erro ao carregar evento e GPX:", error);
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

  // Carregar contagem de inscritos
  useEffect(() => {
    const carregarInscritos = async () => {
      try {
        if (id) {
          const inscritos = await listarInscritos(id);
          setInscritosCount(Array.isArray(inscritos) ? inscritos.length : 0);
        }
      } catch (error) {
        console.error('Erro ao carregar inscritos:', error);
      }
    };

    carregarInscritos();
  }, [id]);

          {inscrito ? 'Cancelar inscrição' : 'Realizar inscrição'}
  const handleEnviarComentario = async (comentarioObj) => {

        <button
          className="inscricao-trilha-btn btn-compartilhar"
          style={{ marginTop: '10px', background: '#4caf50', color: '#fff' }}
          onClick={handleCompartilhar}
        >
          Compartilhar trilha
        </button>
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
    const confirmResult = await showWarning(
      "Tem certeza que deseja cancelar sua inscrição?",
      "Atenção",
      "Sim, cancelar",
      "Não",
      true
    );

    if (!confirmResult.isConfirmed) return;

    try {
  await cancelarInscricao(usuario.id, evento.idAtivacao);
  showSuccess("Inscrição cancelada com sucesso!");
      setInscrito(false);
      setInscritosCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Erro ao cancelar inscrição:", error);
      showError(error.message || "Erro ao cancelar inscrição. Tente novamente.");
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
  showSuccess("Inscrição realizada com sucesso!");
      setInscrito(true);
      setInscritosCount(prev => prev + 1);

      await checarInscricao();
    } catch (error) {
      console.error("Erro ao fazer inscrição:", error);
      
      // Verifica se é erro de informações pessoais
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || "";
      
      if (errorMessage.toLowerCase().includes("informações pessoais") || 
          errorMessage.toLowerCase().includes("informacoes pessoais")) {
        const result = await Swal.fire({
          title: 'Informações Pessoais Necessárias',
          text: 'É necessário preencher suas informações pessoais antes de realizar a inscrição.',
          icon: 'warning',
          showCancelButton: true,
          showCloseButton: true,
          confirmButtonText: 'Ir para Informações Pessoais',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#295c44',
          cancelButtonColor: '#d33'
        });
        
        if (result.isConfirmed) {
          navigate('/informacoes-pessoais');
        }
      } else {
        showError(errorMessage || "Erro ao realizar inscrição. Tente novamente mais tarde.");
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
              <div><b>Data:</b> {evento.dataAtivacao ? convertDateToBrazilian(evento.dataAtivacao) : "N/A"}</div>
              <div><b>Limite de Inscritos:</b> {evento.limiteInscritos || 'N/A'} <span style={{color:'#226144'}}>({inscritosCount} inscritos)</span></div>
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
            <input type="text" value={evento.dataAtivacao ? convertDateToBrazilian(evento.dataAtivacao) : "N/A"} disabled />
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
        style={{
          background: inscrito ? '#a93226' : '#226144',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          padding: '18px 0',
          fontSize: '1.35rem',
          fontWeight: 700,
          cursor: 'pointer',
          margin: '32px 0 0 0',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          textAlign: 'center',
          letterSpacing: '0.5px',
          transition: 'background 0.2s'
        }}
        onClick={() => {
            if (inscrito) {
              handleCancelarInscricao();
              return;
            }

            if (!podeParticipar()) {
              showWarning("Seu nível atual não permite participar dessa trilha!");
              return;
            }

            handleInscrever();
        }}
      >
        {inscrito ? 'Cancelar inscrição' : 'Realizar inscrição'}
      </button>

      <button
        className="inscricao-trilha-btn btn-compartilhar"
        style={{
          marginTop: '10px',
          background: '#fff',
          color: '#226144',
          border: '2px solid #226144',
          borderRadius: '12px',
          fontWeight: 'bold',
          fontSize: '1.15rem',
          padding: '16px 0',
          cursor: 'pointer',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          transition: 'background 0.2s'
        }}
        onClick={handleCompartilhar}
      >
        Compartilhar trilha
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