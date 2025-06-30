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
  const { auth, getAuthHeaders, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ images: 0, galleries: 0, views: 0 });
  const navigate = useNavigate();
  const [showImageRegistration, setShowImageRegistration] = useState(false);
  const [showGalleryRegistration, setShowGalleryRegistration] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let response;
        const isOwnProfile = isAuthenticated && auth.nameUser === nameUser;

        // Usar endpoint apropiado según autenticación y propiedad del perfil
        if (isOwnProfile) {
          response = await axios.get(`${Global.URL}usuario/${nameUser}`, {
            headers: getAuthHeaders(),
            withCredentials: true,
          });
        } else {
          response = await axios.get(`${Global.URL}publico/usuario/${nameUser}`);
        }

        if (response.status === 200) {
          const user = response.data.data;
          setUserData(user);
          
          // Calcular estadísticas
          setStats({
            images: user.images?.length || 0,
            galleries: user.galleries?.length || 0,
            views: user.profileViews || 0
          });
        }
      } catch (err) {
        console.error("Error loading user data:", err);
        if (err.response?.status === 404) {
          setError("Usuario no encontrado");
        } else {
          setError("Error al cargar el perfil del usuario");
        }
        
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } finally {
        setLoading(false);
      }
    };
    
    if (nameUser) {
      fetchUserData();
    }
  }, [nameUser, auth, navigate, getAuthHeaders, isAuthenticated]);

  const handleLogout = () => {
    if (isAuthenticated) {
      navigate("/auth/logout");
    } else {
      navigate("/");
    }
  };

  const toggleImageRegistration = () => {
    setShowImageRegistration((prev) => !prev);
    setShowGalleryRegistration(false);
  };

  const toggleGalleryRegistration = () => {
    setShowGalleryRegistration((prev) => !prev);
    setShowImageRegistration(false);
  };

  const refreshProfile = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Cargando perfil...</span>
          </div>
          <p className="mt-3 text-muted">Cargando perfil de @{nameUser}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card border-danger">
              <div className="card-body text-center">
                <i className="fas fa-exclamation-triangle text-danger mb-3" style={{fontSize: '3rem'}}></i>
                <h4 className="text-danger">{error}</h4>
                <p className="text-muted">Redirigiendo al inicio en unos segundos...</p>
                <Link to="/" className="btn btn-primary">
                  <i className="fas fa-home me-2"></i>
                  Volver al Inicio
                </Link>
              </div>
            </div>
          </div>
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

  const isOwnProfile = isAuthenticated && auth?.nameUser === nameUser;

  return (
    <>
      {/* Sidebar mejorado */}
      <div id="mySidenav" className="sidenav">
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-light border-opacity-25">
          <h3 className="fw-bold text-white mb-0">
            <i className="fas fa-user-circle me-2"></i>
            Perfil
          </h3>
          <button
            className="btn btn-link text-white p-0"
            style={{ fontSize: "24px" }}
            onClick={() => (document.getElementById("mySidenav").style.width = "0")}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-3">
          <div className="text-center mb-4">
            {userData.profileImage ? (
              <img
                src={`${Upload.URL}uploads/${userData.profileImage}`}
                className="rounded-circle mb-2"
                alt="Foto de perfil"
                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
              />
            ) : (
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mb-2 mx-auto" 
                   style={{ width: '60px', height: '60px' }}>
                <i className="fas fa-user text-white fs-4"></i>
              </div>
            )}
            <h6 className="text-white mb-0">@{userData.nameUser}</h6>
            <small className="text-light opacity-75">
              {isOwnProfile ? "Tu perfil" : "Visitando perfil"}
            </small>
          </div>

          {/* Estadísticas */}
          <div className="row text-center mb-4">
            <div className="col-4">
              <div className="text-white">
                <div className="fw-bold fs-5">{stats.images}</div>
                <small className="opacity-75">Imágenes</small>
              </div>
            </div>
            <div className="col-4">
              <div className="text-white">
                <div className="fw-bold fs-5">{stats.galleries}</div>
                <small className="opacity-75">Galerías</small>
              </div>
            </div>
            <div className="col-4">
              <div className="text-white">
                <div className="fw-bold fs-5">{stats.views}</div>
                <small className="opacity-75">Vistas</small>
              </div>
            </div>
          </div>

          {/* Navegación */}
          <nav>
            <a href="#imagenes" className="nav-link text-light d-flex align-items-center py-2 mb-2">
              <i className="fas fa-images me-3"></i>
              Imágenes
            </a>
            <a href="#galerias" className="nav-link text-light d-flex align-items-center py-2 mb-2">
              <i className="fas fa-layer-group me-3"></i>
              Galerías
            </a>
            {isAuthenticated ? (
              <Link to="/auth" className="nav-link text-light d-flex align-items-center py-2 mb-2">
                <i className="fas fa-home me-3"></i>
                Inicio
              </Link>
            ) : (
              <Link to="/" className="nav-link text-light d-flex align-items-center py-2 mb-2">
                <i className="fas fa-home me-3"></i>
                Inicio
              </Link>
            )}
            
            {isOwnProfile && (
              <button
                onClick={refreshProfile}
                className="nav-link text-light d-flex align-items-center py-2 mb-2 bg-transparent border-0 w-100"
              >
                <i className="fas fa-sync-alt me-3"></i>
                Actualizar
              </button>
            )}
            
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="nav-link text-light d-flex align-items-center py-2 mb-2 bg-transparent border-0 w-100"
              >
                <i className="fas fa-sign-out-alt me-3"></i>
                Cerrar sesión
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Botón para abrir el sidebar mejorado */}
      <div className="position-fixed top-0 start-0 p-3" style={{ zIndex: 1000 }}>
        <button
          className="btn btn-primary rounded-circle shadow-lg"
          style={{ width: '50px', height: '50px' }}
          onClick={() => (document.getElementById("mySidenav").style.width = "300px")}
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      {/* Contenido principal mejorado */}
      <div className="container-fluid px-4 py-3">
        {/* Header del perfil */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm bg-gradient-primary text-white">
              <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <div className="d-flex align-items-center mb-3">
                      {userData.profileImage ? (
                        <img
                          src={`${Upload.URL}uploads/${userData.profileImage}`}
                          className="rounded-circle me-4 border border-white border-3"
                          alt="Foto de perfil"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center me-4 border border-white border-3" 
                             style={{ width: '100px', height: '100px' }}>
                          <i className="fas fa-user text-white fs-1"></i>
                        </div>
                      )}
                      <div>
                        <h1 className="fw-bold mb-2">
                          {isOwnProfile ? `¡Hola, ${userData.nameUser}!` : `@${userData.nameUser}`}
                        </h1>
                        <p className="mb-0 opacity-90">
                          {userData.userInfo || "Sin información adicional"}
                        </p>
                        <small className="opacity-75">
                          <i className="fas fa-calendar-alt me-1"></i>
                          Miembro desde {new Date(userData.createdAt || Date.now()).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long'
                          })}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <div className="row text-center">
                      <div className="col-4">
                        <div className="fw-bold fs-4">{stats.images}</div>
                        <small>Imágenes</small>
                      </div>
                      <div className="col-4">
                        <div className="fw-bold fs-4">{stats.galleries}</div>
                        <small>Galerías</small>
                      </div>
                      <div className="col-4">
                        <div className="fw-bold fs-4">{stats.views}</div>
                        <small>Vistas</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de imágenes mejorada */}
        <section id="imagenes" className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">
              <i className="fas fa-images text-primary me-2"></i>
              Imágenes
              <span className="badge bg-primary ms-2">{stats.images}</span>
            </h2>
            {isOwnProfile && (
              <button
                className={`btn ${showImageRegistration ? 'btn-danger' : 'btn-success'} rounded-pill`}
                onClick={toggleImageRegistration}
              >
                <i className={`fas ${showImageRegistration ? 'fa-times' : 'fa-plus'} me-2`}></i>
                {showImageRegistration ? 'Cancelar' : 'Subir Imagen'}
              </button>
            )}
          </div>
          
          {showImageRegistration ? (
            <div className="card shadow-sm">
              <div className="card-body">
                <ImageRegistration galleries={userData.galleries || []} />
              </div>
            </div>
          ) : (
            <ImagePerfil
              images={userData.images || []}
              userName={userData.nameUser}
              galleriesPerfil={userData.galleries || []}
            />
          )}
        </section>

        {/* Sección de galerías mejorada */}
        <section id="galerias" className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">
              <i className="fas fa-layer-group text-primary me-2"></i>
              Galerías
              <span className="badge bg-primary ms-2">{stats.galleries}</span>
            </h2>
            {isOwnProfile && (
              <button
                className={`btn ${showGalleryRegistration ? 'btn-danger' : 'btn-success'} rounded-pill`}
                onClick={toggleGalleryRegistration}
              >
                <i className={`fas ${showGalleryRegistration ? 'fa-times' : 'fa-plus'} me-2`}></i>
                {showGalleryRegistration ? 'Cancelar' : 'Crear Galería'}
              </button>
            )}
          </div>
          
          {showGalleryRegistration ? (
            <div className="card shadow-sm">
              <div className="card-body">
                <CarouselRegister images={userData.images || []} />
              </div>
            </div>
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