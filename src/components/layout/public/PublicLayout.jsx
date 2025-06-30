import { useEffect } from "react";
import { Header } from "./Header";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Footer } from "./Footer";

export const PublicLayout = () => {
  const { auth, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Obtener la ubicación actual

  useEffect(() => {
    if (!loading) {
      if (auth._id) {
        // Si el usuario está autenticado, redirigir a la página de autenticación
        navigate("/auth");
      }
    }
  }, [auth, loading, navigate]);

  if (loading) return <div>Loading...</div>; // Muestra un loading mientras se verifica la autenticación

  // Verificar si la ruta actual es la de perfil
  const isProfileRoute = location.pathname.includes("/perfil/");

  return (
    <>
      {/* Renderizar el Header solo si no estamos en la ruta de perfil */}
      {!isProfileRoute && <Header />}
      {/* Permitir el acceso a rutas públicas */}
      <Outlet />
      <Footer />
    </>
  );
};

export default PublicLayout;
