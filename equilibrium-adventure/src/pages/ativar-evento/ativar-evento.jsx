import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import "./ativar-evento.css";
import leftArrow from "../../assets/left-arrow-green.png";
import ButtonBack from "../../components/circle-back-button2/circle-back-button2";
import routeUrls from "../../routes/routeUrls";

export default function AtivarEvento() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    horaInicio: '',
    horaFim: '',
    duracao: '',
    preco: '',
    limiteInscritos: '',
    dataEvento: '',
    categoria: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para enviar os dados
    console.log('Dados do formulário:', formData);
  };

  const handleBack = () => {
    navigate(routeUrls.CATALOGO_TRILHAS_ADM);
  };

  return (
    <>
      <Header />
      <div className="ativar-evento-container">
        <div className="ativar-evento-header">
          <ButtonBack onClick={handleBack} />
          <h1 className="ativar-evento-title">Ativar Evento</h1>
        </div>
        <div className="ativar-evento-form-wrapper">
          <form className="ativar-evento-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="horaInicio">Hora de Início:</label>
                <input 
                  type="time" 
                  id="horaInicio"
                  name="horaInicio" 
                  value={formData.horaInicio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="horaFim">Hora de Fim:</label>
                <input 
                  type="time" 
                  id="horaFim"
                  name="horaFim" 
                  value={formData.horaFim}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="duracao">Duração (horas):</label>
                <input 
                  type="number" 
                  id="duracao"
                  name="duracao" 
                  placeholder="4"
                  value={formData.duracao}
                  onChange={handleChange}
                  min="1"
                  max="24"
                  required
                />
              </div>
            </div>
            <div className="form-row form-row-mixed">
              <div className="form-group form-group-small">
                <label htmlFor="preco">Preço (R$):</label>
                <input 
                  type="number" 
                  id="preco"
                  name="preco" 
                  className="input-largura-reduzida"
                  placeholder="100.00"
                  value={formData.preco}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group form-group-small">
                <label htmlFor="limiteInscritos">Limite de Inscritos:</label>
                <input 
                  type="number" 
                  id="limiteInscritos"
                  name="limiteInscritos" 
                  className="input-largura-reduzida"
                  placeholder="30"
                  value={formData.limiteInscritos}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="dataEvento">Data do Evento:</label>
                <input 
                  type="date" 
                  id="dataEvento"
                  name="dataEvento"
                  value={formData.dataEvento}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group form-group-full">
                <label htmlFor="categoria">Categoria:</label>
                <select 
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
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
              </div>
            </div>
            <div className="form-row form-row-end">
              <button className="ativar-evento-btn" type="submit">Ativar Evento</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
