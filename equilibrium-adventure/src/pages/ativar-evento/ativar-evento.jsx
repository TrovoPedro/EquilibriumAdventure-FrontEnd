import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/header-unified";
import "./ativar-evento.css";
import ButtonBack from "../../components/circle-back-button2/circle-back-button2";
import ButtonSubmitForm from "../../components/button-padrao/button-submit-form";
import routeUrls from "../../routes/routeUrls";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ativarEvento } from "../../services/chamadasAPIEvento";
import dayjs from "dayjs";
import swal from "sweetalert2";
import { scrollToTopSmooth } from "../../utils/scrollToTop";
import { formatarPrecoInput, parsePreco } from "../../utils/formatPrice";
import { formatarDuracao, parseDuracao } from "../../utils/formatDuration";

export default function AtivarEvento() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    scrollToTopSmooth();
  }, []);

  useEffect(() => {
    if (id) {
      setFormData(prev => ({ ...prev, evento: id }));
    }
  }, [id]);

  const [formData, setFormData] = useState({
    horaInicio: '',
    horaFim: '',
    duracao: '',
    limiteInscritos: '',
    dataEvento: '',
    categoria: '',
    preco: '',
    evento: id ?? ''
  });

  const [precoFormatado, setPrecoFormatado] = useState('');
  const [duracaoInput, setDuracaoInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'preco') {
      const valorNumerico = parsePreco(value);
      setFormData(prev => ({
        ...prev,
        [name]: valorNumerico || ''
      }));
      setPrecoFormatado(formatarPrecoInput(value));
    } else if (name === 'duracao') {
      // Permite apenas números, vírgula e ponto
      const valorLimpo = value.replace(/[^0-9.,]/g, '');
      setDuracaoInput(valorLimpo);
      const valorNumerico = parseDuracao(valorLimpo);
      setFormData(prev => ({
        ...prev,
        [name]: valorNumerico || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.horaInicio || !formData.horaFim || !formData.duracao || !formData.limiteInscritos || !formData.dataEvento || !formData.categoria || !formData.preco) {
      swal.fire({
        title: "Erro!",
        text: "Por favor, preencha todos os campos obrigatórios.",
        icon: "error",
        confirmButtonText: "OK"
      });
      return;
    }

    if (formData.horaInicio >= formData.horaFim) {
      swal.fire({
        title: "Erro!",
        text: "A hora de início deve ser anterior à hora de fim.",
        icon: "error",
        confirmButtonText: "OK"
      });
      return;
    }

    if (formData.dataEvento < dayjs().format("YYYY-MM-DD")) {
      swal.fire({
        title: "Erro!",
        text: "A data do evento não pode ser anterior à data atual.",
        icon: "error",
        confirmButtonText: "OK"
      });
      return;
    }

    ativarEvento(formData).then(handleResponse);
  };

  const handleResponse = (response) => {
    if (response) {
      swal.fire({
        title: "Sucesso!",
        text: "Evento ativado com sucesso.",
        icon: "success",
        confirmButtonText: "OK"
      }).then(() => {
        navigate(routeUrls.CATALOGO_TRILHAS_ADM);
      });
    } else {
      swal.fire({
        title: "Erro!",
        text: "Ocorreu um erro ao ativar o evento. Tente novamente.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  const handleBack = () => {
    navigate(routeUrls.CATALOGO_TRILHAS_ADM);
  };

  return (
    <div className="ativar-evento-page">
      <div className="ativar-evento-container">
        <Header />
        <div className="div-title">
          <div className="editar-evento-header">
            <ButtonBack onClick={handleBack} />
            <h1 className="h1-title">Ativar Evento</h1>
          </div>
        </div>
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
                <label htmlFor="duracao">Duração (em horas):</label>
                <input 
                  type="text" 
                  id="duracao"
                  name="duracao" 
                  placeholder="Ex: 4 ou 1.5"
                  value={duracaoInput}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row form-row-mixed">
              <div className="form-group form-group-small">
                <label htmlFor="preco">Preço (R$):</label>
                <input 
                  type="text" 
                  id="preco"
                  name="preco" 
                  className="input-largura-reduzida"
                  placeholder="100,00"
                  value={precoFormatado}
                  onChange={handleChange}
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
              <div className="form-group form-group-categoria">
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
              <ButtonSubmitForm title="Ativar Evento" type="submit" />
            </div>
        </form>
      </div>
    </div>
  );
}
