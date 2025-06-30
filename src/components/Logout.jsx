import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Global } from "../util/Global";

export const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Realiza la solicitud de cierre de sesión al backend
        await axios.post(
          `${Global.URL}logout`,
          {},
          {
            withCredentials: true,
          }
        );
      } catch (error) {
        console.error("Error al cerrar sesión en el servidor:", error);
        // Continúa con el logout local aunque falle el servidor
      } finally {
        // Siempre ejecutar el logout local
        logout();
        // Redirigir a la página de inicio
        navigate("/");
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
          <span className="visually-hidden">Cerrando sesión...</span>
        </div>
        <p className="mt-3 text-muted">Cerrando sesión...</p>
      </div>
    </div>
  );
};

export default Logout;