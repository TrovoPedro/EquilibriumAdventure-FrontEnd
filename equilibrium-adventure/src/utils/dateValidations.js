export const formatarDataParaInput = (dataIso) => {
    if (!dataIso) return "";
    try {
        const data = new Date(dataIso);
        if (isNaN(data.getTime())) return "";
        
        const year = data.getFullYear();
        const month = String(data.getMonth() + 1).padStart(2, '0');
        const day = String(data.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error("Erro ao formatar data para input:", error);
        return "";
    }
};

export const formatarDataParaExibicao = (dataIso) => {
    if (!dataIso) return "";
    try {
        const data = new Date(dataIso);
        if (isNaN(data.getTime())) return "";
        
        const day = String(data.getDate()).padStart(2, '0');
        const month = String(data.getMonth() + 1).padStart(2, '0');
        const year = data.getFullYear();
        return `${day}/${month}/${year}`;
    } catch (error) {
        console.error("Erro ao formatar data para exibição:", error);
        return "";
    }
};

export const formatarData = (dataIso) => {
    if (!dataIso) return "Não informado";
    try {
        const data = new Date(dataIso);
        if (isNaN(data.getTime())) return "Data inválida";
        
        return data.toLocaleDateString("pt-BR");
    } catch (error) {
        console.error("Erro ao formatar data:", error);
        return "Data inválida";
    }
};

export const formatarHora = (dataIso) => {
    if (!dataIso) return "Não informado";
    try {
        const data = new Date(dataIso);
        if (isNaN(data.getTime())) return "Hora inválida";
        
        return data.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
        console.error("Erro ao formatar hora:", error);
        return "Hora inválida";
    }
};

export const validarData = (dataString) => {
    if (!dataString) return false;
    try {
        const data = new Date(dataString);
        return !isNaN(data.getTime());
    } catch (error) {
        return false;
    }
};

export const obterDataAtualFormatada = () => {
    return new Date().toLocaleDateString("pt-BR");
};

export const obterHoraAtualFormatada = () => {
    return new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
};