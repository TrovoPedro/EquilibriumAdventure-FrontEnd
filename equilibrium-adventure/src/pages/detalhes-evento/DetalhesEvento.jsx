import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Header from '../../components/header/header-unified';
import EventoInfo from '../../components/evento-info/EventoInfo';
import UsuariosInscritos from '../../components/usuarios-inscritos/UsuariosInscritos';
import Comentarios from '../../components/comentarios/Comentarios';
import './DetalhesEvento.css';
import { buscarImagemEvento, buscarEventoAtivoPorId, buscarMediaAvaliacoes } from "../../services/apiEvento";
import { listarComentariosPorAtivacao, adicionarComentario } from '../../services/apiComentario';
import { listarInscritos, cancelarInscricao } from '../../services/apiInscricao';
import { useAuth } from "../../context/AuthContext";
import { alterarEstadoEvento, atualizarAtivacaoEvento } from "../../services/chamadasAPIEvento";
import { showSuccess, showError, showWarning } from '../../utils/swalHelper';
import { useNavigate } from 'react-router-dom';
import routeUrls from '../../routes/routeUrls';

const DetalhesEvento = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [mediaAvaliacoes, setMediaAvaliacoes] = useState(0);
  const [mensagemAvaliacao, setMensagemAvaliacao] = useState('');
  const { usuario } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const carregarEvento = async () => {
      try {
        const eventoData = await buscarEventoAtivoPorId(id);

        if (eventoData.length > 0) {
          const ativacao = eventoData[0];
          const imagemUrl = await buscarImagemEvento(ativacao.evento.idEvento);

          setEvento({
            idAtivacao: ativacao.idAtivacao,
            idEvento: ativacao.evento?.idEvento || ativacao.evento?.id_evento || null,
            titulo: ativacao.evento?.nome || "",
            descricao: ativacao.evento?.descricao || "",
            nivelDificuldade: ativacao.evento?.nivelDificuldade || "",
            distanciaKm: ativacao.evento?.distanciaKm || 0,
            responsavel: ativacao.evento?.responsavel || "",
            endereco: ativacao.evento?.endereco || "",
            caminhoArquivoEvento: ativacao.evento?.caminhoArquivoEvento || "",
            preco: ativacao.preco,
            horaInicio: ativacao.horaInicio,
            horaFim: ativacao.horaFinal,
            tempoEstimado: ativacao.tempoEstimado,
            limiteInscritos: ativacao.limiteInscritos,
            dataEvento: ativacao.dataAtivacao,
            categoria: ativacao.tipo,
            estado: ativacao.estado,
            imagemUrl: imagemUrl || ""
          });

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


  const carregarComentarios = async () => {
    if (id) {
      const comentariosData = await listarComentariosPorAtivacao(id);
      setComentarios(comentariosData);
    }
  };

  useEffect(() => {
    carregarComentarios();
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
    const carregarInscritos = async () => {
      try {
        if (id) {
          const inscritos = await listarInscritos(id);
          setUsuarios(inscritos);
        }
      } catch (error) {
        console.error("Erro ao carregar inscritos:", error);
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

  const handleEventoChange = (campo, valor) => {
    setEvento(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleSalvarEvento = async () => {
    const confirmResult = await showWarning('Deseja salvar as alterações neste evento?', 'Confirmar', 'Sim', 'Cancelar', true);
    if (!confirmResult || !confirmResult.isConfirmed) return;

    try {
      const payload = {
        horaInicio: evento.horaInicio,
        horaFim: evento.horaFim,
        tempoEstimado: evento.tempoEstimado,
        limiteInscritos: evento.limiteInscritos,
        dataEvento: evento.dataEvento,
        categoria: evento.categoria,
        preco: evento.preco,
        estado: evento.estado
      };

      if (evento && (evento.idEvento || evento.eventoId)) {
        payload.eventoId = evento.idEvento || evento.eventoId;
      }

      const atualizado = await atualizarAtivacaoEvento(id, payload);
      await showSuccess('Evento atualizado com sucesso!');

   
      if (atualizado) {
        setEvento(prev => ({
          ...prev,
          ...atualizado
        }));
      }
    } catch (error) {
      console.error("Erro ao salvar alterações do evento:", error);
      await showError('Ocorreu um erro ao salvar as alterações. Tente novamente.');
    }
  };

  const handleDelete = async () => {
    const confirmResult = await showWarning('Tem certeza que deseja excluir este evento?', 'Confirmação', 'Sim, excluir', 'Cancelar', true);
    if (!confirmResult || !confirmResult.isConfirmed) return;

    try {
      await alterarEstadoEvento(id, "FINALIZADO");

      const inscritos = await listarInscritos(id);
      if (inscritos && inscritos.length > 0) {
        await Promise.all(inscritos.map(u => cancelarInscricao(u.idUsuario, id).catch(() => null)));
      }

      await showSuccess('Evento excluído!');
      navigate(-1);
    } catch (error) {
      console.error("Erro ao finalizar evento:", error);
      await showError('Ocorreu um erro ao finalizar o evento.');
    }
  };

  const handleAprovarUsuario = (userId) => {
    navigate(routeUrls.DADOS_CLIENTE.replace(':id', userId));
  };

  const handleNegarUsuario = async (userId) => {
    const confirmResult = await showWarning('Tem certeza que deseja cancelar essa inscrição?', 'Confirmação', 'Sim, cancelar', 'Cancelar', true);
    if (!confirmResult || !confirmResult.isConfirmed) return;

    try {
      await cancelarInscricao(userId, id);
      await showSuccess('Inscrição cancelada com sucesso!');

      setUsuarios(prev => prev.filter(u => u.idUsuario !== userId));
    } catch (error) {
      console.error("Erro ao cancelar inscrição:", error);
      await showError(error.message || 'Erro ao cancelar inscrição. Tente novamente.');
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

  return (
    <div className="detalhes-evento-container">
      <Header />

      <div className="detalhes-evento-content">
        <div style={{ position: 'relative' }}>
          {/* Avaliação média no canto superior direito do card */}
          {(mediaAvaliacoes > 0 || mensagemAvaliacao) && (
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.98)',
              padding: '12px 18px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              zIndex: 10,
              border: '1px solid #e0e0e0'
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

          {evento ? (
            <EventoInfo
              evento={evento}
              onChange={handleEventoChange}
              onSalvar={handleSalvarEvento}
              onDelete={handleDelete}
              editavel={true}
            />
          ) : (
            <p>Carregando informações do evento...</p>
          )}
        </div>


        <UsuariosInscritos
          usuarios={usuarios}
          onAprovar={handleAprovarUsuario}
          onNegar={handleNegarUsuario}
        />

        <Comentarios comentariosIniciais={comentarios} onEnviarComentario={handleEnviarComentario} />
      </div>
    </div>
  );
};

export default DetalhesEvento;