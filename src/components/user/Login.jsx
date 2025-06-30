import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import useAuth from "../../hooks/useAuth";
import { Global } from "../../util/Global";

export const Login = () => {
  useEffect(() => {
    document.body.classList.add("bg-register");
    return () => {
      document.body.classList.remove("bg-register");
    };
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, auth } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (auth?._id) {
      navigate("/auth");
    }
  }, [auth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${Global.URL}login`, 
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const { token, ...user } = response.data.data;
        login(user, token);
        navigate("/auth");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Credenciales incorrectas. Inténtalo de nuevo.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Limpiar error después de 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="login-card fade-in-up" style={{maxWidth: '900px', width: '100%'}}>
        <div className="row g-0">
          <div className="col-md-6">
            <div className="login-image h-100 d-flex align-items-center justify-content-center position-relative">
              <div className="text-center text-white p-4">
                <i className="fas fa-camera-retro mb-4" style={{fontSize: '4rem'}}></i>
                <h2 className="fw-bold mb-3">Bienvenido de vuelta</h2>
                <p className="fs-5 opacity-90">Accede a tu galería personal y descubre nuevas imágenes increíbles</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="login-form">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary mb-2">Iniciar Sesión</h2>
                <p className="text-muted">Ingresa tus credenciales para continuar</p>
              </div>
              
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="alert alert-danger d-flex align-items-center">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">
                    <i className="fas fa-envelope me-2"></i>
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    id="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    <i className="fas fa-lock me-2"></i>
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    id="password"
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 mb-3 hover-lift"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Iniciar Sesión
                    </>
                  )}
                </button>
                
                <div className="text-center">
                  <p className="text-muted mb-2">¿No tienes una cuenta?</p>
                  <Link className="btn btn-outline-primary w-100 hover-lift" to="/registro">
                    <i className="fas fa-user-plus me-2"></i>
                    Crear Cuenta
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

export default Login;