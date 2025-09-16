import { createContext, useContext, useState, useEffect } from "react";

const ScoreContext = createContext();

// Hook customizado
export const useScore = () => useContext(ScoreContext);

export const ScoreProvider = ({ children }) => {
  const [pontuacao, setPontuacao] = useState(0);
  const [nivel, setNivel] = useState(null);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const storedPontuacao = localStorage.getItem("pontuacao");
    const storedNivel = localStorage.getItem("nivel");

    if (storedPontuacao) setPontuacao(Number(storedPontuacao));
    if (storedNivel) setNivel(storedNivel);
  }, []);

  // Salvar dados
  const salvarPontuacao = (valor, nivelamento) => {
    setPontuacao(valor);
    setNivel(nivelamento);

    localStorage.setItem("pontuacao", valor.toString());
    localStorage.setItem("nivel", nivelamento);
  };

  // Resetar dados
  const resetarPontuacao = () => {
    setPontuacao(0);
    setNivel(null);
    localStorage.removeItem("pontuacao");
    localStorage.removeItem("nivel");
  };

  return (
    <ScoreContext.Provider value={{ pontuacao, nivel, salvarPontuacao, resetarPontuacao }}>
      {children}
    </ScoreContext.Provider>
  );
};
