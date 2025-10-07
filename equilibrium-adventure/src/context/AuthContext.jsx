import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Hook customizado para usar o contexto mais fácil
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  // Carregar usuário do sessionStorage quando a app abrir
  useEffect(() => {
    const storedUser = sessionStorage.getItem("usuario");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  // Função de login -> salva no estado + sessionStorage
  const login = (userData) => {
    setUsuario(userData);
    sessionStorage.setItem("usuario", JSON.stringify(userData));
  };

  // Função de logout -> limpa estado + sessionStorage
  const logout = () => {
    setUsuario(null);
    sessionStorage.removeItem("usuario");
    // Limpa todos os dados da sessão
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
