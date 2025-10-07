import React, { createContext, useContext, useState } from 'react';

const GuideContext = createContext();

export function GuideProvider({ children }) {
    const [guiaSelecionado, setGuiaSelecionado] = useState(null);

    const escolherGuia = (guia) => {
        setGuiaSelecionado(guia);
        sessionStorage.setItem(
            "guiaSelecionado",
            JSON.stringify({
                id: guia.id,
                nome: guia.nome,
            })
        );

    };

    const resetarEscolhaGuia = () => {
        sessionStorage.removeItem("guiaSelecionado");
        setGuiaSelecionado(null);
    };

    return (
        <GuideContext.Provider value={{ guiaSelecionado, escolherGuia, resetarEscolhaGuia }}>
            {children}
        </GuideContext.Provider>
    );
}

export function useGuide() {
    const context = useContext(GuideContext);
    if (!context) {
        throw new Error('useGuide deve ser usado dentro de um GuideProvider');
    }
    return context;
}
