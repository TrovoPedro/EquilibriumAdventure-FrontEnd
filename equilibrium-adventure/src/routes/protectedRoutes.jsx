import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { usuario, loading } = useAuth();
  
  // Aguarda o carregamento do contexto antes de redirecionar
  if (loading) {
    return null;
  }
  
  // Se não estiver logado, redireciona para login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Se houver restrição de roles e o usuário não tiver permissão
  if (allowedRoles && !allowedRoles.includes(usuario.tipoUsuario)) {
    // Redireciona para a página apropriada baseado no tipo de usuário
    if (usuario.tipoUsuario === "AVENTUREIRO") {
      return <Navigate to="/catalogo-trilhas" replace />;
    } else if (usuario.tipoUsuario === "GUIA") {
      return <Navigate to="/catalogo-trilhas-adm" replace />;
    } else if (usuario.tipoUsuario === "ADMINISTRADOR") {
      return <Navigate to="/catalogo-trilhas-adm" replace />;
    }
  }

  return children;
}
