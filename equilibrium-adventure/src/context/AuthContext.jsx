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

  useEffect(() => {
    const carregarAnamnese = async () => {
      if (usuario?.id) {
        try {
          const dados = await buscarAnamnesePorAventureiro(usuario.id);
          setAnamnese(dados);
          sessionStorage.setItem("anamnese", JSON.stringify(dados));
        } catch (error) {
          console.error("Erro ao carregar anamnese:", error);
          setAnamnese([]);
        }
      } else {
        setAnamnese([]);
      }
    };
    carregarAnamnese();
  }, [usuario?.id]);

  const login = (userData) => {
    setAnamnese([]);
    setUsuario(userData);
    sessionStorage.setItem("usuario", JSON.stringify(userData));
    window.dispatchEvent(new Event('userChanged'));
  };

  const logout = () => {
    setUsuario(null);
    setAnamnese([]);
    sessionStorage.clear();
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ usuario, anamnese, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};