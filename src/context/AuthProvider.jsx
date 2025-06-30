import { useState, useEffect, createContext, useMemo } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  // Método para verificar si hay un usuario autenticado
  const checkAuth = () => {
    const user = localStorage.getItem("user");
    const token = Cookies.get("token");

    if (user && token) {
      const userObj = JSON.parse(user);
      setAuth({ ...userObj, token });
    } else {
      setAuth({});
    }

    setLoading(false);
  };

  // Función para iniciar sesión
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    Cookies.set("token", token);
    setAuth({ ...userData, token });
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("user");
    Cookies.remove("token");
    setAuth({});
  };

  const value = useMemo(
    () => ({ auth, setAuth, loading, login, logout }),
    [auth, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
