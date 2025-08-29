export function maskTelefone(value) {
    let v = value.replace(/\D/g, ""); // Remove tudo que não for número
    if (v.length > 10) {
        // Formato com DDD + 9 dígitos (celular)
        v = v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (v.length > 5) {
        // Formato com DDD + 8 dígitos
        v = v.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else if (v.length > 2) {
        // Formato parcial com DDD
        v = v.replace(/(\d{2})(\d+)/, "($1) $2");
    }
    return v;
}
