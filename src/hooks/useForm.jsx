import { useState } from "react";

export const useForm = (initialObj = {}) => {
  const [form, setForm] = useState(initialObj);

  const changed = ({ target }) => {
    const { name, value, files } = target;

    setForm({
      ...form,
      [name]: files ? files[0] : value, // Maneja archivos si existen
    });
  };

  return {
    form,
    changed,
  };
};

export const useSimpleForm = (initialObj = {}) => {
  const [form, setForm] = useState(initialObj);

  const changed = ({ target }) => {
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  return {
    form,
    changed,
  };
};
