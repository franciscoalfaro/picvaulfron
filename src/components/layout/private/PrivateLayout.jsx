import { useEffect } from "react";
import { Header } from "../public/Header";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

export const PrivateLayout = () => {
  const { auth, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!auth?._id) {
        // Verifica si no hay ID de usuario
        navigate("/login"); // Redirige al login en lugar de inicio
      }
    }
  }, [auth, loading, navigate]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">Verificando permisos...</p>
      </div>
    </div>
  );

  const isProfileRoute = location.pathname.includes("/perfil/");

  return (
    <>
      {/* Renderizar el Header solo si no estamos en la ruta de perfil */}
      {!isProfileRoute && <Header />}
      {/* Permitir el acceso a rutas privadas */}
      <Outlet />
    </>
  );
};

export default PrivateLayout;