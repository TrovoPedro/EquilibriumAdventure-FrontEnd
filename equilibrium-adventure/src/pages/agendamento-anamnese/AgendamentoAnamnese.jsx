import React, { useState, useEffect } from 'react';
import FormCard from '../../components/form-card/FormCard';
import CustomInput from '../../components/custom-input/CustomInput';
import CustomButton from '../../components/custom-button/CustomButton';
import { useGuide } from '../../context/GuideContext';
import { useAuth } from '../../context/AuthContext';
import { listarDatasDisponiveis, agendarAnamnese } from '../../services/apiAnamnese';
import { showSuccess, showError, showWarning } from '../../utils/swalHelper';
import { useNavigate } from 'react-router-dom';
import routeUrls from '../../routes/routeUrls';
import './AgendamentoAnamnese.css';

const AgendamentoAnamnese = () => {
  const { guia } = useGuide();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDateId, setSelectedDateId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDates = async () => {
      console.log('Estado atual do guia:', guia);
      
      // Tenta recuperar o guia do sessionStorage se não estiver no contexto
      let guiaAtual = guia;
      if (!guiaAtual || !guiaAtual.id) {
        const guiaStorage = sessionStorage.getItem('guiaSelecionado');
        if (guiaStorage) {
          guiaAtual = JSON.parse(guiaStorage);
          console.log('Guia recuperado do storage:', guiaAtual);
        }
      }

      if (!guiaAtual || !guiaAtual.id) {
        console.log('Nenhum guia encontrado, redirecionando...');
        // Garante que o usuário realmente precisa fazer anamnese
        const encaminharParaAnamnese = JSON.parse(sessionStorage.getItem('encaminharParaAnamnese') || 'false');
        if (!encaminharParaAnamnese) {
          navigate(routeUrls.CATALOGO_TRILHA);
        } else {
          navigate(routeUrls.ESCOLHER_GUIA);
        }
        return;
      }

      try {
        setLoading(true);
        console.log('Buscando datas para o guia:', guiaAtual.id);
        const datas = await listarDatasDisponiveis(guiaAtual.id);
        console.log('Datas recebidas:', datas);
        setAvailableDates(Array.isArray(datas) ? datas : []);
      } catch (err) {
        console.error('Erro ao carregar datas disponíveis:', err);
        showError('Erro ao carregar datas disponíveis. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchDates();
  }, [guia, navigate]);

  const formatarData = (dataISO) => {
    if (!dataISO) return '';
    
    const data = new Date(dataISO);
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    const hora = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const diaSemana = diasSemana[data.getDay()];
    
    return `${diaSemana}, ${dia}/${mes}/${ano} às ${hora}:${minutos}`;
  };

  const buildLabelForItem = (item) => {
    return formatarData(item.dataDisponivel);
  };

  const getFkDataFromItem = (item) => {
    return item.idAgenda;
  };

  const handleSubmit = async () => {
    if (!selectedDateId) {
      await showWarning('Por favor, selecione uma data disponível antes de agendar.', 'Atenção', 'OK');
      return;
    }

    if (!usuario || !usuario.id) {
      await showWarning('Você precisa estar logado para agendar. Faça login e tente novamente.', 'Atenção', 'OK');
      navigate(routeUrls.LOGIN);
      return;
    }

    try {
      const payload = {
        fkData: selectedDateId,
        fkAventureiro: usuario.id,
      };

      await agendarAnamnese(payload);    
      await showSuccess('Agendamento realizado com sucesso!');
      navigate(routeUrls.AGENDA_AVENTUREIRO);
    } catch (err) {
      console.error('Erro ao agendar anamnese:', err);
      const message = err.response?.data?.message || err.message || 'Erro ao agendar. Tente novamente.';
      showError(message);
    }
  };

  return (
    <FormCard titulo="Agendamento de conversa com o guia">
      {loading ? (
        <p>Carregando datas disponíveis...</p>
      ) : (
        <>
          {availableDates.length === 0 ? (
            <p>Nenhuma data disponível encontrada para este guia.</p>
          ) : (
            <div style={{ marginBottom: 20 }}>
              <select
                value={selectedDateId || ''}
                onChange={(e) => setSelectedDateId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  backgroundColor: '#fff',
                  color: '#333',
                  fontSize: '16px',
                  marginTop: '8px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="">Selecione uma data disponível</option>
                {availableDates.map((item, idx) => {
                  const fkData = getFkDataFromItem(item);
                  const label = buildLabelForItem(item);
                  return (
                    <option key={idx} value={fkData}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          <div style={{ marginTop: 18 }}>
            <CustomButton onClick={handleSubmit}>Agendar conversa</CustomButton>
          </div>
        </>
      )}
    </FormCard>
  );
};

export default AgendamentoAnamnese;