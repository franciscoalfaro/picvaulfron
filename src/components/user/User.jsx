import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const User = ({ userName, onNext, onPrev }) => {
  return (
    <div className="section-padding-sm">
      <div className="container">
        <h1 className="text-center mb-4 text-informativo">Descubre Imágenes</h1>
        <div className="d-flex align-items-center justify-content-center mb-4">
          <button
            className="carousel-deco-icon prev me-3 hover-lift"
            onClick={onPrev}
            aria-label="Usuario anterior"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <Link
            to={`perfil/${userName}`}
            className="btn btn-success btn-lg fw-bold py-3 px-4 mx-3 hover-lift"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              borderRadius: '1rem',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
              fontSize: '1.25rem',
              textDecoration: 'none'
            }}
          >
            <i className="fas fa-user me-2"></i>
            @{userName}
          </Link>
          
          <button
            className="carousel-deco-icon next ms-3 hover-lift"
            onClick={onNext}
            aria-label="Siguiente usuario"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-muted fs-5">
            Explora las increíbles galerías de <strong>@{userName}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

User.propTypes = {
  userName: PropTypes.string.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
};

export default User;