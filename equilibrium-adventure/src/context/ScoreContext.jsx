import { createContext, useContext, useState, useEffect } from "react";

const ScoreContext = createContext();

// Hook customizado
export const useScore = () => useContext(ScoreContext);

export const ScoreProvider = ({ children }) => {
  const [nivel, setNivel] = useState();
  const [pontuacaoTotal, setPontuacaoTotal] = useState();

  // Carregar dados do sessionStorage ao iniciar
  useEffect(() => {
    const storedNivel = sessionStorage.getItem("nivel");
    const storedPontuacao = sessionStorage.getItem("pontuacaoTotal");
    if (storedNivel) setNivel(storedNivel);
    if (storedPontuacao) setPontuacaoTotal(Number(storedPontuacao));
  }, []);

  // Salvar dados
  const salvarPontuacao = (novoNivel, novaPontuacao) => {
    setNivel(novoNivel);
    setPontuacaoTotal(novaPontuacao);
    sessionStorage.setItem("nivel", novoNivel);
    sessionStorage.setItem("pontuacaoTotal", novaPontuacao);
  };

  // Resetar dados
  const resetarPontuacao = () => {
    setNivel(undefined);
    setPontuacaoTotal(undefined);
    sessionStorage.removeItem("nivel");
    sessionStorage.removeItem("pontuacaoTotal");
  };

  return (
    <ScoreContext.Provider value={{ nivel, pontuacaoTotal, salvarPontuacao, resetarPontuacao }}>
      {children}
    </ScoreContext.Provider>
  );
};
