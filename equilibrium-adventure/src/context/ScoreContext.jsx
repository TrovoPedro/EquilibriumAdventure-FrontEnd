import { createContext, useContext, useState, useEffect } from "react";

const ScoreContext = createContext();

// Hook customizado
export const useScore = () => useContext(ScoreContext);

export const ScoreProvider = ({ children }) => {
  const [nivel, setNivel] = useState(null);

  // Carregar dados do sessionStorage ao iniciar
  useEffect(() => {
    const storedNivel = sessionStorage.getItem("nivel");

    if (storedNivel) setNivel(storedNivel);
  }, []);

  // Salvar dados
  const salvarPontuacao = (nivelamento) => {
    setNivel(nivelamento);

    sessionStorage.setItem("nivel", nivelamento);
  };

  // Resetar dados
  const resetarPontuacao = () => {
    setNivel(null);
    sessionStorage.removeItem("nivel");
  };

  return (
    <ScoreContext.Provider value={{ nivel, salvarPontuacao, resetarPontuacao }}>
      {children}
    </ScoreContext.Provider>
  );
};
