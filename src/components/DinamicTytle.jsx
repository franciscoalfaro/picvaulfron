import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const DynamicTitle = () => {
  const location = useLocation();
  const { auth } = useAuth();
  const { nameUser } = useParams();

  useEffect(() => {
    let title;

    if (location.pathname === "/login") {
      title = "Login";
    } else if (location.pathname === "/auth/registro") {
      title = "Registro";
    } else if (location.pathname === "/registro") {
      title = "Registro";
    } else if (location.pathname.startsWith("/auth/perfil") || location.pathname.startsWith("/perfil")) {
      title = nameUser ? `Perfil de ${nameUser}` : auth?.nameUser ? `Perfil de ${auth.nameUser}` : "Perfil";
    } else {
      title = "Repositorio Imágenes";
    }

    document.title = title;
  }, [location, auth?.nameUser, nameUser]);

  return null; // Este componente no necesita renderizar nada
};

export default DynamicTitle;