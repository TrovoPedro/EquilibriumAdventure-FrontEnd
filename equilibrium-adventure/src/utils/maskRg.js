export const maskRG = (value) => {
    // Remove tudo exceto números e letras
    let v = value.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
    
    if (v.length > 8) {
        // Separa os números e o dígito verificador (que pode ser letra)
        const numbers = v.slice(0, 8);
        const digit = v.slice(8, 9);
        v = numbers.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2.$3") + "-" + digit;
    } else if (v.length > 6) {
        v = v.replace(/(\d{2})(\d{3})(\d+)/, "$1.$2.$3");
    } else if (v.length > 2) {
        v = v.replace(/(\d{2})(\d+)/, "$1.$2");
    }
    
    return v;
};