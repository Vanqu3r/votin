import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import InternalNavbar from "../components/InternalNavbar";
import apiClient from "../api/client"; // Asegúrate de que la ruta sea correcta

const Validacion = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCandidatura, setFilterCandidatura] = useState("todos");

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        // Simulación de llamada a API - reemplaza con tu llamada real
        const response = await apiClient.get("/politico");
        setCandidates(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Función para validar candidato
  const validarCandidato = async (candidate_id) => {
    try {
      const response = await apiClient.put(`/politico/${candidate_id}`, {
        validacion: true,
      });
      if (response.data._id) {
        alert("Candidato validado correctamente.");
        setCandidates((prevCandidates) =>
          prevCandidates.map((candidate) =>
            candidate._id === candidate_id
              ? { ...candidate, validacion: true }
              : candidate
          )
        );
      }
    } catch (err) {
      alert("Error al validar candidato: " + err.message);
    }
  };

  // Función para eliminar candidato
  const eliminarCandidato = async (candidate_id) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar este candidato?")
    ) {
      try {
        const response = await apiClient.delete(`/politico/${candidate_id}`);
        if (response.data.message) {
          alert("Candidato eliminado correctamente.");
          setCandidates((prevCandidates) =>
            prevCandidates.filter((candidate) => candidate._id !== candidate_id)
          );
        }
      } catch (err) {
        alert("Error al eliminar candidato: " + err.message);
      }
    }
  };

  // Filtrar candidatos basado en búsqueda y filtro
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      `${candidate.nombre} ${candidate.apellido}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      candidate.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.ciudad.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCandidatura =
      filterCandidatura === "todos" ||
      candidate.candidatura.toLowerCase() === filterCandidatura.toLowerCase();

    return matchesSearch && matchesCandidatura;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-4">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        Error al cargar los candidatos: {error}
      </div>
    );
  }

  return (
    <>
      <InternalNavbar />
      <div className="container-fluid p-4">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">
              <i className="bi bi-people-fill me-2"></i>
              Lista de Candidatos
            </h3>
          </div>

          <div className="card-body">
            {/* Controles de búsqueda y filtro */}
            <div className="row mb-4">
              <div className="col-md-6 mb-3 mb-md-0">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por nombre, correo o ciudad..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-funnel-fill"></i>
                  </span>
                  <select
                    className="form-select"
                    value={filterCandidatura}
                    onChange={(e) => setFilterCandidatura(e.target.value)}
                  >
                    <option value="todos">Todos los cargos</option>
                    <option value="presidente">Presidente</option>
                    <option value="gobernador">Gobernador</option>
                    <option value="presidente municipal">
                      Presidente municipal
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tabla de resultados */}
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Candidato</th>
                    <th>Contacto</th>
                    <th>Ubicación</th>
                    <th>Candidatura</th>
                    <th>Validación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.length > 0 ? (
                    filteredCandidates.map((candidate) => (
                      <tr key={candidate._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="symbol symbol-40px symbol-circle me-3">
                              {candidate.photoURL ? (
                                <img
                                  src={
                                    candidate.photoURL ||
                                    candidate.nombre.charAt(0) +
                                      candidate.apellido.charAt(0)
                                  }
                                  alt="Foto de perfil"
                                  className="img-fluid rounded-circle"
                                  style={{ width: "40px", height: "40px" }}
                                />
                              ) : (
                                <span className="symbol-label bg-light-primary text-primary fs-6 fw-bold">
                                  {candidate.nombre.charAt(0)}
                                  {candidate.apellido.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="fw-bold">
                                {candidate.nombre} {candidate.apellido}
                              </div>
                              <div className="text-muted">
                                {candidate.edad} años
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <a
                            href={`mailto:${candidate.correo}`}
                            className="text-primary"
                          >
                            {candidate.correo}
                          </a>
                        </td>
                        <td>
                          <div>{candidate.colonia}</div>
                          <div className="text-muted">
                            {candidate.ciudad}, {candidate.estado}
                          </div>
                          <div className="text-muted">
                            CP: {candidate.codigo_postal}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              candidate.candidatura === "presidente"
                                ? "bg-danger"
                                : candidate.candidatura === "gobernador"
                                ? "bg-warning text-dark"
                                : candidate.candidatura === "presidente municipal"
                                ? "bg-info text-dark"
                                : "bg-secondary"
                            }`}
                          >
                            {candidate.candidatura}
                          </span>
                        </td>
                        <td>
                          {candidate.validacion ? (
                            <span className="badge bg-success">
                              <i className="bi bi-check-circle-fill me-1"></i>
                              Validado
                            </span>
                          ) : (
                            <span className="badge bg-warning text-dark">
                              <i className="bi bi-exclamation-triangle-fill me-1"></i>
                              Pendiente
                            </span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() =>
                              window.open(candidate.cedula_politica, "_blank")
                            }
                          >
                            <i className="bi bi-file-earmark-pdf-fill me-1"></i>
                            Cédula
                          </button>

                          <button
                            className="btn btn-sm btn-outline-success me-2"
                            onClick={() => validarCandidato(candidate._id)}
                          >
                            <i className="bi bi-check-circle-fill me-1"></i>
                            Validar
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger me-2"
                            onClick={() => eliminarCandidato(candidate._id)}
                          >
                            <i className="bi bi-trash-fill me-1"></i>
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <i className="bi bi-emoji-frown display-6 text-muted"></i>
                        <h5 className="mt-2">No se encontraron candidatos</h5>
                        <p className="text-muted">
                          Intenta con otros términos de búsqueda
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-footer d-flex justify-content-between align-items-center">
            <div className="text-muted">
              Mostrando {filteredCandidates.length} de {candidates.length}{" "}
              candidatos
            </div>
            <div>
              <button className="btn btn-sm btn-outline-primary me-2">
                <i className="bi bi-arrow-left"></i>
              </button>
              <button className="btn btn-sm btn-outline-primary">
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Validacion;
