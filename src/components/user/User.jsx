import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const User = ({ userName, onNext, onPrev }) => {
  return (
    <div className="section-padding-sm">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="text-informativo mb-3">Descubre Imágenes</h1>
          <p className="text-muted fs-5">Explora las increíbles galerías de nuestra comunidad</p>
        </div>
        
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg border-0 hover-lift">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <button
                    className="btn btn-outline-primary rounded-circle hover-lift"
                    onClick={onPrev}
                    aria-label="Usuario anterior"
                    style={{ width: '50px', height: '50px' }}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  
                  <div className="text-center flex-grow-1 mx-4">
                    <div className="mb-3">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" 
                           style={{ width: '80px', height: '80px' }}>
                        <i className="fas fa-user text-white fs-2"></i>
                      </div>
                      <h3 className="fw-bold text-primary mb-2">@{userName}</h3>
                      <p className="text-muted mb-3">
                        Descubre las increíbles creaciones de este artista
                      </p>
                    </div>
                    
                    <Link
                      to={`perfil/${userName}`}
                      className="btn btn-primary btn-lg fw-bold px-4 hover-lift"
                      style={{
                        background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                        border: 'none',
                        borderRadius: '2rem',
                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                        textDecoration: 'none'
                      }}
                    >
                      <i className="fas fa-eye me-2"></i>
                      Ver Perfil
                    </Link>
                  </div>
                  
                  <button
                    className="btn btn-outline-primary rounded-circle hover-lift"
                    onClick={onNext}
                    aria-label="Siguiente usuario"
                    style={{ width: '50px', height: '50px' }}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="d-flex justify-content-center gap-4">
                <div className="text-center">
                  <i className="fas fa-images text-primary fs-3 mb-2"></i>
                  <p className="small text-muted mb-0">Imágenes únicas</p>
                </div>
                <div className="text-center">
                  <i className="fas fa-layer-group text-primary fs-3 mb-2"></i>
                  <p className="small text-muted mb-0">Galerías curadas</p>
                </div>
                <div className="text-center">
                  <i className="fas fa-heart text-primary fs-3 mb-2"></i>
                  <p className="small text-muted mb-0">Arte inspirador</p>
                </div>
              </div>
            </div>
          </div>
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