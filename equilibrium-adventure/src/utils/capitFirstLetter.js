 // Função para capitalizar primeira letra
export const capitalizarPrimeiraLetra = (texto) => {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };

export default capitalizarPrimeiraLetra;