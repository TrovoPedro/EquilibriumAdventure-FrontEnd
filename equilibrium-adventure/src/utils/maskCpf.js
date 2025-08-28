export const maskCPF = (value) => {
    let v = value.replace(/\D/g, "");
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
    else if (v.length > 3) v = v.replace(/(\d{3})(\d+)/, "$1.$2");
    return v;
};