import React, { useState, useEffect } from "react";
import "./agenda-aventureiro.css";
import defaultAvatar from "../../assets/imagem-do-usuario-grande.png";
import Trilha from "../../assets/cachoeiralago.jpg";
import Header from "../../components/header/header-unified";
import ButtonSubmitForm from "../../components/button-padrao/button-submit-form";
import ButtonDangerForm from "../../components/button-padrao/button-danger-form";
import ButtonBack from "../../components/circle-back-button2/circle-back-button2";
import { useNavigate } from "react-router-dom";
import routeUrls from "../../routes/routeUrls";
import {
  buscarInscricoesPorUsuario,
  cancelarInscricao,
  buscarHistoricoPorUsuario,
  verificarAtivacaoAvaliada,
  avaliarInscricao,
} from "../../services/apiAventureiro";
import Swal from 'sweetalert2';
import { showError, showSuccess, showWarning } from "../../utils/swalHelper";
import { buscarImagemUsuario } from "../../services/apiUsuario";
import { useAuth } from "../../context/AuthContext";
import { convertDateToBrazilian } from "../../utils/dateConversions";

const CriarAgendaAventureiro = () => {
  const navigate = useNavigate();
  const { usuario, anamnese, recarregarAnamnese } = useAuth();
  const idUsuario = usuario?.id;
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [agenda, setAgenda] = useState([]);
  const [historico, setHistorico] = useState([]);
  const evaluatedIdsRef = React.useRef(new Set());
  const tipoUsuario = usuario?.tipoUsuario;
  const nomeUsuario = usuario?.nome;

  const handleBack = () => navigate(-1);

  useEffect(() => {
    const buscaImagem = async () => {
      if (!idUsuario) return;
      const url = await buscarImagemUsuario(idUsuario);
      setAvatarUrl(url);
    };
    buscaImagem();
  }, [idUsuario]);

  useEffect(() => {
    const carregarAgenda = async () => {
      if (!idUsuario) return;
      try {
  const data = await buscarInscricoesPorUsuario(idUsuario);
  console.log("Dados recebidos do back:", data);
        const agendaFormatada = data.map((item) => ({
          idEvento: item.idAtivacaoEvento,
          nomeEvento: item.nomeEvento ?? "Sem nome",
          dataAtivacao: item.dataAtivacao,
          imagem: item.imagemEvento,
        }));
  console.log("Agenda formatada:", agendaFormatada);
        setAgenda(agendaFormatada);
      } catch (error) {
        console.error(error);
      }
    };
    carregarAgenda();
  }, [idUsuario]);

  useEffect(() => {
    const carregarHistorico = async () => {
      if (!idUsuario) return;
      try {
        await recarregarAnamnese();
        const data = await buscarHistoricoPorUsuario(idUsuario);
        const historicoFormatado = data.map((item) => ({
          idInscricao: item.idInscricao ?? item.idInscricaoEvento ?? null,
          idEvento: item.idAtivacaoEvento,
          nomeEvento: item.nomeEvento ?? "Sem nome",
          dataAtivacao: item.dataAtivacao,
        }));
        setHistorico(historicoFormatado);
        const promessas = historicoFormatado.map(async (h) => {
          if (!h.idEvento) return null;
          const avaliada = await verificarAtivacaoAvaliada(idUsuario, h.idEvento);
          if (avaliada === false) return h;
          return null;
        });

        const resultados = await Promise.all(promessas);
        const naoAvaliadas = resultados.filter(Boolean);
        console.log('ativacoes não avaliadas (antes de filtrar por sessão):', naoAvaliadas.map(n => n?.idEvento));
        const naoAvaliadasFiltradas = naoAvaliadas.filter(n => n && !evaluatedIdsRef.current.has(n.idEvento));
        console.log('ativacoes não avaliadas (após filtrar por sessão):', naoAvaliadasFiltradas.map(n => n?.idEvento));
        if (naoAvaliadasFiltradas.length > 0) {
          mostrarModalAvaliacao(naoAvaliadasFiltradas);
        }
      } catch (error) {
        console.error(error);
      }
    };
    carregarHistorico();
  }, [idUsuario]);

  const mostrarModalAvaliacao = (itens) => {
    if (!itens || itens.length === 0) return;

    const html = `
      <style>
        .ea-rating-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e6e6e6}
        .ea-event-name{flex:1;margin-right:12px}
        .ea-stars{display:inline-flex;gap:6px}
        .ea-star{font-size:28px;cursor:pointer;color:#cfcfcf}
        .ea-star.filled{color:#FFD700}
      </style>
      <div>
        ${itens
          .map((it, idx) => `
            <div class="ea-rating-row" data-idx="${idx}" data-idinscricao="${it.idInscricao}" data-idevento="${it.idEvento}">
              <div class="ea-event-name">${it.nomeEvento} <br/><small>${formatarData(it.dataAtivacao)}</small></div>
              <div class="ea-stars" data-idx="${idx}">
                <span class="ea-star" data-value="1">☆</span>
                <span class="ea-star" data-value="2">☆</span>
                <span class="ea-star" data-value="3">☆</span>
                <span class="ea-star" data-value="4">☆</span>
                <span class="ea-star" data-value="5">☆</span>
              </div>
            </div>
          `)
          .join('')}
      </div>
    `;

    const ratings = {};

    Swal.fire({
      title: 'Avalie seus eventos concluídos',
      html,
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Finalizar avaliações',
      width: '720px',
      customClass: { popup: 'swal2-shadow' },
      didOpen: () => {
        const container = Swal.getHtmlContainer();
        if (!container) return;
        container.querySelectorAll('.ea-stars').forEach((starsGroup) => {
          const idx = starsGroup.getAttribute('data-idx');
          const row = container.querySelector(`.ea-rating-row[data-idx="${idx}"]`);
          const idInscricao = row?.getAttribute('data-idinscricao');
          starsGroup.querySelectorAll('.ea-star').forEach((star) => {
            star.addEventListener('click', (ev) => {
              const value = Number(star.getAttribute('data-value')) || 0;
              ratings[idx] = value;
              starsGroup.querySelectorAll('.ea-star').forEach((s) => {
                const v = Number(s.getAttribute('data-value')) || 0;
                if (v <= value) {
                  s.classList.add('filled');
                  s.textContent = '★';
                } else {
                  s.classList.remove('filled');
                  s.textContent = '☆';
                }
              });
            });
            star.addEventListener('mouseenter', () => {
              const v = Number(star.getAttribute('data-value')) || 0;
              starsGroup.querySelectorAll('.ea-star').forEach((s) => {
                const sv = Number(s.getAttribute('data-value')) || 0;
                s.textContent = sv <= v ? '★' : '☆';
              });
            });
            star.addEventListener('mouseleave', () => {
              starsGroup.querySelectorAll('.ea-star').forEach((s) => {
                if (s.classList.contains('filled')) s.textContent = '★'; else s.textContent = '☆';
              });
            });
          });
        });
      }
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      const avaliadosIds = [];
      const promises = itens.map(async (it, idx) => {
        const rating = ratings[idx];
        if (!rating) return null;
        let sendOk = null;
        if (it.idInscricao) {
          try {
            await avaliarInscricao(it.idInscricao, rating);
            sendOk = true;
          } catch (err) {
            sendOk = false;
            console.error('Erro ao enviar avaliação para idInscricao', it.idInscricao, err);
          }
        } else {
          console.log('idInscricao ausente para evento', it.idEvento, '- pulando envio direto, farei verificação posterior');
        }

        try {
          const avaliada = await verificarAtivacaoAvaliada(idUsuario, it.idEvento);
          console.log('Revalidação após avaliar para evento', it.idEvento, '=>', avaliada);
          if (sendOk === true || avaliada === true) {
            avaliadosIds.push(it.idEvento);
            return true;
          }
          return { error: !(sendOk === true), item: it };
        } catch (err) {
          console.error('Erro na revalidação de avaliação para evento', it.idEvento, err);
          return { error: !(sendOk === true), item: it };
        }
      });

      const results = await Promise.all(promises);
      const hadError = results.some(r => r && r.error);
      if (hadError) {
        showError('Algumas avaliações falharam ou não foram confirmadas. Tente novamente.');
      } else {
        showSuccess('Avaliações enviadas e confirmadas com sucesso!');
        avaliadosIds.forEach(id => evaluatedIdsRef.current.add(id));
        console.log('Eventos avaliados nesta sessão:', Array.from(evaluatedIdsRef.current));
      }
    });
  };

  const handleCancelar = async (idEvento) => {
    const confirmResult = await showWarning(
      "Tem certeza que deseja cancelar sua inscrição?",
      "Atenção",
      "Sim, cancelar",
      "Não",
      true
    );

    if (!confirmResult.isConfirmed) return;

    try {
      await cancelarInscricao(idUsuario, idEvento);
      setAgenda((prev) => prev.filter((item) => item.idEvento !== idEvento));
      showSuccess("Inscrição cancelada com sucesso!");
    } catch (error) {
      console.error(error);
      showError("Erro ao cancelar inscrição!");
    }
  };

  const formatarData = (dataString) => convertDateToBrazilian(dataString);

  return (
    <>
      <Header />
      <div className="agenda-aventureiro-container">
        <div className="agenda-aventureiro-cards">
          <div className="card-info-guia">
            <div className="info-pessoais-header">
              <ButtonBack onClick={handleBack} />
              <h2>Informações Pessoais</h2>
            </div>
            <div className="personal-info-card">
              <div className="user-photo">
                <img
                  src={avatarUrl || defaultAvatar}
                  alt="Imagem Usuário"
                  onError={(e) => (e.target.src = defaultAvatar)}
                />
              </div>
              <div className="user-info-content">
                <div className="user-info">
                  <h3>{nomeUsuario}</h3>
                  <span className="user-role">{tipoUsuario}</span>
                </div>
                <ButtonSubmitForm
                  title="Mais Informações"
                  type="button"
                  onClick={() => navigate(routeUrls.INFORMACOES_PESSOAIS)}
                />
              </div>
            </div>
          </div>

          <div className="card-imagem">
            <h2>Próximo Evento</h2>
            {console.log("Agenda atual:", agenda)}
            <div className="next-event-card">
              {(() => {
                const proximoEventoComImagem = agenda.find(item => item.imagem) || agenda[0];

                return (
                  <img
                    src={
                      proximoEventoComImagem?.imagem
                        ? `data:image/jpeg;base64,${proximoEventoComImagem.imagem}`
                        : Trilha
                    }
                    alt="EVENTO"
                    onError={(e) => (e.target.src = Trilha)}
                    onClick={() => {
                      if (proximoEventoComImagem && proximoEventoComImagem.idEvento) {
                        navigate(routeUrls.INSCRICAO_TRILHAS.replace(':id', proximoEventoComImagem.idEvento));
                      }
                    }}
                    style={{ cursor: proximoEventoComImagem ? 'pointer' : 'default' }}
                  />
                );
              })()}
            </div>
          </div>

        </div>

        <div className="agenda-aventureiro-section">
          <div className="agenda-aventureiro-card-agenda">
            <h3 className="agenda-aventureiro-card-title">Minha Agenda</h3>
            <div className="agenda-aventureiro-list">
              {anamnese && anamnese.length > 0 ? (
                <div className="agenda-aventureiro-anamnese-section">
                  {anamnese.map((item, idx) => (
                    <div key={`anamnese-${idx}`} className="agenda-aventureiro-item agenda-aventureiro-anamnese-item" style={{ borderLeft: '4px solid #ff9800' }}>
                      <div className="agenda-aventureiro-item-info">
                        <span className="agenda-aventureiro-item-name">
                          Conversa com Guia: {item.nomeGuia || 'Guia'}
                        </span>
                        <span className="agenda-aventureiro-item-date">
                          {item.dataDisponivel ? formatarData(item.dataDisponivel) : 'Data não disponível'}
                        </span>
                        <span style={{ fontSize: '12px', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
                          Caso queira reagendar, entre em contato por WhatsApp
                        </span>
                      </div>
                    </div>
                  ))}
                  <hr style={{ margin: '16px 0', borderColor: '#e0e0e0' }} />
                </div>
              ) : null}
              {agenda.length > 0 ? (
                agenda.map((item) => (
                  <div key={item.idEvento} className="agenda-aventureiro-item">
                    <div className="agenda-aventureiro-item-info">
                      <span className="agenda-aventureiro-item-name">
                        {item.nomeEvento}
                      </span>
                      <span className="agenda-aventureiro-item-date">
                        {formatarData(item.dataAtivacao)}
                      </span>
                    </div>
                    <div className="agenda-aventureiro-item-actions">
                      <ButtonSubmitForm
                        title="Mais Informações"
                        type="button"
                        onClick={() => navigate(routeUrls.INSCRICAO_TRILHAS.replace(':id', item.idEvento))}
                      />
                      <ButtonDangerForm
                        title="Cancelar Inscrição"
                        type="button"
                        onClick={() => handleCancelar(item.idEvento)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p>{anamnese && anamnese.length > 0 ? 'Nenhum evento futuro encontrado.' : 'Nenhum evento futuro encontrado.'}</p>
              )}
            </div>
          </div>
        </div>

        <div className="agenda-aventureiro-historico">
          <div className="agenda-aventureiro-historico-container">
            <h3 className="agenda-aventureiro-card-title">Histórico</h3>
            <div className="agenda-aventureiro-historico-list">
              {historico.length > 0 ? (
                historico.map((item) => (
                  <div
                    key={item.idEvento}
                    className="agenda-aventureiro-historico-item"
                  >
                    <div className="agenda-aventureiro-historico-info">
                      <span className="agenda-aventureiro-item-name">
                        {item.nomeEvento}
                      </span>
                      <span className="agenda-aventureiro-item-date">
                        {formatarData(item.dataAtivacao)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nenhum histórico encontrado.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CriarAgendaAventureiro;