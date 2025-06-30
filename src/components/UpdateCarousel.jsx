import { useEffect, useState } from "react";
import { useSimpleForm } from "../hooks/useForm";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Global } from "../util/Global";

const UpdateCarousel = ({ initialData, images }) => {
  const { form, changed } = useSimpleForm(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImageIds, setSelectedImageIds] = useState([]);
  const navigate = useNavigate();

  // Inicializar el estado de imágenes seleccionadas a partir de los datos iniciales
  useEffect(() => {
    if (initialData.images && initialData.images.length > 0) {
      setSelectedImageIds(initialData.images);
    } else {
      setSelectedImageIds([]);
    }
  }, [initialData]);

  const handlePrivacyChange = (e) => {
    // Convertir "1" a true y "2" a false
    changed({
      target: { name: "public", value: e.target.value === "1" },
    });
  };

  // Función para obtener el valor de una cookie por su nombre
  const getCookie = (cookieName) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${cookieName}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const token = getCookie("token");

  // Funciones para agregar o quitar una imagen del arreglo de imágenes seleccionadas
  const addImage = (id) => {
    if (!selectedImageIds.includes(id)) {
      setSelectedImageIds([...selectedImageIds, id]);
    }
  };

  const removeImage = (id) => {
    setSelectedImageIds(selectedImageIds.filter((imgId) => imgId !== id));
  };

  // Handler para enviar la actualización de la galería
  const updateGallery = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.put(
        `${Global.URL}actualizar/galeria/${initialData._id}`,
        { ...form, imageIds: selectedImageIds },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Limpia el error luego de 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="container mt-5">
      <h2>Editar Galería</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={updateGallery}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Nombre de la Galería
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            placeholder="Ingrese el nombre"
            value={form.name || ""}
            onChange={changed}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Imágenes</label>
          <div id="imageList">
            {images.map((img) => {
              const inGallery = selectedImageIds.includes(img._id);
              return (
                <div
                  key={img._id}
                  className="gallery-item d-flex align-items-center justify-content-between border p-2 mb-2 rounded"
                >
                  <div className="d-flex align-items-center">
                    <span>{img.name}</span>
                  </div>
                  <div>
                    {inGallery ? (
                      <>
                        <i
                          className="icon ion-md-checkmark-circle mx-3 lead"
                          style={{
                            fontSize: "1.5rem",
                            color: "#0dcaf0",
                            marginRight: "10px",
                          }}
                        ></i>
                        <i
                          className="icon ion-md-trash mx-3 lead"
                          style={{
                            fontSize: "1.5rem",
                            color: "red",
                            cursor: "pointer",
                          }}
                          onClick={() => removeImage(img._id)}
                        ></i>
                      </>
                    ) : (
                      <i
                        className="icon ion-md-add-circle mx-3 lead"
                        style={{
                          fontSize: "1.5rem",
                          color: "#0dcaf0",
                          cursor: "pointer",
                        }}
                        onClick={() => addImage(img._id)}
                      ></i>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="public" className="form-label">
            Privacidad
          </label>
          <select
            className="form-select"
            id="public"
            name="public"
            value={form.public ? "1" : "2"}
            onChange={handlePrivacyChange}
          >
            <option value="">Seleccione la privacidad</option>
            <option value="1">Público</option>
            <option value="2">Privado</option>
          </select>
        </div>
        <button type="submit" className="btn btn-info text-white">
          {loading ? "Guardando cambios..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
};

UpdateCarousel.propTypes = {
  initialData: PropTypes.object,
  images: PropTypes.array.isRequired,
};

export default UpdateCarousel;
