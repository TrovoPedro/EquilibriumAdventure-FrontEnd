import "./InscricaoTrilhas.css";
import Header from "../../components/header/header-unified";
import CircleBackButton from "../../components/circle-back-button/circle-back-button";
import MapaTrilha from "../../components/mapa-trilha/MapaTrilha";
import React, { useState, useEffect } from "react";
import { showSuccess, showError, showWarning } from "../../utils/swalHelper";
import { useAuth } from "../../context/AuthContext";
import { useScore } from "../../context/ScoreContext";
import { useNavigate, useParams } from "react-router-dom";
import Comentarios from '../../components/comentarios/Comentarios';
import EventoInfo from '../../components/evento-info/EventoInfo';
import { buscarImagemEvento, buscarEventoAtivoPorId, buscarGpx, buscarMediaAvaliacoesPorEventoBase } from "../../services/apiEvento";
import catalogoFallback from "../../assets/img12-catalogo.jpg";
import { listarComentariosPorAtivacao, adicionarComentario } from '../../services/apiComentario';
import { verificarInscricao, criarInscricao, cancelarInscricao, listarInscritos } from "../../services/apiInscricao";
import Swal from 'sweetalert2';
import { formatarHora, formatarDuracao } from '../../utils/formatBrazilTime';
import { formatarPreco } from "../../utils/formatPrice";
import { convertDateToBrazilian } from "../../utils/dateConversions";
import { capitalizarPrimeiraLetra } from "../../utils/capitFirstLetter";

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
  const [pdfUrl, setPdfUrl] = useState(null);
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
            idEvento: ativacao.evento?.idEvento,
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

  useEffect(() => {
    const carregarMediaAvaliacoes = async () => {
      try {
        if (evento?.idEvento) {
          const resultado = await buscarMediaAvaliacoesPorEventoBase(evento.idEvento);

          if (resultado.mediaAvaliacoes !== undefined) {
            setMediaAvaliacoes(resultado.mediaAvaliacoes);
            setMensagemAvaliacao('');
          } else if (resultado.mensagem) {
            setMediaAvaliacoes(0);
            setMensagemAvaliacao(resultado.mensagem);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar média de avaliações:', error);
      }
    };

    carregarMediaAvaliacoes();
  }, [evento?.idEvento]);

  { inscrito ? 'Cancelar inscrição' : 'Realizar inscrição' }
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
      idAtivacaoEvento: id
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

    const nivelUsuario = nivelOrdem[nivel?.toUpperCase()] || 0;
    const nivelTrilha = nivelOrdem[evento.nivel_dificuldade?.toUpperCase()] || 0;


    // Verificação especial para EXPLORADOR com pontuação baixa
    if (nivel === 'EXPLORADOR' && pontuacaoTotal != null && pontuacaoTotal <= 7) {

      if (anamnese && anamnese.length > 0) {
        console.log('Já possui anamnese agendada');
        setNivelInsuficiente(true);
        showWarning(
          'Você já possui uma anamnese agendada. Aguarde a conversa com o guia antes de se inscrever nesta trilha.',
          'Atenção',
          'OK'
        );
      } else {
        setNivelInsuficiente(true);

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
    const nivelUsuario = nivelOrdem[nivel?.toUpperCase()] || 0;
    const nivelTrilha = nivelOrdem[evento.nivel_dificuldade?.toUpperCase()] || 0;
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
    <div className="inscricao-trilha-page">
      <div className="inscricao-trilha-container" style={{ position: 'relative' }}>
        <Header />
        <CircleBackButton onClick={() => navigate(-1)} />

        <div className="inscricao-trilha-header" style={{ position: 'relative' }}>
          {/* Avaliação média no canto superior direito do card (mantemos visual semelhante ao detalhes-evento) */}
          {(mediaAvaliacoes > 0 || mensagemAvaliacao) && (
            <div className="avaliacao">
              {mediaAvaliacoes > 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#226144' }}>
                    {mediaAvaliacoes.toFixed(1)}
                  </span>
                  {renderStars(mediaAvaliacoes)}
                </div>
              ) : (
                <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: '500', textAlign: 'center' }}>
                  {mensagemAvaliacao}
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
              preco: formatarPreco(evento.preco),
              horaInicio: formatarHora(evento.horaInicio),
              horaFim: formatarHora(evento.horaFinal),
              tempoEstimado: formatarDuracao(evento.tempoEstimado),
              limiteInscritos: evento.limiteInscritos,
              dataEvento: convertDateToBrazilian(evento.dataAtivacao),
              categoria: capitalizarPrimeiraLetra(evento.tipo),
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
                <div className="campo-info">
                  <label>Nível:</label>
                  <span style={{
                    fontWeight: '600',
      
                    padding: '10px 12px',
                    marginBottom: '4px',

                    display: 'inline-block',
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

        {pdfUrl && (
        <div className="card inscricao-trilha-instrucoes" style={{
          background: 'linear-gradient(135deg, #f0f9f4 0%, #e8f5e9 100%)',
          borderRadius: '10px',
          padding: '10px 20px',
          margin: '20px 0 10px 0',
          boxShadow: '0 3px 12px rgba(34, 97, 68, 0.08)',
          border: '1px solid #c8e6c9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          width: '100%',
          minHeight: '56px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1b5e20" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            <div>
              <h3 style={{
                fontSize: '0.95rem',
                fontWeight: '700',
                color: '#1b5e20',
                margin: 0,
                lineHeight: '1.1'
              }}>
                Instruções da Trilha
              </h3>
              <p style={{
                fontSize: '0.8rem',
                color: '#2e7d32',
                margin: 0,
                lineHeight: '1.1'
              }}>
                Baixe o documento com orientações importantes sobre a trilha
              </p>
            </div>
          </div>
          <a
            href={pdfUrl}
            download={pdfNome || `instrucoes-${evento?.nome || 'trilha'}.pdf`}
            style={{
              background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 3px 10px rgba(46, 125, 50, 0.2)',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(46, 125, 50, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(46, 125, 50, 0.25)';
            }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Baixar PDF
            </a>
        </div>
      )}
          
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
      </div>
    </div>
  );
};

export default InscricaoTrilhasLimitado;