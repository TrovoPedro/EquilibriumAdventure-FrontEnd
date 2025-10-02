import React, { useState } from 'react';
import FormCard from '../../components/form-card/FormCard';
import CustomInput from '../../components/custom-input/CustomInput';
import CustomButton from '../../components/custom-button/CustomButton';

const ConviteAventureiro = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    // Implementar lógica de envio do convite
    console.log('Enviando convite para:', email);
  };

  return (
    <FormCard titulo="Digite o e-mail do convidado:">
      <CustomInput
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Digite o e-mail"
      />
      <CustomButton onClick={handleSubmit}>
        Enviar convite
      </CustomButton>
    </FormCard>
  );
};

export default ConviteAventureiro;