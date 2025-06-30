import PropTypes from "prop-types";
import { Global, Upload } from "../util/Global";
import ImageModal from "./ImageModal";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import UpdateTest from "./UpdateTest";
import useDelete from "../hooks/useDelete";

export const ImagePerfil = ({ images, userName, galleriesPerfil }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const { auth } = useAuth();
  const [showImageEdit, setShowImageEdit] = useState(false);
  const [idImage, setIdimage] = useState(null); // Guarda el objeto o ID de la imagen

  // Llamamos al hook useDelete (ya no requiere parámetros)
  const { deleteImage } = useDelete();

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

  // Maneja el clic en el botón "Modificar" y guarda la imagen a editar
  const handleEditClick = (image) => {
    setIdimage(image); // Guarda la imagen seleccionada
    setShowImageEdit(true); // Muestra el formulario de edición
  };

  // Manejador para eliminar la imagen utilizando la función deleteImage del hook
  const handleDeleteImage = async (url, image) => {
    setIdimage(image);
    try {
      await deleteImage(url, image._id); // Pasamos la URL base y el ID de la imagen
      // Aquí puedes agregar lógica adicional, por ejemplo, refrescar la lista de imágenes
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
    }
  };

  const isOwnProfile = auth?.nameUser === userName; // Verifica si es el perfil del usuario autenticado

  if (images.length === 0) {
    return (
      <div className="text-center mt-2">
        <h3>El usuario @{userName} no tiene imágenes.</h3>
      </div>
    );
  }

  return (
    <>
      {showImageEdit ? (
        <UpdateTest
          initialData={idImage}
          galleries={galleriesPerfil}
          galleryId={galleriesPerfil._id}
        />
      ) : (
        <main className="container-xl py-3" id="imagenes">
          <ul className="row list-unstyled galeria">
            {images.map((image, index) => (
              <li key={image._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card mx-3">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleImageClick(image.path);
                    }}
                    className="images"
                  >
                    <img
                      className="card-img-top img-fluid img-gallery"
                      src={`${Upload.URL}uploads/${image.path}`}
                      alt={`Imagen ${index + 1} de la galería`}
                    />
                  </a>
                  <div className="card-body p-2">
                    <p className="card-text mb-1">{image.name}</p>
                    <p className="card-text mb-2">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </p>
                    {/* Mostrar botones solo si el usuario está autenticado y es su propio perfil */}
                    {auth.nameUser && isOwnProfile && (
                      <>
                        <button
                          className="btn btn-warning btn-md fw-bold text-white mx-2"
                          onClick={() => handleEditClick(image)}
                        >
                          Modificar
                        </button>
                        <button
                          className="btn btn-danger btn-md fw-bold mx-2"
                          onClick={() =>
                            handleDeleteImage(
                              `${Global.URL}eliminar/imagen/`,
                              image
                            )
                          }
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <ImageModal imageSrc={imageSrc} onClose={handleCloseModal} />
        </main>
      )}
    </>
  );
};

ImagePerfil.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  userName: PropTypes.string.isRequired,
  galleriesPerfil: PropTypes.array.isRequired,
};

export default ImagePerfil;
