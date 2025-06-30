import PropTypes from "prop-types";

const ImageModal = ({ imageSrc, onClose }) => {
  return (
    <div className="modal fade" id="modal-imagen" data-bs-backdrop="true">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body modal-gallery">
            {imageSrc && (
              <img src={imageSrc} className="img-fluid" alt="Imagen Galería" style={{
                maxWidth: "300px",    // Limita el ancho máximo a 300px
                width: "100%",        // Asegura que la imagen se ajuste al contenedor si es menor a 300px
                objectFit: "contain", // Evita que la imagen se deforme
                height: "auto",       // Mantiene la proporción
              }}/>
            )}
          </div>
          <button
            type="button"
            className="btn-close position-absolute top-0 end-0 m-3"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
};

ImageModal.propTypes = {
  imageSrc: PropTypes.string,
  onClose: PropTypes.func.isRequired, // Valida que onClose sea una función
};

export default ImageModal;
