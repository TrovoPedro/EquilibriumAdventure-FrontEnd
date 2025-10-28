import React from 'react';
import ButtonSubmitForm from '../button-padrao/button-submit-form';
import './EventoInfo.css';
import CircleBackButton from '../circle-back-button/circle-back-button';
import ButtonDangerForm from '../button-padrao/button-danger-form';
import defaultTrailImg from '../../assets/img12-catalogo.jpg';

const EventoInfo = ({ 
  evento, 
  onSalvar, 
  onDelete,
  onChange,
  editavel = false 
}) => {
  const handleVoltar = () => {
    window.history.back();
  };

  return (
    <div className="evento-info-container">
      <div className="evento-info-top-bar">
        <CircleBackButton onClick={handleVoltar} />
      </div>
      <div className="evento-header">
        <div className="evento-imagem">
          <img
            src={evento?.imagemUrl || defaultTrailImg}
            alt={evento?.titulo || evento?.nome || 'Imagem do evento'}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultTrailImg;
            }}
          />
        </div>
        <div className="evento-detalhes">
          <div className="campo-info-titulo">
            <label>Título:</label>
            <input
              className='input-titulo'
              type="text"
              value={evento.titulo}
              disabled
              readOnly
            />
          </div>
          
          <div className="campos-linha">
            <div className="campo-info">
              <label>Data:</label>
              {editavel ? (
                <input
                  type="date"
                  value={evento.dataEvento}
                  onChange={(e) => onChange('dataEvento', e.target.value)}
                />
              ) : (
                <span>{evento.dataEvento}</span>
              )}
            </div>
            <div className="campo-info">
              <label>Hora Fim:</label>
              {editavel ? (
                <input
                  type="time"
                  value={evento.horaFim}
                  onChange={(e) => onChange('horaFim', e.target.value)}
                />
              ) : (
                <span>{evento.horaFim}</span>
              )}
            </div>
          </div>

          <div className="campos-linha">
            <div className="campo-info">
              <label>Hora Início:</label>
              {editavel ? (
                <input
                  type="time"
                  value={evento.horaInicio}
                  onChange={(e) => onChange('horaInicio', e.target.value)}
                />
              ) : (
                <span>{evento.horaInicio}</span>
              )}
            </div>
            <div className="campo-info">
              <label>Limite de Inscritos:</label>
              {editavel ? (
                <input
                  type="number"
                  value={evento.limiteInscritos}
                  onChange={(e) => onChange('limiteInscritos', e.target.value)}
                />
              ) : (
                <span>{evento.limiteInscritos}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="campos-linha" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginTop: '2.5rem', justifyContent: 'center', width: '100%' }}>
        <div className="campo-info" style={{ width: '500px' }}>
          <label style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: '#226144', fontSize: '1.1rem' }}>CATEGORIA:</label>
          {editavel ? (
            <select
              style={{ height: '48px', borderRadius: '10px', border: '1px solid #d1e7dd', padding: '0 1rem', fontSize: '1.1rem', width: '100%' }}
              value={evento.categoria}
              onChange={(e) => onChange('categoria', e.target.value)}
              required
            >
              <option value="">Selecione uma categoria</option>
              <option value="cachoeira">Cachoeira</option>
              <option value="montanhismo">Montanhismo</option>
              <option value="trilha">Trilha</option>
              <option value="rapel">Rapel</option>
              <option value="escalada">Escalada</option>
              <option value="camping">Camping</option>
              <option value="outros">Outros</option>
            </select>
          ) : (
            <span>{evento.categoria}</span>
          )}
        </div>
        <div className="campo-info" style={{ width: '500px' }}>
          <label style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: '#226144', fontSize: '1.1rem' }}>DURAÇÃO (HORAS):</label>
          {editavel ? (
            <input
              type="number"
              style={{ height: '48px', borderRadius: '10px', border: '1px solid #d1e7dd', padding: '0 1rem', fontSize: '1.1rem', width: '100%' }}
              value={evento.tempoEstimado}
              onChange={(e) => onChange('tempoEstimado', e.target.value)}
              min="1"
              max="24"
              placeholder="4"
              required
            />
          ) : (
            <span>{evento.tempoEstimado}</span>
          )}
        </div>
        <div className="campo-info" style={{ width: '500px' }}>
          <label style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: '#226144', fontSize: '1.1rem' }}>PREÇO (R$):</label>
          {editavel ? (
            <input
              type="number"
              style={{ height: '48px', borderRadius: '10px', border: '1px solid #d1e7dd', padding: '0 1rem', fontSize: '1.1rem', width: '100%' }}
              value={evento.preco}
              onChange={(e) => onChange('preco', e.target.value)}
              min="0"
              step="0.01"
              placeholder="100.00"
              required
            />
          ) : (
            <span>{evento.preco}</span>
          )}
        </div>
      </div>

      {editavel && (
        <div className="evento-acoes">
          <ButtonSubmitForm onClick={onSalvar} title="Salvar Alterações" />
          <ButtonDangerForm onClick={onDelete} title={'Excluir Evento'} />
        </div>
      )}
    </div>
  );
};

export default EventoInfo;
