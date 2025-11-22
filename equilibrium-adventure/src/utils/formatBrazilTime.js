// Função para formatar hora sem segundos (HH:MM)
export const formatarHora = (hora) => {
  if (!hora) return '';
  const horaStr = String(hora);
  return horaStr.substring(0, 5); // Pega apenas HH:MM
};

// Função para formatar duração em horas (igual formato de hora)
export const formatarDuracao = (tempo) => {
  if (!tempo) return '';
  const horas = parseFloat(tempo);
  return `${horas}h`;
};

export default formatarHora;