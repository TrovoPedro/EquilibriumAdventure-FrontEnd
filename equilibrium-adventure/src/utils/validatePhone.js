export const validatePhone = (phone) => {
    // Remove tudo que não é número
    const numbers = phone.replace(/\D/g, '');
    
    // Verifica se passou do limite (11 dígitos)
    if (numbers.length > 11) {
        return {
            isValid: false,
            error: "Número de telefone não pode ter mais que 11 dígitos",
            value: phone.slice(0, 15) // Mantém apenas os primeiros 15 caracteres (com máscara)
        };
    }

    return {
        isValid: true,
        error: "",
        value: phone
    };
};