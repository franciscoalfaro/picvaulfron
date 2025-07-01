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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Cerrar sidebar al hacer clic en el overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeSidebar();
    }
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
      {/* Overlay para cerrar sidebar en móvil */}
      {sidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1040 }}
          onClick={handleOverlayClick}
        ></div>
      )}

      {/* Sidebar mejorado */}
      <div 
        className={`sidebar-enhanced ${sidebarOpen ? 'sidebar-open' : ''}`}
        style={{ zIndex: 1050 }}
      >
        {/* Header del sidebar */}
        <div className="sidebar-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="sidebar-logo">
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="ms-3">
                <h5 className="text-white mb-0 fw-bold">Perfil</h5>
                <small className="text-light opacity-75">Panel de usuario</small>
              </div>
            </div>
            <button
              className="btn btn-link text-white p-0 sidebar-close-btn"
              onClick={closeSidebar}
            >
              <i className="fas fa-times fs-4"></i>
            </button>
          </div>
        </div>

        {/* Información del usuario */}
        <div className="sidebar-user-info">
          <div className="text-center">
            <div className="user-avatar-container">
              {userData.profileImage ? (
                <img
                  src={`${Upload.URL}uploads/${userData.profileImage}`}
                  className="user-avatar"
                  alt="Foto de perfil"
                />
              ) : (
                <div className="user-avatar-placeholder">
                  <i className="fas fa-user"></i>
                </div>
              )}
              <div className="user-status-indicator"></div>
            </div>
            <h6 className="text-white mb-1 fw-bold">@{userData.nameUser}</h6>
            <small className="text-light opacity-75">
              {isOwnProfile ? "Tu perfil" : "Visitando perfil"}
            </small>
          </div>

          {/* Estadísticas mejoradas */}
          <div className="user-stats">
            <div className="stat-item">
              <div className="stat-icon">
                <i className="fas fa-images"></i>
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.images}</div>
                <div className="stat-label">Imágenes</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <i className="fas fa-layer-group"></i>
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.galleries}</div>
                <div className="stat-label">Galerías</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <i className="fas fa-eye"></i>
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.views}</div>
                <div className="stat-label">Vistas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación mejorada */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Navegación</div>
            <a href="#imagenes" className="nav-item" onClick={closeSidebar}>
              <div className="nav-icon">
                <i className="fas fa-images"></i>
              </div>
              <span>Imágenes</span>
              <div className="nav-badge">{stats.images}</div>
            </a>
            <a href="#galerias" className="nav-item" onClick={closeSidebar}>
              <div className="nav-icon">
                <i className="fas fa-layer-group"></i>
              </div>
              <span>Galerías</span>
              <div className="nav-badge">{stats.galleries}</div>
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Acciones</div>
            {isAuthenticated ? (
              <Link to="/auth" className="nav-item" onClick={closeSidebar}>
                <div className="nav-icon">
                  <i className="fas fa-home"></i>
                </div>
                <span>Inicio</span>
              </Link>
            ) : (
              <Link to="/" className="nav-item" onClick={closeSidebar}>
                <div className="nav-icon">
                  <i className="fas fa-home"></i>
                </div>
                <span>Inicio</span>
              </Link>
            )}
            
            {isOwnProfile && (
              <button
                onClick={() => { refreshProfile(); closeSidebar(); }}
                className="nav-item nav-button"
              >
                <div className="nav-icon">
                  <i className="fas fa-sync-alt"></i>
                </div>
                <span>Actualizar</span>
              </button>
            )}
          </div>

          {isAuthenticated && (
            <div className="nav-section">
              <div className="nav-section-title">Cuenta</div>
              <button
                onClick={() => { handleLogout(); closeSidebar(); }}
                className="nav-item nav-button logout-btn"
              >
                <div className="nav-icon">
                  <i className="fas fa-sign-out-alt"></i>
                </div>
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </nav>

        {/* Footer del sidebar */}
        <div className="sidebar-footer">
          <div className="text-center">
            <small className="text-light opacity-50">
              © 2025 Repositorio Imágenes
            </small>
          </div>
        </div>
      </div>

      {/* Botón flotante mejorado */}
      <button
        className="sidebar-toggle-btn"
        onClick={toggleSidebar}
        aria-label="Abrir menú"
      >
        <i className="fas fa-bars"></i>
        <div className="btn-ripple"></div>
      </button>

      {/* Contenido principal mejorado */}
      <div className="main-content">
        {/* Header del perfil */}
        <div className="profile-header">
          <div className="container">
            <div className="profile-header-content">
              <div className="profile-info">
                <div className="profile-avatar-large">
                  {userData.profileImage ? (
                    <img
                      src={`${Upload.URL}uploads/${userData.profileImage}`}
                      alt="Foto de perfil"
                    />
                  ) : (
                    <div className="profile-avatar-placeholder">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                </div>
                <div className="profile-details">
                  <h1 className="profile-name">
                    {isOwnProfile ? `¡Hola, ${userData.nameUser}!` : `@${userData.nameUser}`}
                  </h1>
                  <p className="profile-bio">
                    {userData.userInfo || "Sin información adicional"}
                  </p>
                  <div className="profile-meta">
                    <span className="meta-item">
                      <i className="fas fa-calendar-alt me-1"></i>
                      Miembro desde {new Date(userData.createdAt || Date.now()).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="profile-stats-large">
                <div className="stat-card">
                  <div className="stat-value">{stats.images}</div>
                  <div className="stat-label">Imágenes</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.galleries}</div>
                  <div className="stat-label">Galerías</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.views}</div>
                  <div className="stat-label">Vistas</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido de secciones */}
        <div className="container py-4">
          {/* Sección de imágenes mejorada */}
          <section id="imagenes" className="content-section">
            <div className="section-header">
              <div className="section-title">
                <i className="fas fa-images text-primary me-2"></i>
                <h2>Imágenes</h2>
                <span className="section-badge">{stats.images}</span>
              </div>
              {isOwnProfile && (
                <button
                  className={`btn ${showImageRegistration ? 'btn-danger' : 'btn-success'} btn-action`}
                  onClick={toggleImageRegistration}
                >
                  <i className={`fas ${showImageRegistration ? 'fa-times' : 'fa-plus'} me-2`}></i>
                  {showImageRegistration ? 'Cancelar' : 'Subir Imagen'}
                </button>
              )}
            </div>
            
            {showImageRegistration ? (
              <div className="content-card">
                <ImageRegistration galleries={userData.galleries || []} />
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
          <section id="galerias" className="content-section">
            <div className="section-header">
              <div className="section-title">
                <i className="fas fa-layer-group text-primary me-2"></i>
                <h2>Galerías</h2>
                <span className="section-badge">{stats.galleries}</span>
              </div>
              {isOwnProfile && (
                <button
                  className={`btn ${showGalleryRegistration ? 'btn-danger' : 'btn-success'} btn-action`}
                  onClick={toggleGalleryRegistration}
                >
                  <i className={`fas ${showGalleryRegistration ? 'fa-times' : 'fa-plus'} me-2`}></i>
                  {showGalleryRegistration ? 'Cancelar' : 'Crear Galería'}
                </button>
              )}
            </div>
            
            {showGalleryRegistration ? (
              <div className="content-card">
                <CarouselRegister images={userData.images || []} />
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
      </div>
    </>
  );
};