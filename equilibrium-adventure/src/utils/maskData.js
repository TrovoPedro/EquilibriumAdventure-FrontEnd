export const maskData = (value) => {
    let v = value.replace(/\D/g, "");
    if (v.length > 4) v = v.replace(/(\d{2})(\d{2})(\d+)/, "$1/$2/$3");
    else if (v.length > 2) v = v.replace(/(\d{2})(\d+)/, "$1/$2");
    return v;
};