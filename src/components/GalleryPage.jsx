import { useState, useEffect } from "react";
import axios from "axios";
import { Global } from "../util/Global";
import Carousel from "./Carousel";
import Image from "./Image";
import User from "./user/User";
import useAuth from "../hooks/useAuth";

const GalleryPage = () => {
  const [userData, setUserData] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth, getAuthHeaders, isAuthenticated } = useAuth();

  const fetchRandomUser = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Obtener un usuario aleatorio
      const response = await axios.get(`${Global.URL}usuario/aleatorio`);
      const user = response.data.data;
      setUserData(user);

      if (user?.nameUser) {
        let imagesResponse;
        const isOwnProfile = isAuthenticated && auth.nameUser === user.nameUser;

        // 2. Elegir endpoint según autenticación
        if (isOwnProfile) {
          imagesResponse = await axios.get(
            `${Global.URL}usuario/${user.nameUser}`,
            {
              headers: getAuthHeaders(),
              withCredentials: true,
            }
          );
        } else {
          imagesResponse = await axios.get(
            `${Global.URL}publico/usuario/${user.nameUser}`
          );
        }

        // 3. Procesar imágenes
        const allImages = imagesResponse.data.data.images || [];

        // a. Tomar las primeras 6 imágenes
        let imagesSlice = allImages.slice(0, 6);

        // b. Obtener IDs de imágenes en galerías
        const galleryImageIds = user.galleries
          ? user.galleries.flatMap((gallery) =>
              gallery.images.map((img) =>
                typeof img === "object" ? img._id.toString() : img.toString()
              )
            )
          : [];

        // c. Filtrar imágenes que pertenecen a galerías
        const imagesInGallery = allImages.filter((img) =>
          galleryImageIds.includes(img._id.toString())
        );

        // d. Asegurar que haya al menos una imagen de galería en el preview
        const hasGalleryImage = imagesSlice.some((img) =>
          galleryImageIds.includes(img._id.toString())
        );

        if (!hasGalleryImage && imagesInGallery.length > 0) {
          // Reemplazar la última imagen con una de galería si es necesario
          imagesSlice[imagesSlice.length - 1] = imagesInGallery[0];
        }

        setPreviewImages(imagesSlice);
        setGalleryImages(imagesInGallery);
      } else {
        setPreviewImages([]);
        setGalleryImages([]);
      }
    } catch (error) {
      console.error("Error fetching random user:", error);
      setError("Error al cargar el contenido. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomUser();
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">Descubriendo contenido increíble...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-danger">
            <div className="card-body text-center">
              <i className="fas fa-exclamation-triangle text-danger mb-3" style={{fontSize: '3rem'}}></i>
              <h4 className="text-danger">¡Oops!</h4>
              <p className="text-muted">{error}</p>
              <button 
                className="btn btn-primary"
                onClick={fetchRandomUser}
              >
                <i className="fas fa-sync-alt me-2"></i>
                Intentar de nuevo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  if (!userData) return (
    <div className="container mt-5">
      <div className="alert alert-warning text-center">
        <i className="fas fa-info-circle me-2"></i>
        No se pudieron cargar los datos del usuario.
        <button 
          className="btn btn-primary ms-3"
          onClick={fetchRandomUser}
        >
          <i className="fas fa-sync-alt me-2"></i>
          Reintentar
        </button>
      </div>
    </div>
  );

  return (
    <div className="fade-in-up">
      <User
        userName={userData.nameUser}
        onNext={fetchRandomUser}
        onPrev={fetchRandomUser}
      />
      
      {/* Máximo 6 imágenes */}
      <Image images={previewImages} userName={userData.nameUser} />
      
      {/* Carrusel con todas las imágenes de galerías */}
      <Carousel
        galleries={userData.galleries || []}
        userName={userData.nameUser}
        images={galleryImages}
      />
    </div>
  );
};

export default GalleryPage;