export const convertDateToBrazilian = (dateISO) => {
    if (!dateISO) return "";
    
    try {
        if (dateISO.includes("/")) return dateISO;
        
        const data = new Date(dateISO);
        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const ano = data.getFullYear();
        
        return `${dia}/${mes}/${ano}`;
    } catch (error) {
        console.error("Erro ao formatar data:", error);
        return "";
    }
};

export const convertDateToISO = (dateBrazilian) => {
    if (!dateBrazilian) return "";
    
    try {
        const [dia, mes, ano] = dateBrazilian.split("/");
        const dataFormatada = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        
        const dataObj = new Date(dataFormatada);
        if (isNaN(dataObj.getTime())) {
            throw new Error("Data inválida");
        }
        
        return dataFormatada;
    } catch (error) {
        console.error("Erro ao converter data:", error);
        throw new Error("Data de nascimento inválida. Use o formato DD/MM/YYYY");
    }
};

export const validateDateFormat = (date) => {
    if (!date) return { isValid: true, error: "" };
    
    try {
        convertDateToISO(date);
        return { isValid: true, error: "" };
    } catch (error) {
        return { isValid: false, error: error.message };
    }
};