export function maskCep(value) {
    let v = value.replace(/\D/g, "").slice(0, 8);
    if (v.length > 5) v = v.replace(/^(\d{5})(\d{1,3})/, "$1-$2");
    return v;
}

export function maskDistancia(value) {
    let v = value.replace(/[^0-9.,]/g, "");
    if (v.length === 0) return "";
    v = v.replace(/\s*km$/i, "");
    return v + "km";
}