import React, { useState, useEffect } from "react";
import InternalNavbar from "../components/InternalNavbar";
import apiClient from "../api/client"; // Asegúrate de que la ruta sea correcta
import { useAuth } from "../context/AuthContext";

const MiPerfil = () => {
  const { user, isLoading } = useAuth();
  const [usuario, setUsuario] = useState({
    _id: "",
    nombre: "",
    apellido: "",
    edad: 0,
    correo: "",
    codigo_postal: "",
    colonia: "",
    ciudad: "",
    estado: "",
    candidatura: "",
    cedula_politica: "",
  });

  const [editando, setEditando] = useState(false);

  // Realizar petición a la API para obtener los datos del usuario
  useEffect(() => {
    if (!isLoading && user) {
      if (user.uid && user.tipo === "votante") {
        const cargarDatos = async () => {
          const response = await apiClient.get(`votante/${user.uid}`);
          setUsuario(response.data);
        };
        cargarDatos();
      } else if (user.uid && user.tipo === "candidato") {
        const cargarDatos = async () => {
          const response = await apiClient.get(`politico/${user.uid}`);
          console.log(response.data);

          setUsuario(response.data);
        };
        cargarDatos();
      } else if (user.uid && user.tipo === "administrador") {
        const cargarDatos = async () => {
          const response = await apiClient.get(`administrador/${user.uid}`);
          setUsuario(response.data);
        };
        cargarDatos();
      }
    }
  }, [isLoading, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({
      ...prev,
      [name]: name === "edad" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría tu llamada Axios para guardar los cambios
    // await axios.put(`tu_endpoint/${usuario._id}`, usuario);
    setEditando(false);
    alert("Datos guardados correctamente");
  };

  return (
    <>
      <InternalNavbar />
      <div className="container my-5">
        <form onSubmit={handleSubmit}>
          {/* DATOS PERSONALES */}
          <fieldset className="mb-4 border rounded p-3">
            <legend className="w-auto px-2">Datos Personales</legend>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={usuario.nombre}
                  onChange={handleChange}
                  readOnly={!editando}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Apellido</label>
                <input
                  type="text"
                  className="form-control"
                  name="apellido"
                  value={usuario.apellido}
                  onChange={handleChange}
                  readOnly={!editando}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <label className="form-label">Edad</label>
                <input
                  type="number"
                  className="form-control"
                  name="edad"
                  value={usuario.edad}
                  onChange={handleChange}
                  readOnly={!editando}
                />
              </div>
              <div className="col-md-8">
                <label className="form-label">Correo</label>
                <input
                  type="email"
                  className="form-control"
                  name="correo"
                  value={usuario.correo}
                  onChange={handleChange}
                  readOnly="true"
                />
              </div>
            </div>
          </fieldset>

          {/* DATOS DE UBICACIÓN */}
          {user && user.tipo !== "administrador" && (
            <fieldset className="mb-4 border rounded p-3">
              <legend className="w-auto px-2">Datos de Ubicación</legend>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Código Postal</label>
                  <input
                    type="text"
                    className="form-control"
                    name="codigo_postal"
                    value={usuario.codigo_postal}
                    onChange={handleChange}
                    readOnly={!editando}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Colonia</label>
                  <input
                    type="text"
                    className="form-control"
                    name="colonia"
                    value={usuario.colonia}
                    onChange={handleChange}
                    readOnly={!editando}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Ciudad</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ciudad"
                    value={usuario.ciudad}
                    onChange={handleChange}
                    readOnly={!editando}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">Estado</label>
                  <input
                    type="text"
                    className="form-control"
                    name="estado"
                    value={usuario.estado}
                    onChange={handleChange}
                    readOnly={!editando}
                  />
                </div>
              </div>
            </fieldset>
          )}

          {/* DATOS DE CANDIDATURA */}
          {user && user.tipo === "candidato" && (
            <fieldset className="mb-4 border rounded p-3">
              <legend className="w-auto px-2">Datos de Candidatura</legend>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Tipo de Candidato</label>
                  <select
                    className="form-select"
                    name="candidato"
                    value={usuario.candidatura}
                    onChange={handleChange}
                    disabled={!editando}
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="presidente">Presidente</option>
                    <option value="gobernador">Gobernador</option>
                    <option value="presidente municipal">
                      Presidente municipal
                    </option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Cédula Política</label>
                  <a
                    className="form-control btn btn-sm btn-outline-primary me-2"
                    href={usuario.cedula_politica}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver Cédula Política
                  </a>
                </div>
              </div>
            </fieldset>
          )}

          {/* BOTONES */}
          {user && user.tipo !== "administrador" && (
            <div className="d-flex justify-content-end gap-2">
              {!editando ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setEditando(true)}
                >
                  Editar
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditando(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    Guardar Cambios
                  </button>
                </>
              )}
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default MiPerfil;
