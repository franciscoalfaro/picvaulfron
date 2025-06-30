import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Global } from "../util/Global";
import Cookies from "js-cookie";

export const Logout = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        // Realiza la solicitud de cierre de sesión al backend
        await axios.post(
          `${Global.URL}logout`,
          {},
          {
            withCredentials: true, // Si tu backend usa cookies
          }
        );

        // Limpiar el almacenamiento local y el estado de autenticación
        localStorage.removeItem("user");
        Cookies.remove("token"); // Asegúrate de eliminar el token de las cookies
        setAuth({}); // Restablecer el estado de autenticación

        // Redirigir a la página de inicio
        navigate("/");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        // Aquí podrías mostrar un mensaje de error al usuario si lo deseas
      }
    };

    logout();
  }, [setAuth, navigate]); // Agrega las dependencias necesarias

  return <div>Cerrando sesión...</div>;
};

export default Logout;
