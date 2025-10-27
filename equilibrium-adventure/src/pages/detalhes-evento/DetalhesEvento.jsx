import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Header from '../../components/header/header-unified';
import EventoInfo from '../../components/evento-info/EventoInfo';
import UsuariosInscritos from '../../components/usuarios-inscritos/UsuariosInscritos';
import Comentarios from '../../components/comentarios/Comentarios';
import './DetalhesEvento.css';
import { buscarImagemEvento, buscarEventoAtivoPorId } from "../../services/apiEvento";
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
      const atualizado = await atualizarAtivacaoEvento(id, evento);
      await showSuccess('Evento atualizado com sucesso!');

      setEvento(prev => ({
        ...prev,
        ...atualizado
      }));
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


  return (
    <div className="detalhes-evento-container">
      <Header />
      <div className="detalhes-evento-content">
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