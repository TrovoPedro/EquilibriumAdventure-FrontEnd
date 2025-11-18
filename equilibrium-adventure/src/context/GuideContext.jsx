import React, { createContext, useContext, useState, useEffect } from 'react';

const GuideContext = createContext();

export function GuideProvider({ children }) {
    const [guiaSelecionado, setGuiaSelecionado] = useState(null);

    useEffect(() => {
        const handleUserChange = () => {
            setGuiaSelecionado(null);
            sessionStorage.removeItem("guiaSelecionado");
        };

        window.addEventListener('userChanged', handleUserChange);
        return () => window.removeEventListener('userChanged', handleUserChange);
    }, []);

    const escolherGuia = async (guia) => {
        try {
            setGuiaSelecionado(guia);
            sessionStorage.setItem(
                "guiaSelecionado",
                JSON.stringify({
                    id: guia.id,
                    nome: guia.nome,
                })
            );
            // Aguarda o próximo ciclo de renderização
            await new Promise(resolve => setTimeout(resolve, 0));
        } catch (error) {
            console.error('Erro ao escolher guia:', error);
        }
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
