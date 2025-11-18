import { createContext, useContext, useState, useEffect } from "react";

const ScoreContext = createContext();

// Hook customizado
export const useScore = () => useContext(ScoreContext);

export const ScoreProvider = ({ children }) => {
  const [nivel, setNivel] = useState();
  const [pontuacaoTotal, setPontuacaoTotal] = useState();

  useEffect(() => {
    const carregarDados = () => {
      const storedNivel = sessionStorage.getItem("nivel");
      const storedPontuacao = sessionStorage.getItem("pontuacaoTotal");
      
      if (storedNivel) {
        setNivel(storedNivel);
      } else {
        setNivel(undefined);
      }
      
      if (storedPontuacao) {
        setPontuacaoTotal(Number(storedPontuacao));
      } else {
        setPontuacaoTotal(undefined);
      }
    };

    carregarDados();

    const handleUserChange = () => {
      setNivel(undefined);
      setPontuacaoTotal(undefined);
      carregarDados();
    };

    window.addEventListener('userChanged', handleUserChange);
    return () => window.removeEventListener('userChanged', handleUserChange);
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
