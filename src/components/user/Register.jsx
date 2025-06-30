import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import { Global } from "../../util/Global";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

export const Register = () => {
  useEffect(() => {
    document.body.classList.add("bg-register");
    return () => {
      document.body.classList.remove("bg-register");
    };
  }, []);

  const { form, changed } = useForm({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (auth?._id) {
      navigate("/auth");
    }
  }, [auth, navigate]);

  const registerUser = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }

      const response = await axios.post(
        `${Global.URL}registro/usuario`,
        formData,
        { 
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        }
      );

      if (response.status === 201) {
        setSuccess(true);
        const formulario = document.querySelector("#create");
        formulario.reset();
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error al crear un nuevo Usuario.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Limpiar mensajes después de 5 segundos
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">
      <div className="register-card fade-in-up" style={{maxWidth: '1000px', width: '100%'}}>
        <div className="row g-0">
          <div className="col-md-6 order-md-2">
            <div className="register-image h-100 d-flex align-items-center justify-content-center position-relative">
              <div className="text-center text-white p-4">
                <i className="fas fa-users mb-4" style={{fontSize: '4rem'}}></i>
                <h2 className="fw-bold mb-3">Únete a nuestra comunidad</h2>
                <p className="fs-5 opacity-90">Comparte tus mejores imágenes y descubre el trabajo de otros artistas</p>
                <div className="mt-4">
                  <div className="d-flex justify-content-center gap-3 mb-3">
                    <div className="text-center">
                      <i className="fas fa-upload fs-3 mb-2"></i>
                      <p className="small mb-0">Sube imágenes</p>
                    </div>
                    <div className="text-center">
                      <i className="fas fa-layer-group fs-3 mb-2"></i>
                      <p className="small mb-0">Crea galerías</p>
                    </div>
                    <div className="text-center">
                      <i className="fas fa-share-alt fs-3 mb-2"></i>
                      <p className="small mb-0">Comparte</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 order-md-1">
            <div className="p-4 p-md-5">
              <div className="text-center mb-4">
                <h1 className="fw-bold text-primary mb-2">Crear Cuenta</h1>
                <p className="text-muted">Completa el formulario para comenzar</p>
              </div>
              
              <form id="create" onSubmit={registerUser}>
                {error && (
                  <div className="alert alert-danger d-flex align-items-center mb-4">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success d-flex align-items-center mb-4">
                    <i className="fas fa-check-circle me-2"></i>
                    ¡Cuenta creada exitosamente! Redirigiendo al login...
                  </div>
                )}
                
                <div className="mb-3">
                  <label htmlFor="nameUser" className="form-label">
                    <i className="fas fa-user me-2"></i>
                    Nombre de Usuario
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nameUser"
                    name="nameUser"
                    placeholder="Elige un nombre único"
                    onChange={changed}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <i className="fas fa-envelope me-2"></i>
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="tu@email.com"
                    onChange={changed}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    <i className="fas fa-lock me-2"></i>
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="Crea una contraseña segura"
                    onChange={changed}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="profileImage" className="form-label">
                    <i className="fas fa-camera me-2"></i>
                    Imagen de Perfil <span className="text-muted">(opcional)</span>
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="profileImage"
                    name="profileImage"
                    accept="image/*"
                    onChange={changed}
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="userInfo" className="form-label">
                    <i className="fas fa-info-circle me-2"></i>
                    Información Personal <span className="text-muted">(opcional)</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="userInfo"
                    name="userInfo"
                    rows="3"
                    placeholder="Cuéntanos un poco sobre ti..."
                    onChange={changed}
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 mb-3 hover-lift"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus me-2"></i>
                      Crear Cuenta
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-muted mb-2">¿Ya tienes una cuenta?</p>
                  <Link className="btn btn-outline-primary w-100 hover-lift" to="/login">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Iniciar Sesión
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};