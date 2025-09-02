import { createContext, useContext, useState, useEffect } from "react";

const ScoreContext = createContext();

// Hook customizado para usar o contexto
export const useScore = () => useContext(ScoreContext);

export const ScoreProvider = ({ children }) => {
  const [pontuacao, setPontuacao] = useState(0);

  // Carregar dados do localStorage quando a app abrir
  useEffect(() => {
    const storedPontuacao = localStorage.getItem("pontuacao");

    if (storedPontuacao) setPontuacao(Number(storedPontuacao));
  }, []);

  // Função para salvar pontuação
  const salvarPontuacao = (valor) => {
    setPontuacao(valor);
    localStorage.setItem("pontuacao", valor.toString());
  };

  // Função para resetar dados (se necessário)
  const resetarPontuacao = () => {
    setPontuacao(0);
    localStorage.removeItem("pontuacao");
  };

  return (
    <ScoreContext.Provider value={{  pontuacao, salvarPontuacao, resetarPontuacao }}>
      {children}
    </ScoreContext.Provider>
  );
};
