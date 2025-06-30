import PropTypes from "prop-types";
import { Upload } from "../util/Global";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import UpdateCarousel from "./UpdateCarousel";

const CarouselPerfil = ({ galleries, userName, images }) => {
  const { auth } = useAuth();
  const isOwnProfile = auth?.nameUser === userName;

  // Estado para manejar la imagen actual por galería (almacena índices por _id de la galería)
  const [currentImageIndices, setCurrentImageIndices] = useState({});

  // Estados para manejar la edición de la galería
  const [showGalleryEdit, setShowGalleryEdit] = useState(false);
  const [galleryToEdit, setGalleryToEdit] = useState(null);

  // Cuando las galerías cambien, inicializamos los índices en 0 para cada galería
  useEffect(() => {
    const indices = {};
    galleries.forEach((gallery) => {
      indices[gallery._id] = 0;
    });
    setCurrentImageIndices(indices);
  }, [galleries]);

  // Función para manejar la edición de una galería
  const handleEditClick = (gallery) => {
    setGalleryToEdit(gallery);
    setShowGalleryEdit(true);
  };

  // Funciones para manejar la navegación de imágenes
  const handleNextImage = (galleryId, currentImagesLength) => {
    setCurrentImageIndices((prevIndices) => ({
      ...prevIndices,
      [galleryId]: (prevIndices[galleryId] + 1) % currentImagesLength,
    }));
  };

  const handlePrevImage = (galleryId, currentImagesLength) => {
    setCurrentImageIndices((prevIndices) => ({
      ...prevIndices,
      [galleryId]:
        (prevIndices[galleryId] - 1 + currentImagesLength) %
        currentImagesLength,
    }));
  };

  if (galleries.length === 0) {
    return (
      <div className="text-center mt-2">
        <h3>El usuario @{userName} no tiene galerías.</h3>
      </div>
    );
  }

  return (
    <div className="container mt-3">
      {showGalleryEdit ? (
        <UpdateCarousel initialData={galleryToEdit} images={images} />
      ) : (
        <div className="row">
          {galleries.map((gallery, galleryIndex) => {
            const currentImages = gallery.images
              .map((imageId) => images.find((image) => image._id === imageId))
              .filter(Boolean);

            const currentImageIndex = currentImageIndices[gallery._id] || 0;

            const indicators = currentImages.map((_, index) => (
              <button
                key={index}
                data-bs-target={`#carousel-${gallery._id}`}
                data-bs-slide-to={index}
                className={index === currentImageIndex ? "active" : ""}
                aria-current={index === currentImageIndex ? "true" : "false"}
                aria-label={`Slide ${index + 1}`}
                onClick={() =>
                  setCurrentImageIndices((prev) => ({
                    ...prev,
                    [gallery._id]: index,
                  }))
                }
              ></button>
            ));

            return (
              <div key={gallery._id} className="col-md-6 mb-4">
                <h1 className="text-center mb-3">{gallery.name}</h1>
                <div className="text-center">
                  <p className="mx-3 mb-3">
                    {new Date(gallery.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {currentImages.length > 0 ? (
                  <div
                    id={`carousel-${gallery._id}`}
                    className="carousel slide"
                    data-bs-ride="carousel"
                  >
                    <div className="carousel-inner">
                      {currentImages.map((image, index) => (
                        <div
                          key={image._id}
                          className={`carousel-item ${
                            index === currentImageIndex ? "active" : ""
                          }`}
                        >
                          <img
                            src={`${Upload.URL}uploads/${image.path}`}
                            className="d-block w-100 img-carrusel img-fluid"
                            alt={`Imagen de la galería ${gallery.name}`}
                          />
                        </div>
                      ))}
                    </div>

                    {currentImages.length > 1 && (
                      <div className="carousel-indicators">{indicators}</div>
                    )}

                    <button
                      className="carousel-control-prev"
                      type="button"
                      onClick={() =>
                        handlePrevImage(gallery._id, currentImages.length)
                      }
                    >
                      <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      onClick={() =>
                        handleNextImage(gallery._id, currentImages.length)
                      }
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-center">Esta galería no tiene imágenes.</p>
                )}

                {auth.nameUser && isOwnProfile && (
                  <div className="buttons-container text-center mt-4">
                    <button
                      className="btn btn-warning btn-md fw-bold text-white mx-2"
                      onClick={() => handleEditClick(gallery)}
                    >
                      Modificar
                    </button>
                    <button className="btn btn-danger btn-md fw-bold mx-2">
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

CarouselPerfil.propTypes = {
  galleries: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(PropTypes.string).isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  userName: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CarouselPerfil;
