import { createContext, useContext, useState, useEffect } from "react";

const ScoreContext = createContext();

// Hook customizado
export const useScore = () => useContext(ScoreContext);

export const ScoreProvider = ({ children }) => {
  const [pontuacao, setPontuacao] = useState(0);
  const [nivel, setNivel] = useState(null);

  // Carregar dados do sessionStorage ao iniciar
  useEffect(() => {
    const storedPontuacao = sessionStorage.getItem("pontuacao");
    const storedNivel = sessionStorage.getItem("nivel");

    if (storedPontuacao) setPontuacao(Number(storedPontuacao));
    if (storedNivel) setNivel(storedNivel);
  }, []);

  // Salvar dados
  const salvarPontuacao = (valor, nivelamento) => {
    setPontuacao(valor);
    setNivel(nivelamento);

    sessionStorage.setItem("pontuacao", valor.toString());
    sessionStorage.setItem("nivel", nivelamento);
  };

  // Resetar dados
  const resetarPontuacao = () => {
    setPontuacao(0);
    setNivel(null);
    sessionStorage.removeItem("pontuacao");
    sessionStorage.removeItem("nivel");
  };

  return (
    <ScoreContext.Provider value={{ pontuacao, nivel, salvarPontuacao, resetarPontuacao }}>
      {children}
    </ScoreContext.Provider>
  );
};
