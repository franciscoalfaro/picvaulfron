import PropTypes from "prop-types";
import { Global, Upload } from "../util/Global";
import ImageModal from "./ImageModal";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import UpdateTest from "./UpdateTest";
import useDelete from "../hooks/useDelete";

export const ImagePerfil = ({ images, userName, galleriesPerfil }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const { auth, isAuthenticated } = useAuth();
  const [showImageEdit, setShowImageEdit] = useState(false);
  const [idImage, setIdimage] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'

  const { deleteImage } = useDelete();

  const handleImageClick = (imagePath) => {
    setImageSrc(`${Upload.URL}uploads/${imagePath}`);
    const modal = new window.bootstrap.Modal(
      document.getElementById("modal-imagen")
    );
    modal.show();
  };

  const handleCloseModal = () => {
    setImageSrc(null);
  };

  const handleEditClick = (image) => {
    setIdimage(image);
    setShowImageEdit(true);
  };

  const handleDeleteImage = async (url, image) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      setIdimage(image);
      try {
        await deleteImage(url, image._id);
      } catch (error) {
        console.error("Error al eliminar la imagen:", error);
      }
    }
  };

  const isOwnProfile = isAuthenticated && auth?.nameUser === userName;

  if (images.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-4">
          <i className="fas fa-images text-muted" style={{fontSize: '4rem'}}></i>
        </div>
        <h4 className="text-muted">
          {isOwnProfile ? 'Aún no has subido imágenes' : `@${userName} no tiene imágenes`}
        </h4>
        <p className="text-muted">
          {isOwnProfile ? '¡Sube tu primera imagen para comenzar!' : '¡Vuelve pronto para ver nuevo contenido!'}
        </p>
      </div>
    );
  }

  if (showImageEdit) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <UpdateTest
            initialData={idImage}
            galleries={galleriesPerfil}
            galleryId={galleriesPerfil._id}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Controles de vista */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <span className="text-muted me-3">{images.length} imagen{images.length !== 1 ? 'es' : ''}</span>
        </div>
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
            onClick={() => setViewMode('grid')}
          >
            <i className="fas fa-th"></i>
          </button>
          <button
            type="button"
            className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
            onClick={() => setViewMode('list')}
          >
            <i className="fas fa-list"></i>
          </button>
        </div>
      </div>

      {/* Vista en cuadrícula */}
      {viewMode === 'grid' && (
        <div className="row g-4">
          {images.map((image, index) => (
            <div key={image._id} className="col-md-6 col-lg-4">
              <div className="card h-100 hover-lift shadow-sm">
                <div className="position-relative overflow-hidden">
                  <img
                    className="card-img-top img-gallery"
                    src={`${Upload.URL}uploads/${image.path}`}
                    alt={image.name || `Imagen ${index + 1}`}
                    onClick={() => handleImageClick(image.path)}
                    style={{cursor: 'pointer'}}
                  />
                  <div className="position-absolute top-0 end-0 m-2">
                    <span className="badge bg-primary bg-opacity-75">
                      <i className="fas fa-eye me-1"></i>
                      Ver
                    </span>
                  </div>
                </div>
                
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title fw-bold mb-2">
                    {image.name || `Imagen ${index + 1}`}
                  </h6>
                  
                  <div className="d-flex align-items-center mb-2 text-muted">
                    <i className="fas fa-calendar-alt me-2"></i>
                    <small>{new Date(image.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</small>
                  </div>
                  
                  {isOwnProfile && (
                    <div className="mt-auto d-flex gap-2">
                      <button
                        className="btn btn-warning btn-sm flex-fill"
                        onClick={() => handleEditClick(image)}
                      >
                        <i className="fas fa-edit me-1"></i>
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm flex-fill"
                        onClick={() => handleDeleteImage(`${Global.URL}eliminar/imagen/`, image)}
                      >
                        <i className="fas fa-trash me-1"></i>
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista en lista */}
      {viewMode === 'list' && (
        <div className="list-group">
          {images.map((image, index) => (
            <div key={image._id} className="list-group-item list-group-item-action">
              <div className="row align-items-center">
                <div className="col-md-2">
                  <img
                    src={`${Upload.URL}uploads/${image.path}`}
                    className="img-fluid rounded"
                    alt={image.name || `Imagen ${index + 1}`}
                    onClick={() => handleImageClick(image.path)}
                    style={{cursor: 'pointer', height: '80px', objectFit: 'cover'}}
                  />
                </div>
                <div className="col-md-6">
                  <h6 className="mb-1 fw-bold">{image.name || `Imagen ${index + 1}`}</h6>
                  <p className="mb-1 text-muted">
                    <i className="fas fa-calendar-alt me-1"></i>
                    {new Date(image.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div className="col-md-4 text-end">
                  {isOwnProfile && (
                    <div className="btn-group">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEditClick(image)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteImage(`${Global.URL}eliminar/imagen/`, image)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <ImageModal imageSrc={imageSrc} onClose={handleCloseModal} />
    </>
  );
};

ImagePerfil.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      name: PropTypes.string,
      createdAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  userName: PropTypes.string.isRequired,
  galleriesPerfil: PropTypes.array.isRequired,
};

export default ImagePerfil;