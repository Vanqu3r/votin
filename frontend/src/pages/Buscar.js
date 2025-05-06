import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import InternalNavbar from "../components/InternalNavbar";
import apiClient from "../api/client";

const PropuestasList = () => {
  const [propuestas, setPropuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("todos");
  const [selectedPropuesta, setSelectedPropuesta] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Categorías válidas para el filtro
  const CATEGORIAS = [
    "Economía y Empleo",
    "Educación",
    "Salud",
    "Seguridad",
    "Infraestructura y Transporte",
    "Medio Ambiente",
    "Gobernabilidad y Reforma Política"
  ];

  useEffect(() => {
    const fetchPropuestas = async () => {
      try {
        const response = await apiClient.get("/propuesta");
        setPropuestas(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPropuestas();
  }, []);

  // Abrir modal con los detalles de la propuesta
  const handlePropuestaClick = (propuesta) => {
    setSelectedPropuesta(propuesta);
    setShowModal(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPropuesta(null);
  };

  // Filtrar propuestas basado en búsqueda y filtro
  const filteredPropuestas = propuestas.filter((propuesta) => {
    const matchesSearch =
      propuesta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      propuesta.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (propuesta.politico && 
        `${propuesta.politico.nombre} ${propuesta.politico.apellido}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesCategoria =
      filterCategoria === "todos" ||
      propuesta.categoria.toLowerCase() === filterCategoria.toLowerCase();

    return matchesSearch && matchesCategoria;
  });

  /* if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  } */

  if (error) {
    return (
      <div className="alert alert-danger my-4">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        Error al cargar las propuestas: {error}
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
              <i className="bi bi-lightbulb-fill me-2"></i>
              Lista de Propuestas
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
                    placeholder="Buscar por título, descripción o político..."
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
                    value={filterCategoria}
                    onChange={(e) => setFilterCategoria(e.target.value)}
                  >
                    <option value="todos">Todas las categorías</option>
                    {CATEGORIAS.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tabla de resultados */}
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th>Político</th>
                    <th>N Votos</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPropuestas.length > 0 ? (
                    filteredPropuestas.map((propuesta) => (
                      <tr 
                        key={propuesta._id} 
                        onClick={() => handlePropuestaClick(propuesta)}
                        style={{ cursor: 'pointer' }}
                        className="hover-row"
                      >
                        <td>
                          <div className="fw-bold">{propuesta.titulo}</div>
                        </td>
                        <td>
                          <div className="text-truncate" style={{maxWidth: "300px"}}>
                            {propuesta.descripcion}
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-info text-dark">
                            {propuesta.categoria}
                          </span>
                        </td>
                        <td>
                          {propuesta.politico ? (
                            <div className="d-flex align-items-center">
                              <div className="symbol symbol-40px symbol-circle me-3">
                                {propuesta.politico.photoURL ? (
                                  <img
                                    src={propuesta.politico.photoURL}
                                    alt={`${propuesta.politico.nombre} ${propuesta.politico.apellido}`}
                                    className="img-fluid rounded-circle"
                                    style={{ width: "40px", height: "40px" }}
                                    loading="lazy"
                                  />
                                ) : (
                                  <span className="symbol-label bg-light-primary text-primary fs-6 fw-bold">
                                    {propuesta.politico.nombre?.charAt(0)}
                                    {propuesta.politico.apellido?.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <div>
                                <div className="fw-bold">
                                  {propuesta.politico.nombre} {propuesta.politico.apellido}
                                </div>
                                <div className="text-muted">
                                  {propuesta.politico.candidatura}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted">No disponible</span>
                          )}
                        </td>
                        <td>
                          {propuesta.votos ? (
                            <span className="badge bg-success text-white">
                              {propuesta.votos.length} Votos
                            </span>
                          ) : (
                            <span className="badge bg-secondary text-black">
                              0 Votos
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        <i className="bi bi-emoji-frown display-6 text-muted"></i>
                        <h5 className="mt-2">No se encontraron propuestas</h5>
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
              Mostrando {filteredPropuestas.length} de {propuestas.length} propuestas
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

      {/* Modal de Detalles */}
      {selectedPropuesta && (
        <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-info-circle-fill me-2"></i>
                  Detalles de la Propuesta
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-8">
                    <h4 className="mb-3">{selectedPropuesta.titulo}</h4>
                    <div className="mb-4">
                      <h6>Descripción:</h6>
                      <p className="text-muted">{selectedPropuesta.descripcion}</p>
                    </div>
                    
                    <div className="mb-3">
                      <span className="badge bg-info text-dark fs-6">
                        {selectedPropuesta.categoria}
                      </span>
                    </div>

                    <div className="mb-3">
                      <h6>Votos:</h6>
                      <span className="badge bg-success text-white fs-6">
                        {selectedPropuesta.votos?.length || 0} Votos
                      </span>
                    </div>
                  </div>

                  <div className="col-md-4 border-start">
                    <h5 className="mb-3">Información del Político</h5>
                    {selectedPropuesta.politico ? (
                      <div className="text-center">
                        <div className="mb-3">
                          {selectedPropuesta.politico.photoURL ? (
                            <img
                              src={selectedPropuesta.politico.photoURL}
                              alt={`${selectedPropuesta.politico.nombre} ${selectedPropuesta.politico.apellido}`}
                              className="img-fluid rounded-circle"
                              style={{ width: "120px", height: "120px" }}
                              loading="lazy"
                            />
                          ) : (
                            <div className="symbol symbol-120px symbol-circle bg-light-primary">
                              <span className="symbol-label text-primary fs-3 fw-bold">
                                {selectedPropuesta.politico.nombre?.charAt(0)}
                                {selectedPropuesta.politico.apellido?.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <h5>
                          {selectedPropuesta.politico.nombre} {selectedPropuesta.politico.apellido}
                        </h5>
                        <p className="text-muted">
                          <i className="bi bi-person-badge me-2"></i>
                          {selectedPropuesta.politico.candidatura}
                        </p>
                        <p>
                          <i className="bi bi-envelope me-2"></i>
                          <a href={`mailto:${selectedPropuesta.politico.correo}`}>
                            {selectedPropuesta.politico.correo}
                          </a>
                        </p>
                        <p>
                          <i className="bi bi-geo-alt me-2"></i>
                          {selectedPropuesta.politico.ciudad}, {selectedPropuesta.politico.estado}
                        </p>
                      </div>
                    ) : (
                      <div className="alert alert-warning">
                        Información del político no disponible
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCloseModal}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
          {showModal && (
            <div 
                    onClick={handleCloseModal}
            ></div>
        )}
        </div>
      )}
    </>
  );
};

export default PropuestasList;