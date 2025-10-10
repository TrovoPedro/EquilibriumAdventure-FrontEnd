export const validateUserData = ({ username, senha }) => {
  const errors = {};

  if (!username || username.trim().split(" ").length < 2) {
    errors.username = "Informe nome e sobrenome";
  }

  if (!senha || senha.length < 8) {
    errors.senha = "A senha precisa ter no mínimo 8 caracteres";
  }

  return errors;
};

export const validateFullName = (name) => {
    if (!name || name.trim().split(" ").length < 2) {
        return { isValid: false, error: "Informe nome e sobrenome" };
    }
    return { isValid: true, error: "" };
};

export const validateCPF = (cpf) => {
    const digits = cpf.replace(/\D/g, '');
    
    if (digits.length !== 11) {
        return { isValid: false, error: "CPF deve conter 11 dígitos" };
    }
    
    if (/^(\d)\1{10}$/.test(digits)) {
        return { isValid: false, error: "CPF inválido" };
    }
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(digits.charAt(i)) * (10 - i);
    }
    let checkDigit = 11 - (sum % 11);
    if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
    if (checkDigit !== parseInt(digits.charAt(9))) {
        return { isValid: false, error: "CPF inválido" };
    }
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(digits.charAt(i)) * (11 - i);
    }
    checkDigit = 11 - (sum % 11);
    if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
    if (checkDigit !== parseInt(digits.charAt(10))) {
        return { isValid: false, error: "CPF inválido" };
    }
    
    return { isValid: true, error: "" };
};

export const validateRG = (rg) => {
    const formatted = rg.trim();
    
    if (!formatted) {
        return { isValid: true, error: "" };
    }
    
    if (formatted.length < 10 || formatted.length > 12) {
        return { isValid: false, error: "RG deve conter entre 10 e 12 caracteres" };
    }
    
    return { isValid: true, error: "" };
};

export const validateCEP = (cep) => {
    const digits = cep.replace(/\D/g, '');
    
    if (digits.length === 0) {
        return { isValid: true, error: "" };
    }
    
    if (digits.length !== 8) {
        return { isValid: false, error: "CEP deve conter 8 dígitos" };
    }
    
    return { isValid: true, error: "" };
};

export const validateTelefone = (telefone) => {
    if (!telefone) {
        return { isValid: true, error: "" };
    }
    
    const digits = telefone.replace(/\D/g, '');
    
    if (digits.length < 10 || digits.length > 11) {
        return { isValid: false, error: "Telefone deve conter 10 ou 11 dígitos" };
    }
    
    return { isValid: true, error: "" };
};

export const validateEmergencyContact = (contact) => {
    if (!contact) {
        return { isValid: true, error: "" };
    }
    
    const digits = contact.replace(/\D/g, '');
    
    if (digits.length < 10 || digits.length > 11) {
        return { isValid: false, error: "Contato de emergência deve conter 10 ou 11 dígitos" };
    }
    
    return { isValid: true, error: "" };
};

export const validateEmail = (email) => {
    if (!email) {
        return { isValid: false, error: "Email é obrigatório" };
    }
    
    if (!email.includes('@')) {
        return { isValid: false, error: "Email deve conter @" };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        return { isValid: false, error: "Email deve ter formato válido" };
    }
    
    
    return { isValid: true, error: "" };
};
    