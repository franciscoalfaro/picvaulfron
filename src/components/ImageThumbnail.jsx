import { useState } from 'react';
import ImageModal from './ImageModal';
import PropTypes from 'prop-types';

const ImageThumbnail = ({ imagePath }) => {
  const [imageSrc, setImageSrc] = useState(null);

  const handleImageClick = () => {
    setImageSrc(imagePath);
    const modal = new window.bootstrap.Modal(document.getElementById('modal-imagen'));
    modal.show();
  };

  const handleCloseModal = () => {
    setImageSrc(null);
  };

  return (
    <>
      <div onClick={handleImageClick} className="image-thumbnail">
        <img src={imagePath} alt="Thumbnail" />
      </div>
      <ImageModal imageSrc={imageSrc} onClose={handleCloseModal} />
    </>
  );
};

ImageThumbnail.propTypes = {
    imagePath: PropTypes.string.isRequired,
  };

export default ImageThumbnail;
