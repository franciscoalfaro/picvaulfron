import { useState, useEffect } from "react";
import axios from "axios";
import { Global } from "../util/Global";
import Carousel from "./Carousel";
import Image from "./Image";
import User from "./user/User";
import useAuth from "../hooks/useAuth";

const GalleryPage = () => {
  const [userData, setUserData] = useState(null);
  const [previewImages, setPreviewImages] = useState([]); // Solo 6 imágenes
  const [galleryImages, setGalleryImages] = useState([]); // Todas las imágenes de las galerías
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth, token } = useAuth();

  const axiosRandomUser = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Obtener un usuario aleatorio
      const response = await axios.get(`${Global.URL}usuario/aleatorio`);
      const user = response.data.data;
      setUserData(user);

      if (user?.nameUser) {
        let imagesResponse;

        // 2. Elegir endpoint según autenticación
        if (!auth.nameUser || auth.nameUser !== user.nameUser) {
          imagesResponse = await axios.get(
            `${Global.URL}publico/usuario/${user.nameUser}`
          );
        } else {
          imagesResponse = await axios.get(
            `${Global.URL}usuario/${user.nameUser}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axiosRandomUser();
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">Cargando contenido...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger text-center">
        <i className="fas fa-exclamation-triangle me-2"></i>
        Error: {error}
      </div>
    </div>
  );
  
  if (!userData) return (
    <div className="container mt-5">
      <div className="alert alert-warning text-center">
        <i className="fas fa-info-circle me-2"></i>
        No se pudieron cargar los datos del usuario.
      </div>
    </div>
  );

  return (
    <div className="fade-in-up">
      <User
        userName={userData.nameUser}
        onNext={axiosRandomUser}
        onPrev={axiosRandomUser}
      />
      {/* maximo 6 imagenes */}
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