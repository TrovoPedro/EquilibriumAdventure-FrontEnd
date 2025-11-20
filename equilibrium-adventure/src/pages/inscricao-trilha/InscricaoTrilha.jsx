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
import EventoInfo from '../../components/evento-info/EventoInfo';
import { buscarImagemEvento, buscarEventoAtivoPorId, buscarGpx, buscarMediaAvaliacoes } from "../../services/apiEvento";
import catalogoFallback from "../../assets/img12-catalogo.jpg";
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
      }).catch(() => { });
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
  const [mediaAvaliacoes, setMediaAvaliacoes] = useState(0);
  const [mensagemAvaliacao, setMensagemAvaliacao] = useState('');
  const { usuario, anamnese } = useAuth()
  const { nivel, pontuacaoTotal } = useScore();
  const [nivelInsuficiente, setNivelInsuficiente] = useState(false);
  const navigate = useNavigate();
  const nivelOrdem = {
    'EXPLORADOR': 1,
    'AVENTUREIRO': 2,
    'DESBRAVADOR': 3
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

  // Carregar média de avaliações
  useEffect(() => {
    const carregarMediaAvaliacoes = async () => {
      try {
        if (id) {
          console.log('Buscando média de avaliações para ID:', id);
          const resultado = await buscarMediaAvaliacoes(id);
          console.log('Resultado da média:', resultado);
          
          if (resultado.mediaAvaliacoes !== undefined) {
            setMediaAvaliacoes(resultado.mediaAvaliacoes);
            console.log('Média de avaliações definida:', resultado.mediaAvaliacoes);
          } else if (resultado.mensagem) {
            setMensagemAvaliacao(resultado.mensagem);
            console.log('Mensagem:', resultado.mensagem);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar média de avaliações:', error);
      }
    };

    carregarMediaAvaliacoes();
  }, [id]);

  // Carregar média de avaliações
  useEffect(() => {
    const carregarMediaAvaliacoes = async () => {
      try {
        if (id) {
          console.log('Buscando média de avaliações para ID:', id);
          const resultado = await buscarMediaAvaliacoes(id);
          console.log('Resultado da média:', resultado);
          
          if (resultado.mediaAvaliacoes !== undefined) {
            setMediaAvaliacoes(resultado.mediaAvaliacoes);
            console.log('Média de avaliações definida:', resultado.mediaAvaliacoes);
          } else if (resultado.mensagem) {
            setMensagemAvaliacao(resultado.mensagem);
            console.log('Mensagem:', resultado.mensagem);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar média de avaliações:', error);
      }
    };

    carregarMediaAvaliacoes();
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

  // mostra alerta e esconde botões se o usuário não tiver nível suficiente
  useEffect(() => {
    if (!evento) return;
    
    console.log('🔍 DEBUG NIVEL:');
    console.log('  nivel recebido do context:', nivel);
    console.log('  pontuacaoTotal:', pontuacaoTotal);
    console.log('  tipo do nivel:', typeof nivel);
    console.log('  evento.nivel_dificuldade:', evento.nivel_dificuldade);
    console.log('  nivelOrdem:', nivelOrdem);
    
    const nivelUsuario = nivelOrdem[nivel] || 0;
    const nivelTrilha = nivelOrdem[evento.nivel_dificuldade] || 0;
    
    console.log('  nivelUsuario calculado:', nivelUsuario);
    console.log('  nivelTrilha calculado:', nivelTrilha);
    
    // Verificação especial para EXPLORADOR com pontuação baixa
    if (nivel === 'EXPLORADOR' && pontuacaoTotal != null && pontuacaoTotal <= 7) {
      console.log('  ⚠️ EXPLORADOR com pontuação <= 7, precisa de anamnese');
      
      // Verifica se já tem anamnese agendada
      if (anamnese && anamnese.length > 0) {
        console.log('Já possui anamnese agendada');
        setNivelInsuficiente(true);
        showWarning(
          'Você já possui uma anamnese agendada. Aguarde a conversa com o guia antes de se inscrever nesta trilha.',
          'Atenção',
          'OK'
        );
      } else {
        console.log('Não possui anamnese agendada, mostrando alerta');
        setNivelInsuficiente(true);
        
        // Mostra alerta com opção de agendar anamnese
        Swal.fire({
          title: 'Anamnese Necessária',
          text: 'Para participar desta trilha, é necessário agendar uma conversa com um guia para avaliação do seu perfil e orientações personalizadas.',
          icon: 'info',
          showCancelButton: true,
          showCloseButton: true,
          confirmButtonText: 'Agendar Anamnese',
          cancelButtonText: 'Voltar',
          confirmButtonColor: '#295c44',
          cancelButtonColor: '#6c757d'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/agendamento-anamnese');
          }
        });
      }
      return;
    }
    
    const insuf = nivelUsuario < nivelTrilha;
    console.log('  insuficiente?', insuf);
    
    setNivelInsuficiente(insuf);
    if (insuf) {
      // mostra alerta apenas uma vez ao abrir a tela
      showWarning(
        'Seu nível atual não permite participar dessa trilha. Entre em contato com um guia para orientação ou realize o treinamento necessário.',
        'Atenção',
        'OK'
      );
    }
  }, [evento, nivel, pontuacaoTotal, anamnese]);

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

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="stars-rating">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < fullStars ? 'star-full' : (i === fullStars && hasHalfStar ? 'star-half' : 'star-empty')}>
            ★
          </span>
        ))}
      </div>
    );
  };

  if (!evento) return <p>Carregando evento...</p>;

  return (
    <div className="inscricao-trilha-container" style={{ position: 'relative' }}>
      <Header />
      <CircleBackButton onClick={() => navigate(-1)} />

      <div className="inscricao-trilha-header" style={{ position: 'relative' }}>
        {/* Avaliação média no canto superior direito do card (mantemos visual semelhante ao detalhes-evento) */}
        {(mediaAvaliacoes > 0 || mensagemAvaliacao) && (
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent', /* removido fundo branco */
            padding: '12px 18px',
            borderRadius: '12px',
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            zIndex: 10,
            border: 'none'
          }}>
            {mediaAvaliacoes > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#226144' }}>
                  {mediaAvaliacoes.toFixed(1)}
                </span>
                {renderStars(mediaAvaliacoes)}
              </div>
            ) : (
              <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: '500', textAlign: 'center' }}>
                {mensagemAvaliacao.replace('tem', 'possui')}
              </span>
            )}
          </div>
        )}

        {/* Reusar o componente EventoInfo para aplicar o mesmo layout/estilização da tela de detalhes */}
        <EventoInfo
          evento={{
            titulo: evento.nome,
            descricao: evento.descricao,
            nivelDificuldade: evento.nivel_dificuldade,
            distanciaKm: evento.distancia_km,
            responsavel: evento.responsavel,
            endereco: evento.endereco,
            caminhoArquivoEvento: evento.caminho_arquivo_evento,
            preco: evento.preco,
            horaInicio: evento.horaInicio,
            horaFim: evento.horaFinal,
            tempoEstimado: evento.tempoEstimado,
            limiteInscritos: evento.limiteInscritos,
            dataEvento: evento.dataAtivacao,
            categoria: evento.tipo,
            estado: evento.estado,
            imagemUrl: imagemEvento || catalogoFallback
          }}
          inscritosCount={inscritosCount}
          editavel={false}
          showBackButton={false}
        >
          {/* Informações adicionais (reduzidas) dentro do card EventoInfo: apenas endereço para evitar duplicação */}
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', width: '100%' }}>
              <div className="evento-descricao" style={{ gridColumn: '1 / 3', marginTop: 0 }}>
                <label>Endereço:</label>
                <p>
                  {evento.endereco
                    ? `${evento.endereco.rua || ""}${evento.endereco.numero ? ', ' + evento.endereco.numero : ''} - ${evento.endereco.bairro || ""}, ${evento.endereco.cidade || ""} - ${evento.endereco.estado || ""}, CEP: ${evento.endereco.cep || ""}`
                    : 'Endereço não disponível'}
                </p>
              </div>
              <div className="campo-info" style={{ gridColumn: '3 / 4' }}>
                <label>Nível:</label>
                <span style={{ 
                  fontWeight: '600',
                  color: evento.nivel_dificuldade === 'Explorador' ? '#2e7d32' : 
                         evento.nivel_dificuldade === 'Aventureiro' ? '#ed6c02' : 
                         evento.nivel_dificuldade === 'Desbravador' ? '#d32f2f' : '#2c3e2c'
                }}>
                  {evento.nivel_dificuldade || 'Não especificado'}
                </span>
              </div>
            </div>
          </div>
        </EventoInfo>
      </div>

      <form className="inscricao-trilha-dados" style={{ display: 'none' }}>
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

      {!nivelInsuficiente && (
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

            if (anamnese && anamnese.length > 0) {
              showWarning("Você já possui uma anamnese agendada. Aguarde a finalização antes de se inscrever em outra trilha.");
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
      )}

      {nivelInsuficiente && (
        <div style={{
          marginTop: 24,
          padding: '16px',
          background: '#fff3cd',
          color: '#856404',
          border: '1px solid #ffeeba',
          borderRadius: 8
        }}>
          <strong>Atenção:</strong> Seu nível atual não permite participar desta trilha. Entre em contato com um guia para orientação ou participe de eventos para subir de nível.
        </div>
      )}

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