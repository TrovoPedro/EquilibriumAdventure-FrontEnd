// Função para formatar hora sem segundos (HH:MM)
export const formatarHora = (hora) => {
  if (!hora) return '';
  const horaStr = String(hora);
  return horaStr.substring(0, 5); // Pega apenas HH:MM
};

// Função para formatar duração em horas com conversão para h e min
export const formatarDuracao = (tempo) => {
  if (!tempo) return '';
  const numero = parseFloat(tempo);
  if (isNaN(numero) || numero <= 0) return '';
  
  // Se for número decimal (ex: 1.5), converte para horas e minutos
  if (numero % 1 !== 0) {
    const horas = Math.floor(numero);
    const minutos = Math.round((numero % 1) * 60);
    if (horas > 0 && minutos > 0) {
      return `${horas}h ${minutos}min`;
    } else if (horas > 0) {
      return `${horas}h`;
    } else {
      return `${minutos}min`;
    }
  }
  
  // Se for número inteiro, retorna apenas com "h"
  return `${numero}h`;
};

export default formatarHora;