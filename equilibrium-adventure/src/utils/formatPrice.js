// Função para formatar preço em Real brasileiro (para exibição)
export const formatarPreco = (preco) => {
    if (!preco && preco !== 0) return 'Gratuito';
    const numero = typeof preco === 'string' ? parseFloat(preco) : preco;
    return numero.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
};

/**
 * Formata um valor monetário para input (padrão brasileiro sem símbolo)
 * @param {string} valor - Valor a ser formatado
 * @returns {string} Valor formatado no padrão brasileiro (0,00)
 */
export const formatarPrecoInput = (valor) => {
  if (!valor) return '';
  // Remove tudo que não é número
  const numero = valor.replace(/\D/g, '');
  if (!numero) return '';
  // Converte para número e divide por 100 para ter os centavos
  const valorNumerico = parseFloat(numero) / 100;
  // Formata em padrão brasileiro sem símbolo
  return valorNumerico.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
};

/**
 * Converte string formatada para número
 * @param {string} valor - Valor formatado
 * @returns {number|null} Valor numérico ou null
 */
export const parsePreco = (valor) => {
  if (!valor) return null;
  const numero = valor.replace(/\D/g, '');
  return numero ? parseFloat(numero) / 100 : null;
};

export default formatarPreco;