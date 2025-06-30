import PropTypes from "prop-types";
import { Upload } from "../util/Global";
import ImageModal from "./ImageModal";
import { useState } from "react";

export const Image = ({ images, userName }) => {
  const [imageSrc, setImageSrc] = useState(null);

  const handleImageClick = (imagePath) => {
    setImageSrc(`${Upload.URL}uploads/${imagePath}`); // Establece la ruta completa
    const modal = new window.bootstrap.Modal(
      document.getElementById("modal-imagen")
    );
    modal.show();
  };

  const handleCloseModal = () => {
    setImageSrc(null);
  };

  if (images.length === 0) {
    return (
      <div className="container section-padding">
        <div className="text-center">
          <div className="mb-4">
            <i className="fas fa-images text-muted" style={{fontSize: '4rem'}}></i>
          </div>
          <h3 className="text-muted">El usuario @{userName} no tiene imágenes.</h3>
          <p className="text-muted">¡Vuelve pronto para ver nuevo contenido!</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container section-padding" id="imagenes">
      <div className="text-center mb-5">
        <h2 className="fw-bold mb-3">Galería de Imágenes</h2>
        <p className="text-muted fs-5">Descubre las mejores imágenes de @{userName}</p>
      </div>
      
      <div className="row g-4">
        {images.map((image, index) => (
          <div key={index} className="col-md-6 col-lg-4">
            <div className="card h-100 hover-lift">
              <div className="position-relative overflow-hidden">
                <img
                  className="card-img-top img-gallery"
                  src={`${Upload.URL}uploads/${image.path}`}
                  alt={`Imagen ${index + 1} de la galería`}
                  onClick={() => handleImageClick(image.path)}
                  style={{cursor: 'pointer'}}
                />
                <div className="position-absolute top-0 end-0 m-2">
                  <span className="badge bg-primary">
                    <i className="fas fa-eye me-1"></i>
                    Ver
                  </span>
                </div>
              </div>
              
              <div className="card-body d-flex flex-column">
                <div className="d-flex align-items-center mb-2">
                  <i className="fas fa-user-circle text-primary me-2"></i>
                  <span className="fw-semibold">@{userName}</span>
                </div>
                
                <div className="d-flex align-items-center mb-3 text-muted">
                  <i className="fas fa-calendar-alt me-2"></i>
                  <small>{new Date(image.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</small>
                </div>
                
                <div className="mt-auto d-flex gap-2">
                  <button className="btn btn-primary btn-sm flex-fill hover-lift">
                    <i className="fas fa-download me-1"></i>
                    Descargar
                  </button>
                  <button className="btn btn-success btn-sm flex-fill hover-lift">
                    <i className="fas fa-link me-1"></i>
                    Compartir
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <ImageModal imageSrc={imageSrc} onClose={handleCloseModal} />
    </main>
  );
};

Image.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  userName: PropTypes.string.isRequired,
};

export default Image;