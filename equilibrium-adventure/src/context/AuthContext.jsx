import { createContext, useContext, useState, useEffect } from "react";
import { buscarAnamnesePorAventureiro } from "../services/apiAnamnese";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// --------------------------
// Funções de tratamento de data
// --------------------------
const parseDataAnamnese = (dataString) => {
  if (!dataString) return null;

  // Remove tudo após o T (pois vem "2025-11-15T0")
  const [dataPura] = dataString.split("T");

  // Garante formato ISO válido
  return new Date(`${dataPura}T00:00:00`);
};

const isAnamneseValida = (dataString) => {
  const dataAnamnese = parseDataAnamnese(dataString);
  if (!dataAnamnese) return false;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  return dataAnamnese >= hoje; // válida se for hoje ou futura
};

// --------------------------

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [anamnese, setAnamnese] = useState([]);

  // Carrega usuário salvo no sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("usuario");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUsuario(parsedUser);
    }
  }, []);

  // Busca e valida anamnese
  useEffect(() => {
    const carregarAnamnese = async () => {
      if (usuario?.id) {
        try {
          const dados = await buscarAnamnesePorAventureiro(usuario.id);

          // filtra apenas anamnese com data válida
          const anamneseValida = dados?.filter(a =>
            isAnamneseValida(a.dataDisponivel)
          );

          if (anamneseValida.length > 0) {
            setAnamnese(anamneseValida);
            sessionStorage.setItem("anamnese", JSON.stringify(anamneseValida));
          } else {
            setAnamnese([]);
            sessionStorage.removeItem("anamnese");
          }

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

  const recarregarAnamnese = async () => {
    if (usuario?.id) {
      try {
        const dados = await buscarAnamnesePorAventureiro(usuario.id);
        const anamneseValida = dados?.filter(a => isAnamneseValida(a.dataDisponivel));
        
        if (anamneseValida.length > 0) {
          setAnamnese(anamneseValida);
          sessionStorage.setItem("anamnese", JSON.stringify(anamneseValida));
        } else {
          setAnamnese([]);
          sessionStorage.removeItem("anamnese");
        }
      } catch (error) {
        console.error("Erro ao recarregar anamnese:", error);
      }
    }
  };

  const logout = () => {
    setUsuario(null);
    setAnamnese([]);
    sessionStorage.clear();
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ usuario, anamnese, login, logout, recarregarAnamnese }}>
      {children}
    </AuthContext.Provider>
  );
};