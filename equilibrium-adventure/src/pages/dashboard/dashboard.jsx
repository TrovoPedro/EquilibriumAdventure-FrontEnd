import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Header from '../../components/header/header-unified';
import ButtonBack from '../../components/circle-back-button2/circle-back-button2';
import useGoBack from '../../utils/useGoBack';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { showError } from '../../utils/swalHelper';
import {
  getEventosAtivosFuturos,
  getTaxaOcupacaoMedia,
  getUsuariosNovosFrequentes,
  getTopCidades,
  getRankingEventos,
  getPalavrasComentarios,
  getTopCidadesPeriodo,
  getRankingEventosPeriodo,
  getPalavrasComentariosPeriodo,
  getTendenciasAno,
  getTendenciasMes,
  getTendenciasDia,
  getTendenciasPeriodo,
  getInscricaoLimite
} from '../../services/apiDashboard';

const Dashboard = () => {
  const { usuario } = useAuth();
  const [activeTab, setActiveTab] = useState('quantitativos');
  const [selectedMonth, setSelectedMonth] = useState('Janeiro');
  const [chartView, setChartView] = useState('Mensal');
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startDateQual, setStartDateQual] = useState('');
  const [endDateQual, setEndDateQual] = useState('');
  
  const [eventosAtivos, setEventosAtivos] = useState(0);
  const [participationData, setParticipationData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [eventsRanking, setEventsRanking] = useState([]);
  const [words, setWords] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [participantsData, setParticipantsData] = useState({ frequentes: 0, novos: 0 });
  const [occupancyData, setOccupancyData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const goBack = useGoBack();

  useEffect(() => {
    if (dataLoaded) {
      return;
    }
    
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Reset explícito de todos os dados no início
        setEventosAtivos(0);
        setParticipationData([]);
        setCitiesData([]);
        setEventsRanking([]);
        setWords([]);
        setChartData([]);
        setParticipantsData({ frequentes: 0, novos: 0 });
        setOccupancyData([]);
        
        // Usar o usuário do contexto primeiro, senão sessionStorage
        let usuarioId = null;
        
        if (usuario && usuario.id) {
          usuarioId = usuario.id;
        } else {
          const storedUser = sessionStorage.getItem("usuario");
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            usuarioId = userData.id || userData.id_usuario;
          }
        }
        
        if (!usuarioId) {
          setLoading(false);
          return;
        }

        try {
          const eventosAtivosData = await getEventosAtivosFuturos(usuarioId);
          if (eventosAtivosData !== null && eventosAtivosData !== undefined) {
            setEventosAtivos(eventosAtivosData);
          }
        } catch (error) {
          // Silenciar erro
        }

        try {
          const citiesDataFromAPI = await getTopCidades(usuarioId);
          if (citiesDataFromAPI && citiesDataFromAPI.length > 0) {
            const formattedCities = citiesDataFromAPI.map((item, index) => ({
              name: item.cidade,
              value: item.totalParticipantes,
              color: ['#10b981', '#3b82f6', '#8b5cf6', '#94a3b8', '#6b7280'][index % 5],
              state: ''
            }));
            setCitiesData(formattedCities);
          }
        } catch (error) {
          // Silenciar erro
        }

        try {
          const eventsRankingData = await getRankingEventos(usuarioId);
          if (eventsRankingData && eventsRankingData.length > 0) {
            const formattedRanking = eventsRankingData.map(item => ({
              name: item.nome,
              inscricoes: item.totalInscricoes,
              avaliacao: item.notaMedia
            }));
            setEventsRanking(formattedRanking);
          }
        } catch (error) {
          // Silenciar erro
        }

        try {
          const wordsData = await getPalavrasComentarios(usuarioId);
          if (wordsData && wordsData.length > 0) {
            const formattedWords = wordsData.map(item => ({
              text: item.palavra,
              size: Math.min(Math.max(item.quantidade * 4, 18), 64),
              color: item.quantidade > 5 ? '#10b981' : item.quantidade > 2 ? '#3b82f6' : '#6b7280'
            }));
            setWords(formattedWords);
          }
        } catch (error) {
          // Silenciar erro
        }

        try {
          
          const usuariosData = await getUsuariosNovosFrequentes(usuarioId);
          
          // Verificar se a API retornou dados válidos E se realmente há participantes
          if (usuariosData && 
              typeof usuariosData === 'object' && 
              (usuariosData.Frequente > 0 || usuariosData.Novo > 0)) {
            setParticipantsData({
              frequentes: usuariosData.Frequente || 0,
              novos: usuariosData.Novo || 0
            });
          } else {
            setParticipantsData({ frequentes: 0, novos: 0 });
          }
          
        } catch (error) {
          setParticipantsData({ frequentes: 0, novos: 0 });
        }

        try {
          const participationDataFromAPI = await getInscricaoLimite(usuarioId);
          
          if (participationDataFromAPI && participationDataFromAPI.length > 0) {
            
            const formattedParticipation = participationDataFromAPI.map((item, index) => ({
              name: item.evento,
              value: item.inscricoes,
              max: item.capacidadeMaxima,
              color: [
                '#065f46', '#10b981', '#3b82f6', '#6b7280', '#d1fae5'
              ][index % 5]
            }));
            
            setParticipationData(formattedParticipation);
          } else {
            // Dados vazios
          }
        } catch (error) {
          // Silenciar erro
        }

        try {
          const occupancyDataFromAPI = await getTaxaOcupacaoMedia(usuarioId);
          if (occupancyDataFromAPI && occupancyDataFromAPI.length > 0) {
            setOccupancyData(occupancyDataFromAPI);
          }
        } catch (error) {
          // Silenciar erro
        }

        try {
          const hoje = new Date();
          const umMesAtras = new Date();
          umMesAtras.setDate(hoje.getDate() - 30);
          
          const endDateStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
          const startDateStr = `${umMesAtras.getFullYear()}-${String(umMesAtras.getMonth() + 1).padStart(2, '0')}-${String(umMesAtras.getDate()).padStart(2, '0')}`;
          
          const tendenciasData = await getTendenciasPeriodo(usuarioId, startDateStr, endDateStr);
          
          if (tendenciasData && tendenciasData.length > 0) {
            const formattedChart = preencherDiasFaltantes(tendenciasData, startDateStr, endDateStr);
            setChartData(formattedChart);
          } else {
            
          }
        } catch (error) {
          
        }
        
      } catch (error) {
        
      } finally {
        setLoading(false);
        setDataLoaded(true);
      }
    };

    loadDashboardData();
  }, [dataLoaded]);

  


  const calculateOccupancyRate = (data) => {
    if (!data || data.length === 0) return 0;
    const totalOccupancy = data.reduce((sum, item) => {
      return sum + (item.value / item.max) * 100;
    }, 0);
    return Math.round(totalOccupancy / data.length);
  };

  const preencherDiasFaltantes = (dados, dataInicio, dataFim) => {
    if (!dados || dados.length === 0) return [];
    
    const mapaInscricoes = {};
    dados.forEach(item => {
      mapaInscricoes[item.dia] = item.totalInscricoes;
    });
    
    const resultado = [];
    const inicio = new Date(dataInicio + 'T00:00:00');
    const fim = new Date(dataFim + 'T00:00:00');
    
    for (let data = new Date(inicio); data <= fim; data.setDate(data.getDate() + 1)) {
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const dia = String(data.getDate()).padStart(2, '0');
      const dataStr = `${ano}-${mes}-${dia}`;
      
      resultado.push({
        month: `${dia}/${mes}`,
        value: mapaInscricoes[dataStr] || 0
      });
    }
    
    return resultado;
  };

  const averageOccupancyRate = occupancyData.length > 0 
    ? Math.round(occupancyData.reduce((sum, item) => sum + parseFloat(item.taxaOcupacaoPercentual), 0) / occupancyData.length)
    : 0;

  const monthlyOccupancyData = {};
  
  if (occupancyData.length > 0) {
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    meses.forEach(mes => {
      monthlyOccupancyData[mes] = 0;
    });
    
    occupancyData.forEach(item => {
      const mesString = item.mes;
      const mesNumero = parseInt(mesString.split('-')[1]);
      const mesIndex = mesNumero - 1;
      
      if (mesIndex >= 0 && mesIndex < 12) {
        monthlyOccupancyData[meses[mesIndex]] = Math.round(parseFloat(item.taxaOcupacaoPercentual));
      }
    });
  } else {
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    meses.forEach(mes => {
      monthlyOccupancyData[mes] = 0;
    });
  }

  const selectedMonthOccupancy = monthlyOccupancyData[selectedMonth] || 0;

  const handlePeriodoFilter = async () => {
    // Validar se a data inicial é maior que a data final
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      await showError(
        'A data inicial não pode ser maior que a data final.',
        'Datas Inválidas'
      );
      return;
    }

    try {
      setLoading(true);
      
      // Consistently resolve usuarioId: prefer context -> sessionStorage -> localStorage
      let usuarioId = null;
      if (usuario && (usuario.id || usuario.id_usuario)) {
        usuarioId = usuario.id || usuario.id_usuario;
      } else {
        const stored = sessionStorage.getItem("usuario") || localStorage.getItem("usuario");
        if (!stored) {
          return;
        }
        try {
          const userData = JSON.parse(stored);
          usuarioId = userData.id || userData.id_usuario;
        } catch (err) {
          return;
        }
      }

      const start = startDate || null;
      const end = endDate || null;

      try {
        const tendenciasData = await getTendenciasPeriodo(usuarioId, start, end);
        
        if (tendenciasData && tendenciasData.length > 0) {
          const formattedChart = preencherDiasFaltantes(tendenciasData, start, end);
          setChartData(formattedChart);
        } else {
          setChartData([]);
        }
      } catch (error) {
        setChartData([]);
      }
    } catch (error) {
      // Silenciar erro
    } finally {
      setLoading(false);
    }
  };

  const handleLimparFiltro = async () => {
    setStartDate('');
    setEndDate('');
    
    try {
      setLoading(true);
      
      let usuarioId = null;
      if (usuario && (usuario.id || usuario.id_usuario)) {
        usuarioId = usuario.id || usuario.id_usuario;
      } else {
        const stored = sessionStorage.getItem("usuario") || localStorage.getItem("usuario");
        if (!stored) {
          return;
        }
        try {
          const userData = JSON.parse(stored);
          usuarioId = userData.id || userData.id_usuario;
        } catch (err) {
          return;
        }
      }

      try {
        const hoje = new Date();
        const umMesAtras = new Date();
        umMesAtras.setDate(hoje.getDate() - 30);
        
        const endDateStr = hoje.toISOString().split('T')[0];
        const startDateStr = umMesAtras.toISOString().split('T')[0];
        
        const tendenciasData = await getTendenciasPeriodo(usuarioId, startDateStr, endDateStr);
        
        if (tendenciasData && tendenciasData.length > 0) {
          const formattedChart = preencherDiasFaltantes(tendenciasData, startDateStr, endDateStr);
          setChartData(formattedChart);
        } else {
          setChartData([]);
        }
      } catch (error) {
        setChartData([]);
      }
    } catch (error) {
      // Silenciar erro
    } finally {
      setLoading(false);
    }
  };

  const handleQualitativoFilter = async () => {
    // Validar se a data inicial é maior que a data final
    if (startDateQual && endDateQual && new Date(startDateQual) > new Date(endDateQual)) {
      await showError(
        'A data inicial não pode ser maior que a data final.',
        'Datas Inválidas'
      );
      return;
    }

    try {
      setLoading(true);
      
      let usuarioId = null;
      if (usuario && (usuario.id || usuario.id_usuario)) {
        usuarioId = usuario.id || usuario.id_usuario;
      } else {
        const stored = sessionStorage.getItem("usuario") || localStorage.getItem("usuario");
        if (!stored) {
          return;
        }
        try {
          const userData = JSON.parse(stored);
          usuarioId = userData.id || userData.id_usuario;
        } catch (err) {
          return;
        }
      }

      const start = startDateQual || null;
      const end = endDateQual || null;

      try {
        const citiesDataFromAPI = await getTopCidadesPeriodo(usuarioId, start, end);
        if (citiesDataFromAPI && citiesDataFromAPI.length > 0) {
          const formattedCities = citiesDataFromAPI.map((item, index) => ({
            name: item.cidade,
            value: item.totalParticipantes,
            color: ['#10b981', '#3b82f6', '#8b5cf6', '#94a3b8', '#6b7280'][index % 5],
            state: ''
          }));
          setCitiesData(formattedCities);
        } else {
          setCitiesData([]);
        }
      } catch (error) {
        
      }

      try {
        const eventsRankingData = await getRankingEventosPeriodo(usuarioId, start, end);
        if (eventsRankingData && eventsRankingData.length > 0) {
          const formattedRanking = eventsRankingData.map(item => ({
            name: item.nome,
            inscricoes: item.totalInscricoes,
            avaliacao: item.notaMedia
          }));
          setEventsRanking(formattedRanking);
        } else {
          setEventsRanking([]);
        }
      } catch (error) {
        
      }

      try {
        const wordsData = await getPalavrasComentariosPeriodo(usuarioId, start, end);
        if (wordsData && wordsData.length > 0) {
          const formattedWords = wordsData.map(item => ({
            text: item.palavra,
            size: Math.min(Math.max(item.quantidade * 4, 18), 64),
            color: item.quantidade > 5 ? '#10b981' : item.quantidade > 2 ? '#3b82f6' : '#6b7280'
          }));
          setWords(formattedWords);
        } else {
          setWords([]);
        }
      } catch (error) {
        
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  const handleLimparFiltroQualitativo = async () => {
    setStartDateQual('');
    setEndDateQual('');
    
    try {
      setLoading(true);
      
      let usuarioId = null;
      if (usuario && (usuario.id || usuario.id_usuario)) {
        usuarioId = usuario.id || usuario.id_usuario;
      } else {
        const stored = sessionStorage.getItem("usuario") || localStorage.getItem("usuario");
        if (!stored) {
          return;
        }
        try {
          const userData = JSON.parse(stored);
          usuarioId = userData.id || userData.id_usuario;
        } catch (err) {
          return;
        }
      }

      try {
        const citiesDataFromAPI = await getTopCidades(usuarioId);
        if (citiesDataFromAPI && citiesDataFromAPI.length > 0) {
          const formattedCities = citiesDataFromAPI.map((item, index) => ({
            name: item.cidade,
            value: item.totalParticipantes,
            color: ['#10b981', '#3b82f6', '#8b5cf6', '#94a3b8', '#6b7280'][index % 5],
            state: ''
          }));
          setCitiesData(formattedCities);
        }
      } catch (error) {
        // Silenciar erro
      }

      try {
        const eventsRankingData = await getRankingEventos(usuarioId);
        if (eventsRankingData && eventsRankingData.length > 0) {
          const formattedRanking = eventsRankingData.map(item => ({
            name: item.nome,
            inscricoes: item.totalInscricoes,
            avaliacao: item.notaMedia
          }));
          setEventsRanking(formattedRanking);
        }
      } catch (error) {
        // Silenciar erro
      }

      try {
        const wordsData = await getPalavrasComentarios(usuarioId);
        if (wordsData && wordsData.length > 0) {
          const formattedWords = wordsData.map(item => ({
            text: item.palavra,
            size: Math.min(Math.max(item.quantidade * 4, 18), 64),
            color: item.quantidade > 5 ? '#10b981' : item.quantidade > 2 ? '#3b82f6' : '#6b7280'
          }));
          setWords(formattedWords);
        }
      } catch (error) {
        // Silenciar erro
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="stars">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < fullStars ? 'star-full' : (i === fullStars && hasHalfStar ? 'star-half' : 'star-empty')}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="dashboard">
        <div className="dashboard-header">
            <div className="title-row">
              <ButtonBack onClick={goBack} />
              <h1 className={activeTab === 'quantitativos' ? 'active-title' : ''}>
                {activeTab === 'quantitativos' ? 'Dados Quantitativos' : 'Dados Qualitativos'}
              </h1>
            </div>
            <div className="tab-buttons">
            <button
              className={activeTab === 'quantitativos' ? 'tab-btn active' : 'tab-btn'}
              onClick={() => setActiveTab('quantitativos')}
            >
              Dados Quantitativos
            </button>
            <button
              className={activeTab === 'qualitativos' ? 'tab-btn active' : 'tab-btn'}
              onClick={() => setActiveTab('qualitativos')}
            >
              Dados Qualitativos
            </button>
          </div>
        </div>

        {activeTab === 'quantitativos' ? (
          <div className="quantitativos-content">
            <div className="top-section">
              <div className="left-panel">
                <div className="card-title">
                  <h2>Visão Geral</h2>
                  <img
                    src="/src/assets/info.png"
                    alt="Mais informações"
                    title="Exibe o número de eventos ativos, a taxa média de ocupação dos últimos 12 meses e a variação da ocupação média por mês."
                  />
                </div>

                <div className="stat-card green">
                  <div className="stat-icon">📅</div>
                  <div>
                    <div className="stat-label">Eventos Ativos</div>
                    <div className="stat-value">{loading ? '...' : eventosAtivos}</div>
                  </div>
                </div>

                <div className="stat-card blue">
                  <div className="stat-icon">👥</div>
                  <div>
                    <div className="stat-label">Taxa de Ocupação Média (Últimos 12 meses)</div>
                    <div className="stat-value">
                      {loading ? '...' : `${averageOccupancyRate}%`}
                    </div>
                  </div>
                </div>

                <div className="occupancy-chart">
                  <div className="occupancy-header">
                    <span>Ocupação Média por Mês</span>
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                      <option>Janeiro</option>
                      <option>Fevereiro</option>
                      <option>Março</option>
                      <option>Abril</option>
                      <option>Maio</option>
                      <option>Junho</option>
                      <option>Julho</option>
                      <option>Agosto</option>
                      <option>Setembro</option>
                      <option>Outubro</option>
                      <option>Novembro</option>
                      <option>Dezembro</option>
                    </select>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${selectedMonthOccupancy}%`,
                        transition: 'width 0.3s ease'
                      }}
                    ></div>
                  </div>
                  <div className="progress-labels">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                  <div className="occupancy-footer">
                    Taxa de ocupação em {selectedMonth}: {selectedMonthOccupancy}%
                  </div>
                </div>
              </div>

              <div className="right-panel">
                <div className="card-title">
                  <h2>Participação</h2>
                  <img
                    src="/src/assets/info.png"
                    alt="Mais informações"
                    title="Mostra a taxa de ocupação dos eventos ativos, comparando o número de inscritos com o limite máximo de vagas, além da proporção entre participantes novos e recorrentes."
                  />
                </div>

                <div className="participation-section">
                  <div className="section-subtitle">Inscrições vs. Limite por Evento</div>
                  {(() => {
                    if (participationData.length === 0) {
                      return (
                        <div className="participation-placeholder">
                          <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                            📊 Dados de inscrições vs limite não disponíveis
                            <br />
                            <small>Endpoint com erro 500 - verificar backend</small>
                          </p>
                        </div>
                      );
                    }
                    
                    return participationData.map((item, index) => {
                      const percentage = item.value && item.max ? (item.value / item.max) * 100 : 0;
                      
                      return (
                        <div key={index} className="participation-item">
                          <div className="participation-name">{item.name}</div>
                          <div className="participation-bar-container">
                            <div className="participation-bar">
                              <div
                                className="participation-fill"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: '#3b82f6'
                                }}
                              ></div>
                            </div>
                            <span className="participation-value">{item.value}/{item.max}</span>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                <div className="participants-section">
                  <div className="section-subtitle">Participantes Recorrentes e Novos</div>
                  <div className="participants-bars">
                    <div className="participant-bar-item">
                      <span className="participant-dot blue"></span>
                      <span className="participant-label">Participantes Recorrentes</span>
                      <div className="participant-bar">
                        <div className="participant-fill blue" style={{ 
                          width: `${participantsData.frequentes + participantsData.novos > 0 
                            ? (participantsData.frequentes / (participantsData.frequentes + participantsData.novos)) * 100 
                            : 0}%` 
                        }}></div>
                      </div>
                      <span className="participant-count">
                        {loading ? '...' : `${participantsData.frequentes} (${participantsData.frequentes + participantsData.novos > 0 
                          ? ((participantsData.frequentes / (participantsData.frequentes + participantsData.novos)) * 100).toFixed(1) 
                          : 0}%)`}
                      </span>
                    </div>
                    <div className="participant-bar-item">
                      <span className="participant-dot orange"></span>
                      <span className="participant-label">Participantes Novos</span>
                      <div className="participant-bar">
                        <div className="participant-fill orange" style={{ 
                          width: `${participantsData.frequentes + participantsData.novos > 0 
                            ? (participantsData.novos / (participantsData.frequentes + participantsData.novos)) * 100 
                            : 0}%` 
                        }}></div>
                      </div>
                      <span className="participant-count">
                        {loading ? '...' : `${participantsData.novos} (${participantsData.frequentes + participantsData.novos > 0 
                          ? ((participantsData.novos / (participantsData.frequentes + participantsData.novos)) * 100).toFixed(1) 
                          : 0}%)`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="tendencias-section">
              <div className="card-title">
                <h2>Tendências</h2>
                <img
                  src="/src/assets/info.png"
                  alt="Mais informações"
                  title="Exibe a tendência de crescimento no número de inscritos em eventos por período personalizado. Selecione as datas de início e fim para visualizar os dados específicos."
                />
              </div>
              <div className="chart-container">
                <div className="chart-filters">
                  <div className="date-filter-group">
                    <label htmlFor="startDate">Data Início:</label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="date-input"
                    />
                  </div>
                  <div className="date-filter-group">
                    <label htmlFor="endDate">Data Fim:</label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="date-input"
                    />
                  </div>
                  <button 
                    className="filter-btn active" 
                    onClick={handlePeriodoFilter}
                  >
                    Buscar
                  </button>
                  <button 
                    className="filter-btn active" 
                    onClick={handleLimparFiltro}
                  >
                    Limpar
                  </button>
                </div>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={450}>
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, (dataMax) => Math.ceil(dataMax * 1.2)]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={0.1} fill="url(#lineGradient)" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
                    <p>📈 {loading ? 'Carregando dados de tendências...' : `Dados de tendências ${chartView ? chartView.toLowerCase() : 'anuais'} não disponíveis`}</p>
                    {!loading && (
                      <small>Clique nos filtros acima para tentar outros períodos</small>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="qualitativos-content">
            <div className="qualitative-filters-bar">
              <div className="filters-left">
                <span className="filter-label">Filtrar período:</span>
                <div className="date-inputs-compact">
                  <input
                    type="date"
                    id="startDateQual"
                    value={startDateQual}
                    onChange={(e) => setStartDateQual(e.target.value)}
                    className="date-input-compact"
                    placeholder="Data início"
                  />
                  <span className="date-separator">até</span>
                  <input
                    type="date"
                    id="endDateQual"
                    value={endDateQual}
                    onChange={(e) => setEndDateQual(e.target.value)}
                    className="date-input-compact"
                    placeholder="Data fim"
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="filter-btn-compact" 
                  onClick={handleQualitativoFilter}
                >
                  Buscar
                </button>
                <button 
                  className="filter-btn-compact" 
                  onClick={handleLimparFiltroQualitativo}
                >
                  Limpar
                </button>
              </div>
            </div>
            
            <div className="qualitative-top">
              <div className="cities-panel">
                <div className="card-title">
                  <h2>Público-Alvo (Top 7 Cidades)</h2>
                  <img
                    src="/src/assets/info.png"
                    alt="Mais informações"
                    title="As cinco cidades com maior número de participantes."
                  />
                </div>
                <div className="section-subtitle">Localização dos Participantes</div>
                <div className="cities-list">
                  {citiesData.map((city, index) => {
                    const maxValue = Math.max(...citiesData.map(c => c.value), 0);
                    const barLimit = maxValue + 2;
                    return (
                      <div key={index} className="city-item">
                        <div className="city-rank">{index + 1}</div>
                        <div className="city-info">
                          <div className="city-name">
                            <span className="location-icon">📍</span>
                            {city.name}
                          </div>
                          <div className="city-state">{city.state}</div>
                          <div className="city-bar-container">
                            <div className="city-bar">
                              <div
                                className="city-fill"
                                style={{
                                  width: `${(city.value / barLimit) * 100}%`,
                                  backgroundColor: city.color
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="city-count">{city.value}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="cities-footer">
                  <span>Regiões mais ativas</span>
                </div>
                <div className="total-participants">Total de participantes por cidade</div>
              </div>

              <div className="events-panel">
                <div className="card-title">
                  <h2>Desempenho (Ranking de Eventos)</h2>
                  <img
                    src="/src/assets/info.png"
                    alt="Mais informações"
                    title="Classificação dos eventos com base em desempenho e popularidade."
                  />
                </div>
                <table className="events-table">
                  <thead>
                    <tr>
                      <th>Nome do Evento</th>
                      <th>Inscrições ↑↓</th>
                      <th>Avaliação ↑↓</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventsRanking.map((event, index) => (
                      <tr key={index}>
                        <td>
                          <span className="event-number">{index + 1}</span>
                          {event.name}
                        </td>
                        <td>{event.inscricoes}</td>
                        <td>
                          <div className="rating-cell">
                            <span className="rating-number">{event.avaliacao}</span>
                            {renderStars(event.avaliacao)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="events-footer">
                  <span>Mostrando 8 eventos</span>
                </div>
              </div>
            </div>

            <div className="feedback-section">
              <div className="card-title">
                <h2>Feedback Rápido (Mapa de palavras dos comentários)</h2>
                <img
                  src="/src/assets/info.png"
                  alt="Mais informações"
                  title="Mapa de palavras gerado a partir de feedbacks e comentários."
                />
              </div>
              <div className="word-cloud">
                {words.map((word, index) => (
                  <span
                    key={index}
                    className="word"
                    style={{
                      fontSize: `${word.size}px`,
                      color: word.color,
                      margin: '8px 12px'
                    }}
                  >
                    {word.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;