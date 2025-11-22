// Função para formatar preço em Real brasileiro
export const formatarPreco = (preco) => {
    if (!preco && preco !== 0) return 'Gratuito';
    const numero = typeof preco === 'string' ? parseFloat(preco) : preco;
    return numero.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
};

export default formatarPreco;