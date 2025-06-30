import axios from "axios";
import { useEffect, useState } from "react";
import { Global } from "../util/Global";
import { useSimpleForm } from "../hooks/useForm";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const UpdateTest = ({ initialData, galleries }) => {
  const { form, changed } = useSimpleForm(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedGalleryId, setSelectedGalleryId] = useState([]);
  const navigate = useNavigate();

  const handlePrivacyChange = (e) => {
    const isPublic = e.target.value === "1";
    // Actualizamos el campo "public" en el estado del formulario
    changed({
      target: { name: "public", value: JSON.parse(isPublic) },
    });
  };

  useEffect(() => {
    if (initialData.galleries && initialData.galleries.length > 0) {
      setSelectedGalleryId(initialData.galleries[0]); // Usa el primer ID si es un array
    } else {
      setSelectedGalleryId("default"); // Sin galería
    }
  }, [initialData]);

  // Función para obtener el valor de una cookie por su nombre
  const getCookie = (cookieName) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${cookieName}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const token = getCookie("token");

  // Maneja el cambio en el select de galerías
  const handleGalleryChange = (e) => {
    setSelectedGalleryId(e.target.value);
  };

  // Crea un mapa de galerías para acceder al nombre de la galería
  const galleriesMap = galleries.reduce((map, gallery) => {
    map[gallery._id] = gallery.name; // Usa el _id de cada galería como clave y su name como valor
    return map;
  }, {});

  // Obtenemos el nombre de la galería seleccionada
  const galleryName = galleriesMap[form.galleries] || "Seleccione una galería";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Si selectedGalleryId es una cadena vacía, asignamos un arreglo vacío
      const galleryIds = selectedGalleryId === "default" ? [] : [selectedGalleryId];

      const response = await axios.put(
        `${Global.URL}actualizar/imagen/${initialData._id}`,
        {
          ...form,
          galleryIds,
        },
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

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="row" id="registro-imagen">
      <h1 className="fw-bold text-center mt-5">Editar Imagen</h1>
      <div className="col-md-6 mx-auto">
        <div className="card my-3 me-5">
          <div className="card-body">
            <form id="form-imagen" onSubmit={handleSubmit}>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-4">
                <label htmlFor="name" className="form-label fw-bold">
                  Nombre
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="image 1"
                  value={form.name || ""}
                  onChange={changed}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="public" className="form-label fw-bold">
                  Privacidad
                </label>
                <select
                  id="public"
                  name="public"
                  className="form-control"
                  value={form.public ? "1" : "2"} // Ahora coincide con las opciones del select
                  onChange={handlePrivacyChange}
                >
                  <option value="">Seleccione la privacidad</option>
                  <option value="1">Público</option>
                  <option value="2">Privado</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="galleryId" className="form-label fw-bold">
                  Incluir en galería
                </label>
                <select
                  id="galleryIds"
                  name="galleryIds"
                  className="form-control"
                  value={Array.isArray(selectedGalleryId) ? selectedGalleryId[0] : selectedGalleryId}
                  onChange={handleGalleryChange}
                >
                  <option value="default">Sin Galeria</option>
                  {galleries.map((gallery) => (
                    <option key={gallery._id} value={gallery._id}>
                      {gallery.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="btn btn-info text-white me-auto d-block px-2 py-2 fw-bold mt-2 mx-auto"
                disabled={loading}
              >
                {loading ? "Actualizando..." : "Actualizar Imagen"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

UpdateTest.propTypes = {
  initialData: PropTypes.object,
  galleries: PropTypes.array.isRequired,
};

export default UpdateTest;
