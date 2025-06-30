import { useState } from "react";
import { useSimpleForm } from "../hooks/useForm";
import { useNavigate } from "react-router-dom";
import { Global } from "../util/Global";
import axios from "axios";
import PropTypes from "prop-types";

const CarouselRegister = ({ images }) => {
  const { form, changed } = useSimpleForm({});
  const [error, setError] = useState("");
  const [selectedImageIds, setSelectedImageIds] = useState([]);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedImageIds(selected);
  };

  const handlePrivacyChange = (e) => {
    const isPublic = e.target.value === "1"; // Convertimos correctamente a booleano

    changed({
      target: { name: "public", value: JSON.parse(isPublic) }, // Se asegura que sea booleano
    });
  };

  const uploadGallery = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    // Verificar los IDs de las imágenes seleccionadas
    console.log("Selected Image IDs:", selectedImageIds);

    try {
      const body = {
        ...form, // Incluye todas las propiedades del formulario
        imageIds:
          selectedImageIds.length > 0 &&
          !(selectedImageIds.length === 1 && selectedImageIds[0] === "default")
            ? selectedImageIds
            : undefined,
        // Solo incluir si hay imágenes seleccionadas
      };

      console.log("body: " + JSON.stringify(body));

      const getCookie = (token) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${token}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
      };

      const token = getCookie("token"); // Obtiene el token de la cookie

      const response = await axios.post(`${Global.URL}galeria`, body, {
        headers: {
          "Content-Type": "application/json", // Establecer el tipo de contenido a JSON
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.status === 201) {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al subir la galería");
    }
  };

  return (
    <div className="row" id="registro-galeria">
      <h1 className="fw-bold text-center mt-5">Registrar Galería</h1>
      <div className="col-md-6 mx-auto">
        <div className="card my-3 me-5">
          <div className="card-body">
            <form id="form-galeria" onSubmit={uploadGallery}>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-4">
                <label htmlFor="name" className="form-label fw-bold">
                  Nombre *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="Nombre de la galería"
                  onChange={changed}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="images" className="form-label fw-bold">
                  Seleccionar Imágenes (opcional)
                </label>
                <select
                  id="imageIds"
                  name="imageIds"
                  className="form-control"
                  onChange={handleImageChange}
                  multiple
                >
                  <option value="default">Galeria sin Imagen</option>
                  {images.map((image) => (
                    <option key={image._id} value={image._id}>
                      {image.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="public" className="form-label fw-bold">
                  Privacidad *
                </label>
                <select
                  id="public"
                  name="public"
                  className="form-control"
                  onChange={handlePrivacyChange}
                  required
                >
                  <option value="">Seleccione la privacidad</option>
                  <option value="1">Público</option>
                  <option value="2">Privado</option>
                </select>
              </div>
              <button
                type="submit"
                className="btn btn-info text-white me-auto d-block px-2 py-2 fw-bold mt-2 mx-auto"
              >
                Registrar Galería
              </button>
            </form>
            {selectedImageIds.length > 0 && (
              <div className="mt-3">
                <h5>Imágenes Seleccionadas:</h5>
                <ul>
                  {images
                    .filter((image) => selectedImageIds.includes(image._id))
                    .map((image) => (
                      <li key={image._id}>{image.name}</li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

CarouselRegister.propTypes = {
  images: PropTypes.array.isRequired,
};

export default CarouselRegister;
