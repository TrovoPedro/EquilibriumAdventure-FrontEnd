import React, { useState } from 'react';
import './Dashboard.css';
import Header from '../../components/header/header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('quantitativos');
  const [selectedMonth, setSelectedMonth] = useState('Janeiro');
  const [chartView, setChartView] = useState('Mensal');
  const [chartData, setChartData] = useState([
    { month: 'Jan', value: 80 },
    { month: 'Fev', value: 130 },
    { month: 'Mar', value: 175 },
    { month: 'Abr', value: 205 },
    { month: 'Mai', value: 245 },
    { month: 'Jun', value: 270 },
    { month: 'Jul', value: 365 },
    { month: 'Ago', value: 415 },
    { month: 'Set', value: 285 },
    { month: 'Out', value: 245 },
    { month: 'Nov', value: 205 },
    { month: 'Dez', value: 105 },
  ]);

  const participationData = [
    { name: 'Trilha na Floresta da Tijuca', value: 45, max: 50, color: '#2e8b57' }, // Verde Floresta
    { name: 'Workshop de Fotografia de Natureza', value: 35, max: 40, color: '#556b2f' }, // Verde Oliva
    { name: 'Passeio de Observação de Aves', value: 28, max: 40, color: '#8fbc8f' }, // Verde Claro
    { name: 'Acampamento Sustentável', value: 38, max: 60, color: '#6b8e23' }, // Verde Musgo
    { name: 'Expedição Fotográfica: Chapada dos', value: 22, max: 25, color: '#228b22' } // Verde Floresta Escuro
  ];

  const citiesData = [
    { name: 'Rio de Janeiro', value: 245, color: '#10b981', state: 'RJ' },
    { name: 'São Paulo', value: 187, color: '#3b82f6', state: 'SP' },
    { name: 'Curitiba', value: 125, color: '#8b5cf6', state: 'PR' },
    { name: 'Florianópolis', value: 98, color: '#94a3b8', state: 'SC' },
    { name: 'Belo Horizonte', value: 76, color: '#6b7280', state: 'MG' }
  ];

  const eventsRanking = [
    { name: 'Trilha na Floresta da Tijuca', inscricoes: 42, avaliacao: 4.8 },
    { name: 'Workshop de Fotografia d...', inscricoes: 35, avaliacao: 4.5 },
    { name: 'Passeio de Observação de ...', inscricoes: 28, avaliacao: 4.7 },
    { name: 'Acampamento Sustentável', inscricoes: 38, avaliacao: 4.2 },
    { name: 'Expedição Fotográfica: Ch...', inscricoes: 22, avaliacao: 4.9 },
    { name: 'Passeio de Canoa no Pant...', inscricoes: 18, avaliacao: 4.6 },
    { name: 'Curso de Identificação de ...', inscricoes: 25, avaliacao: 4.3 },
    { name: 'Trekking Serra dos Órgãos', inscricoes: 32, avaliacao: 4.7 }
  ];

  const words = [
    { text: 'incrível', size: 32, color: '#10b981' },
    { text: 'natureza', size: 42, color: '#3b82f6' },
    { text: 'experiência', size: 38, color: '#3b82f6' },
    { text: 'organizado', size: 34, color: '#10b981' },
    { text: 'guias', size: 30, color: '#3b82f6' },
    { text: 'atrasado', size: 24, color: '#ef4444' },
    { text: 'conhecimento', size: 36, color: '#10b981' },
    { text: 'recomendo', size: 38, color: '#10b981' },
    { text: 'aventura', size: 34, color: '#10b981' },
    { text: 'cansativo', size: 22, color: '#ef4444' },
    { text: 'paisagem', size: 36, color: '#10b981' },
    { text: 'equipamento', size: 28, color: '#3b82f6' },
    { text: 'desorganizado', size: 24, color: '#ef4444' },
    { text: 'inesquecível', size: 34, color: '#10b981' },
    { text: 'transporte', size: 26, color: '#3b82f6' },
    { text: 'lotado', size: 22, color: '#ef4444' },
    { text: 'biodiversidade', size: 32, color: '#3b82f6' },
    { text: 'sustentável', size: 30, color: '#10b981' },
    { text: 'caro', size: 20, color: '#ef4444' },
    { text: 'aprendizado', size: 34, color: '#10b981' }
  ];

  const handleFilter = (filterType) => {
    if (filterType === 'Mensal') {
      setChartData([
        { month: 'Ago', value: 415 },
        { month: 'Set', value: 285 },
        { month: 'Out', value: 245 },
      ]); // Últimos 3 meses
    } else if (filterType === 'Semanal') {
      setChartData([
        { month: 'Segunda', value: 50 },
        { month: 'Terça', value: 70 },
        { month: 'Quarta', value: 90 },
        { month: 'Quinta', value: 110 },
        { month: 'Sexta', value: 130 },
      ]); // Dados semanais
    } else if (filterType === 'Anual') {
      setChartData([
        { month: '2022', value: 300 },
        { month: '2023', value: 400 },
        { month: '2024', value: 500 },
      ]); // Dados anuais
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
          <h1 className={activeTab === 'quantitativos' ? 'active-title' : ''}>
            {activeTab === 'quantitativos' ? 'Dados Quantitativos' : 'Dados Qualitativos'}
          </h1>
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
                    <div className="stat-value">28</div>
                  </div>
                </div>

                <div className="stat-card blue">
                  <div className="stat-icon">👥</div>
                  <div>
                    <div className="stat-label">Taxa de Ocupação Média</div>
                    <div className="stat-value">73%</div>
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
                    <div className="progress-fill" style={{ width: '65%' }}></div>
                  </div>
                  <div className="progress-labels">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                  <div className="occupancy-footer">Taxa de ocupação em Janeiro: 65%</div>
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
                  {participationData.map((item, index) => (
                    <div key={index} className="participation-item">
                      <div className="participation-name">{item.name}</div>
                      <div className="participation-bar-container">
                        <div className="participation-bar">
                          <div
                            className="participation-fill"
                            style={{
                              width: `${(item.value / item.max) * 100}%`,
                              backgroundColor: index === 0 ? '#3b82f6' : '#3b82f6'
                            }}
                          ></div>
                        </div>
                        <span className="participation-value">{item.value}/{item.max}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="participants-section">
                  <div className="section-subtitle">Participantes Recorrentes e Novos</div>
                  <div className="participants-bars">
                    <div className="participant-bar-item">
                      <span className="participant-dot blue"></span>
                      <span className="participant-label">Participantes Recorrentes</span>
                      <div className="participant-bar">
                        <div className="participant-fill blue" style={{ width: '66%' }}></div>
                      </div>
                      <span className="participant-count">345 (66.0%)</span>
                    </div>
                    <div className="participant-bar-item">
                      <span className="participant-dot orange"></span>
                      <span className="participant-label">Participantes Novos</span>
                      <div className="participant-bar">
                        <div className="participant-fill orange" style={{ width: '34%' }}></div>
                      </div>
                      <span className="participant-count">178 (34.0%)</span>
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
                  title="TExibe a tendência de crescimento no número de inscritos em eventos, com opções de visualização por semana, mês ou ano."
                />
              </div>
              <div className="chart-container">
                <div className="chart-filters">
                  <button onClick={() => handleFilter('Semanal')}>Última Semana</button>
                  <button onClick={() => handleFilter('Mensal')}>Últimos Meses</button>
                  <button onClick={() => handleFilter('Anual')}>Últimos Anos</button>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={0.1} fill="url(#lineGradient)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="qualitativos-content">
            <div className="qualitative-top">
              <div className="cities-panel">
                <div className="card-title">
                  <h2>Público-Alvo (Top 5 Cidades)</h2>
                  <img
                    src="/src/assets/info.png"
                    alt="Mais informações"
                    title="As cinco cidades com maior número de participantes."
                  />
                </div>
                <div className="section-subtitle">Localização dos Participantes</div>
                <div className="cities-list">
                  {citiesData.map((city, index) => (
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
                                width: `${(city.value / 245) * 100}%`,
                                backgroundColor: city.color
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="city-count">{city.value}</div>
                    </div>
                  ))}
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
