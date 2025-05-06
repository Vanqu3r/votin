import React, { useState } from "react";
import InternalNavbar from "../components/InternalNavbar";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";

const CrearPropuesta = ({ onSubmit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });

  const categories = [
    "Economía y Empleo",
    "Educación",
    "Salud",
    "Seguridad y Justicia",
    "Medio Ambiente",
    "Infraestructura y Transporte",
    "Política Social y Derechos Humanos",
    "Gobernabilidad y Reforma Política",
    "Cultura, Ciencia y Tecnología",
    "Relaciones Exteriores",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await apiClient.get(`politico/${user.uid}`);
      if (!res.data.validacion) {
        alert(
          "El político no está validado. No puede crear propuestas. Espera a que un administrador valide tu cuenta."
        );
        return;
      }
    } catch (error) {
      console.error("Error al obtener el político:", error);
      return;
    }

    if (formData.title && formData.description && formData.category) {
      try {
        const propuesta = {
          id_politico: user.uid, // Cambia esto por el ID del político autenticado
          titulo: formData.title,
          descripcion: formData.description,
          categoria: formData.category,
        };

        const response = await apiClient.post("propuesta", propuesta);

        console.log("Respuesta del servidor:", response.data);

        if (response.data?.id) {
          alert("Propuesta creada con éxito");
        }
      } catch (error) {
        console.error("Error al crear la propuesta:", error);
        alert("Error al crear la propuesta. Por favor, inténtelo de nuevo.");
      }
      // Reset form after submission
      setFormData({
        title: "",
        description: "",
        category: "",
      });
    } else {
      alert("Por favor complete todos los campos requeridos");
    }
  };

  return (
    <>
      <InternalNavbar />
      <div className="card shadow-sm border-0 mt-4 mx-4">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            <i className="bi bi-file-earmark-plus me-2"></i>
            Crear Nueva Propuesta
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Campo Título */}
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Título de la Propuesta <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej: Reforma al sistema de pensiones"
                required
              />
              <div className="form-text">
                Un título claro y conciso que describa la propuesta
              </div>
            </div>

            {/* Campo Descripción */}
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Descripción Detallada <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describa en detalle la propuesta, sus objetivos, implementación y beneficios esperados..."
                required
              ></textarea>
              <div className="form-text">
                Mínimo 200 caracteres. Sea lo más específico posible.
              </div>
            </div>

            {/* Campo Categoría */}
            <div className="mb-4">
              <label htmlFor="category" className="form-label">
                Categoría <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una categoría</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="form-text">
                Seleccione el área principal que aborda esta propuesta
              </div>
            </div>

            {/* Botones de acción */}
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() =>
                  setFormData({
                    title: "",
                    description: "",
                    category: "",
                  })
                }
              >
                <i className="bi bi-x-circle me-2"></i>
                Limpiar Formulario
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-save me-2"></i>
                Crear Propuesta
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CrearPropuesta;
