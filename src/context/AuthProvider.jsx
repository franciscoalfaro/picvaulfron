import { useState, useEffect, createContext, useMemo } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Global } from "../util/Global";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  // Método para verificar si hay un usuario autenticado
  const checkAuth = async () => {
    const user = localStorage.getItem("user");
    const token = Cookies.get("token");

    if (user && token) {
      try {
        // Verificar que el token sigue siendo válido
        const response = await axios.get(`${Global.URL}verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          const userObj = JSON.parse(user);
          setAuth({ ...userObj, token });
        } else {
          // Token inválido, limpiar datos
          clearAuth();
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        // Token inválido, limpiar datos
        clearAuth();
      }
    } else {
      setAuth({});
    }

    setLoading(false);
  };

  // Función para limpiar autenticación
  const clearAuth = () => {
    localStorage.removeItem("user");
    Cookies.remove("token");
    setAuth({});
  };

  // Función para iniciar sesión
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    Cookies.set("token", token, { 
      expires: 7, 
      secure: window.location.protocol === 'https:', 
      sameSite: 'lax' 
    });
    setAuth({ ...userData, token });
  };

  // Función para cerrar sesión
  const logout = () => {
    clearAuth();
  };

  // Función para obtener headers de autorización
  const getAuthHeaders = () => {
    const token = auth.token || Cookies.get("token");
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    } : {};
  };

  const value = useMemo(
    () => ({ 
      auth, 
      setAuth, 
      loading, 
      login, 
      logout,
      getAuthHeaders,
      token: auth.token || Cookies.get("token"),
      isAuthenticated: !!auth._id
    }),
    [auth, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Verificando autenticación...</p>
          </div>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;