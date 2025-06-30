import { Header } from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./Footer";

export const PublicLayout = () => {
  const location = useLocation();

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