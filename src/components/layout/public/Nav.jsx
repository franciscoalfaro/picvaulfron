import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

export const Nav = () => {
  const { auth } = useAuth(); // Usamos el hook para obtener auth

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
      <div className="container d-flex">
        <Link className="navbar-brand fw-bold" to="/">
          Repositorio Imagenes
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item mb-2 mb-lg-0">
              <Link className="nav-link text-white fw-bold me-3" to="/">
                Inicio
              </Link>
            </li>
            {!auth?._id ? (
              <>
                <Link className="nav-link text-white fw-bold me-3" to="login">
                  Login
                </Link>
                <Link
                  className="nav-link text-white fw-bold me-3"
                  to="registro"
                >
                  Registro
                </Link>
                <a
                  className="nav-link text-white fw-bold me-3"
                  href="#imagenes"
                >
                  Imagenes
                </a>
                <a className="nav-link text-white fw-bold me-3" href="#hero">
                  Galerias
                </a>
              </>
            ) : (
              <>
                <li className="nav-item mb-2 mb-lg-0">
                  <Link
                    className="nav-link text-white fw-bold me-3"
                    to={`perfil/${auth.nameUser}`}
                  >
                    Perfil
                  </Link>
                </li>
                <a
                  className="nav-link text-white fw-bold me-3"
                  href="#imagenes"
                >
                  Imagenes
                </a>
                <a className="nav-link text-white fw-bold me-3" href="#hero">
                  Galerias
                </a>
                <Link className="nav-link text-white fw-bold me-3" to="logout">
                  Logout
                </Link>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
