import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Usamos useNavigate en lugar de Navigate

const useDelete = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getCookie = (tokenName) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${tokenName}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const token = getCookie("token");

  const deleteImage = async (apiUrl, id) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.delete(
        `${apiUrl}${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 204) {
        // Por ejemplo, redirigir a la página principal si la eliminación fue exitosa
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteImage, loading, error };
};

export default useDelete;
