import PropTypes from "prop-types";
import { Upload } from "../util/Global";
import { useState } from "react";

const Carousel = ({ galleries, userName, images }) => {
  const [currentGalleryIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (galleries.length === 0) {
    return (
      <div className="container section-padding">
        <div className="text-center">
          <div className="mb-4">
            <i className="fas fa-images text-muted" style={{fontSize: '4rem'}}></i>
          </div>
          <h3 className="text-muted">El usuario @{userName} no tiene galerías.</h3>
          <p className="text-muted">¡Explora otros usuarios para descubrir increíbles galerías!</p>
        </div>
      </div>
    );
  }

  const currentGallery = galleries[currentGalleryIndex];

  // Se mapean los objetos de imagen de la galería a los objetos completos desde el array images.
  const currentImages = currentGallery.images
    .map((img) => images.find((image) => image._id === img._id))
    .filter((image) => image);

  // Función para ir a la siguiente imagen y volver al inicio cuando se llega al final.
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < currentImages.length - 1 ? prevIndex + 1 : 0
    );
  };

  // Función para ir a la imagen anterior y volver al final cuando se llega al inicio.
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : currentImages.length - 1
    );
  };

  // Generar los indicadores dinámicamente según la cantidad de imágenes en la galería.
  const indicators = currentImages.map((image, index) => (
    <button
      key={index}
      data-bs-target="#hero"
      data-bs-slide-to={index}
      className={index === currentImageIndex ? "active" : ""}
      aria-current={index === currentImageIndex ? "true" : "false"}
      aria-label={`Slide ${index + 1}`}
      onClick={() => setCurrentImageIndex(index)}
    ></button>
  ));

  return (
    <div className="container section-padding" id="hero">
      <div className="text-center mb-5">
        <h2 className="fw-bold mb-3">Galerías Destacadas</h2>
        <p className="text-muted fs-5">Explora las colecciones curadas de @{userName}</p>
      </div>

      <div className="carousel slide position-relative" data-bs-ride="carousel">
        <div className="text-center mb-4">
          <h1 className="text-informativo mb-3">{currentGallery.name}</h1>
          <div className="d-flex align-items-center justify-content-center gap-3">
            <div className="d-flex align-items-center">
              <i className="fas fa-user-circle text-primary me-2"></i>
              <span className="fw-semibold">@{userName}</span>
            </div>
            <div className="d-flex align-items-center text-muted">
              <i className="fas fa-calendar-alt me-2"></i>
              <span>{new Date(currentGallery.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="d-flex align-items-center text-muted">
              <i className="fas fa-images me-2"></i>
              <span>{currentImages.length} imagen{currentImages.length !== 1 ? 'es' : ''}</span>
            </div>
          </div>
        </div>

        {currentImages.length > 0 && (
          <div className="carousel-inner">
            {currentImages.map((image, index) => (
              <div
                className={`carousel-item ${
                  index === currentImageIndex ? "active" : ""
                }`}
                key={index}
              >
                <div className="position-relative">
                  <img
                    src={`${Upload.URL}uploads/${image.path}`}
                    className="d-block w-100 img-carrusel"
                    alt={`Imagen de la galería ${currentGallery.name}`}
                  />
                  <div className="position-absolute bottom-0 start-0 end-0 bg-gradient-dark bg-opacity-50 text-white p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1">{image.name || `Imagen ${index + 1}`}</h5>
                        <small className="opacity-75">
                          {new Date(image.createdAt).toLocaleDateString('es-ES')}
                        </small>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-light btn-sm">
                          <i className="fas fa-download"></i>
                        </button>
                        <button className="btn btn-light btn-sm">
                          <i className="fas fa-share"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentImages.length > 1 && (
          <div className="carousel-indicators">{indicators}</div>
        )}

        {currentImages.length > 1 && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              onClick={handlePrevImage}
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Anterior</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              onClick={handleNextImage}
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Siguiente</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

Carousel.propTypes = {
  galleries: PropTypes.array.isRequired,
  userName: PropTypes.string.isRequired,
  images: PropTypes.array.isRequired,
};

export default Carousel;