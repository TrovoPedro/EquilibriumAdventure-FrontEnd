import React, { useState } from 'react';
import FormCard from '../../components/form-card/FormCard';
import CustomInput from '../../components/custom-input/CustomInput';
import CustomButton from '../../components/custom-button/CustomButton';

const AgendamentoAnamnese = () => {
  const [data, setData] = useState('');

  const handleSubmit = () => {
    // Implementar lógica de agendamento
    console.log('Agendando para:', data);
  };

  return (
    <FormCard titulo="Agendamento de conversa com o guia">
      <CustomInput
        type="datetime-local"
        value={data}
        onChange={(e) => setData(e.target.value)}
        placeholder="Escolha uma data para a conversa"
      />
      <CustomButton onClick={handleSubmit}>
        Agendar conversa
      </CustomButton>
    </FormCard>
  );
};

export default AgendamentoAnamnese;