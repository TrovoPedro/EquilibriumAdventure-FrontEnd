import { createContext, useContext, useState, useEffect } from "react";

const GuiaContext = createContext();

// Hook customizado para usar o contexto
export const useGuia = () => useContext(GuiaContext);

export const GuiaProvider = ({ children }) => {
  const [guia, setGuia] = useState(null);

  // Carregar dados do localStorage quando a app abrir
  useEffect(() => {
    const storedGuia = localStorage.getItem("guia");

    if (storedGuia) setGuia(JSON.parse(storedGuia));
  }, []);

  // Função para escolher guia
  const escolherGuia = (guiaData) => {
    setGuia(guiaData);
    localStorage.setItem("guia", JSON.stringify(guiaData));
  };


  // Função para resetar dados (se necessário)
  const resetarChoiceGuia = () => {
    setGuia(null);
    localStorage.removeItem("guia");
  };

  return (
    <GuiaContext.Provider value={{ guia, escolherGuia, resetarChoiceGuia }}>
      {children}
    </GuiaContext.Provider>
  );
};
