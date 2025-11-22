/**
 * Formata a duração em formato legível com "h" e "min"
 * @param {string|number} valor - Duração em horas (pode ser decimal)
 * @returns {string} Duração formatada (ex: "4h", "1h 30min", "45min")
 */
export const formatarDuracao = (valor) => {
  if (!valor) return '';
  const numero = parseFloat(valor);
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

/**
 * Converte string formatada para número decimal
 * @param {string} valor - Valor formatado
 * @returns {number|null} Valor numérico em horas ou null
 */
export const parseDuracao = (valor) => {
  if (!valor) return null;
  const numero = valor.replace(/[^0-9.,]/g, '').replace(',', '.');
  return numero ? parseFloat(numero) : null;
};
