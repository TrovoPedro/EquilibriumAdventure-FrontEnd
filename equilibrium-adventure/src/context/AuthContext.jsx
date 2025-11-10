import { createContext, useContext, useState, useEffect } from "react";
import { buscarAnamnesePorAventureiro } from "../services/apiAnamnese";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [anamnese, setAnamnese] = useState([]);

  // Carrega usuário salvo
  useEffect(() => {
    const storedUser = sessionStorage.getItem("usuario");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUsuario(parsedUser);
    }
  }, []);

  // Carrega anamnese assim que o usuário for definido
  useEffect(() => {
    const carregarAnamnese = async () => {
      if (usuario?.id) {
        const dados = await buscarAnamnesePorAventureiro(usuario.id);
        setAnamnese(dados);
        sessionStorage.setItem("anamnese", JSON.stringify(dados));
      }
    };
    carregarAnamnese();
  }, [usuario]);

  const login = (userData) => {
    setUsuario(userData);
    sessionStorage.setItem("usuario", JSON.stringify(userData));
  };

  const logout = () => {
    setUsuario(null);
    setAnamnese([]);
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ usuario, anamnese, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};