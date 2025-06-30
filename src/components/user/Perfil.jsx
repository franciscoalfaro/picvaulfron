import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { Global, Upload } from "../../util/Global";
import ImagePerfil from "../ImagePerfil";
import CarouselPerfil from "../CarouselPerfil";
import ImageRegistration from "../ImageRegister";
import CarouselRegister from "../CarouselRegister";

export const Perfil = () => {
  const { nameUser } = useParams();
  const { auth, token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showImageRegistration, setShowImageRegistration] = useState(false);
  const [showGalleryRegistration, setShowGalleryRegistration] = useState(false);

  useEffect(() => {
    const axiosUserData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let response;

        // Si no está autenticado o si está autenticado pero el usuario en la URL no corresponde al usuario logueado,
        // usamos el endpoint público. De lo contrario, usamos el endpoint privado.
        if (!auth.nameUser || auth.nameUser !== nameUser) {
          response = await axios.get(
            `${Global.URL}publico/usuario/${nameUser}`
          );
        } else {
          response = await axios.get(`${Global.URL}usuario/${nameUser}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          });
        }

        if (response.status === 200) {
          setUserData(response.data.data);
        }
      } catch (err) {
        console.error("Error loading user data:", err);
        setError("Usuario no encontrado");
        // Redirigir después de un breve delay
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };
    
    if (nameUser) {
      axiosUserData();
    }
  }, [nameUser, auth, navigate, token]);

  const handleLogout = () => {
    if (auth.nameUser) {
      navigate("/auth/logout");
    } else {
      navigate("/logout");
    }
  };

  const toggleImageRegistration = () => {
    setShowImageRegistration((prev) => !prev);
    setShowGalleryRegistration(false); // Cerrar el otro formulario
  };

  const toggleGalleryRegistration = () => {
    setShowGalleryRegistration((prev) => !prev);
    setShowImageRegistration(false); // Cerrar el otro formulario
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Cargando perfil...</span>
          </div>
          <p className="mt-3 text-muted">Cargando perfil de {nameUser}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <p className="mt-2 mb-0">Redirigiendo al inicio...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center">
          <i className="fas fa-info-circle me-2"></i>
          No se pudieron cargar los datos del usuario.
        </div>
      </div>
    );
  }

  const isOwnProfile = auth?.nameUser === nameUser;

  return (
    <>
      {/* Sidebar */}
      <div id="mySidenav" className="sidenav bg-side">
        <h3 className="fw-bold text-dashboard mx-2">Perfil</h3>
        <button
          className="closebtn text-white"
          style={{
            backgroundColor: "transparent",
            border: "none",
            fontSize: "30px",
            cursor: "pointer",
          }}
          onClick={() =>
            (document.getElementById("mySidenav").style.width = "0")
          }
        >
          &times;
        </button>
        <a href="#imagenes" className="text-light fw-bold d-block mb-3">
          <i className="icon ion-md-images mx-3 lead"></i>Imágenes
        </a>
        <a href="#galerias" className="text-light fw-bold d-block mb-3">
          <i className="icon ion-md-albums mx-3 lead"></i>Galerías
        </a>
        {auth.nameUser ? (
          <Link to="/auth" className="text-light fw-bold d-block mb-3">
            <i className="icon ion-md-home mx-3 lead"></i>Inicio
          </Link>
        ) : (
          <a href="/" className="text-light fw-bold d-block mb-3">
            <i className="icon ion-md-home mx-3 lead"></i>Inicio
          </a>
        )}
        {auth.nameUser && (
          <button
            onClick={handleLogout}
            className="btn-logout text-light fw-bold d-block mb-3"
          >
            <i className="icon ion-md-exit mx-3 lead"></i>Cerrar sesión
          </button>
        )}
      </div>

      {/* Botón para abrir el sidebar */}
      <div id="main">
        <span
          className="mx-3"
          style={{ fontSize: "30px", cursor: "pointer" }}
          onClick={() =>
            (document.getElementById("mySidenav").style.width = "250px")
          }
        >
          &#9776;
        </span>
      </div>

      {/* Contenido principal */}
      <div className="container">
        {/* Bienvenida */}
        <section>
          <div className="row">
            <div className="col-lg-4">
              <h1 className="fw-bold mt-3 text-informativo">
                {isOwnProfile
                  ? "Bienvenido: " + userData.nameUser
                  : `Perfil de ${userData.nameUser}`}
              </h1>
              <p className="text-muted mt-5">{userData.userInfo || "Sin información adicional"}</p>
            </div>
            <div className="col-lg-8">
              {userData.profileImage && (
                <img
                  src={`${Upload.URL}uploads/${userData.profileImage}`}
                  className="img-testimonio rounded-circle"
                  alt="Foto de perfil"
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover'
                  }}
                />
              )}
            </div>
          </div>
        </section>

        {/* Sección de imágenes */}
        <section id="imagenes">
          <h2 className="fw-bold text-center">Imágenes</h2>
          <div className="d-flex justify-content-center mb-3">
            {auth.nameUser && isOwnProfile && (
              <button
                className="fs-4 btn btn-marca btn-lg rounded-circle mx-auto"
                onClick={toggleImageRegistration}
              >
                <i className="icon ion-md-add-circle icon-large text-white"></i>
              </button>
            )}
          </div>
          {showImageRegistration ? (
            <ImageRegistration galleries={userData.galleries || []} />
          ) : (
            <ImagePerfil
              images={userData.images || []}
              userName={userData.nameUser}
              galleriesPerfil={userData.galleries || []}
            />
          )}
        </section>

        {/* Sección de galerías */}
        <section id="galerias" className="mb-3">
          <h1 className="fw-bold mt-5 text-center">Galerías</h1>
          <div className="d-flex justify-content-center">
            {auth.nameUser && isOwnProfile && (
              <button
                className="fs-4 btn btn-marca btn-lg rounded-circle mx-auto mb-3"
                id="btn-galeria"
                onClick={toggleGalleryRegistration}
              >
                <i className="icon ion-md-add-circle icon-large text-white"></i>
              </button>
            )}
          </div>
          {showGalleryRegistration ? (
            <CarouselRegister images={userData.images || []} />
          ) : (
            <CarouselPerfil
              galleries={userData.galleries || []}
              userName={userData.nameUser}
              images={userData.images || []}
            />
          )}
        </section>
      </div>
    </>
  );
};