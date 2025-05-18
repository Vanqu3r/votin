import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import InternalNavbar from "../components/InternalNavbar";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";

const PropuestasList = () => {
  const { user } = useAuth();
  const [propuestas, setPropuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("todos");
  const [selectedPropuesta, setSelectedPropuesta] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortOption, setSortOption] = useState("votos_desc");
  const [myVotes, setMyVotes] = useState("todas"); // "mis_votadas" o "todas"
  const [myProposals, setMyProposals] = useState("todas"); // "mis_propuestas" o "todas"
const [likedProposals, setLikedProposals] = useState([]);

// Verificar si la propuesta actual está marcada como "me gusta"
const isLiked = likedProposals.includes(selectedPropuesta?._id);
const handleLikePropuesta = async (propuestaId) => {
  if (!user) {
    alert('Debes iniciar sesión para votar');
    return;
  }

  try {
    const isCurrentlyLiked = likedProposals.includes(propuestaId);
    
    if (isCurrentlyLiked) {
      // Eliminar voto
      await apiClient.delete('/votes', {
        data: {
          id_propuesta: propuestaId,
          id_votante: user.uid
        }
      });
      setLikedProposals(likedProposals.filter(id => id !== propuestaId));
    } else {
      // Agregar voto
      await apiClient.post('/votes', {
        id_propuesta: propuestaId,
        id_votante: user.uid
      });
      setLikedProposals([...likedProposals, propuestaId]);
    }

    // Actualizar la lista de propuestas
    const updatedPropuestas = propuestas.map(propuesta => {
      if (propuesta._id === propuestaId) {
        const votes = propuesta.votos || [];
        return {
          ...propuesta,
          votos: isCurrentlyLiked 
            ? votes.filter(v => v.id_votante !== user.uid)
            : [...votes, { id_votante: user.uid, fecha_voto: new Date().toISOString() }]
        };
      }
      return propuesta;
    });
    setPropuestas(updatedPropuestas);
    
  } catch (error) {
    console.error("Error al votar:", error);
    alert(`Error: ${error.response?.data?.message || error.message}`);
  }
};
  // Handler para cambios en filtro de votante
  const handleMyVotesChange = (e) => {
    setMyVotes(e.target.value);
  };

  // Handler para cambios en filtro de candidato
  const handleMyProposalsChange = (e) => {
    setMyProposals(e.target.value);
  };

  // Categorías válidas para el filtro
  const CATEGORIAS = [
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

  useEffect(() => {
    const fetchPropuestas = async () => {
      try {
        setLoading(true);
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

  const handleDeletePropuesta = async (propuestaId) => {
    if (!user) {
      alert('Debes iniciar sesión para realizar esta acción');
      return;
    }

    if (!window.confirm('¿Estás seguro de eliminar esta propuesta?')) {
      return;
    }

    try {
      await apiClient.delete(`/propuesta/${propuestaId}`);
      setPropuestas(propuestas.filter(p => p._id !== propuestaId));
      setShowModal(false);
      alert('Propuesta eliminada correctamente');
    } catch (error) {
      console.error("Error eliminando propuesta:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
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

    const matchesVotes = user?.tipo !== 'votante' ||
      myVotes === 'todas' ||
      (propuesta.votos && propuesta.votos.includes(user.uid));

    // Filtro adicional para candidatos
    const matchesProposals = user?.tipo !== 'candidato' ||
      myProposals === 'todas' ||
      (propuesta.politico && propuesta.politico._id === user.uid);

    return matchesSearch && matchesCategoria && matchesVotes && matchesProposals;
  });

  const sortedPropuestas = filteredPropuestas.sort((a, b) => {
      const filtered = filteredPropuestas.filter(propuesta => {
    if (user?.tipo === 'votante' && myVotes === 'mis_votadas') {
      return propuesta.votos && propuesta.votos.includes(user.uid);
    }
    if (user?.tipo === 'candidato' && myProposals === 'mis_propuestas') {
      return propuesta.politico && propuesta.politico._id === user.uid;
    }
    return true;
  });
     return filtered.sort((a, b) => {
    const votosA = a.votos?.length || 0;
    const votosB = b.votos?.length || 0;

    const fechaA =
      new Date(a.fecha_creacion?.$date || a.fecha_creacion || 0).getTime() || 0;
    const fechaB =
      new Date(b.fecha_creacion?.$date || b.fecha_creacion || 0).getTime() || 0;

    switch (sortOption) {
      case "votos_desc":
        return votosB - votosA;
      case "votos_asc":
        return votosA - votosB;
      case "fecha_desc":
        return fechaB - fechaA;
      case "fecha_asc":
        return fechaA - fechaB;
      default:
        return 0;
    }
    });
  });

  if (loading)
    return (
      <>
        <InternalNavbar />
        <div className="container mt-5 text-center">
          <div
            className="spinner-border text-primary"
            style={{ width: "2rem", height: "2rem" }}
            role="status"
          >
            <span className="visually-hidden">Cargando...</span>
          </div>
          <h4 className="mt-3">Cargando propuestas...</h4>
          <p>Esto puede tomar unos momentos</p>
        </div>
      </>
    );

  if (error)
    return <div className="alert alert-danger my-5">Error: {error}</div>;

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
              <div className="col-md-3 mb-3 mb-md-0">
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

              <div className="col-md-3 mb-3 mb-md-0">
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

              <div className="col-md-3 mb-3 mb-md-0">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-sort-down"></i>
                  </span>
                  <select
                    className="form-select"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="votos_desc">Más votadas</option>
                    <option value="votos_asc">Menos votadas</option>
                    <option value="fecha_desc">Más recientes</option>
                    <option value="fecha_asc">Más antiguas</option>
                  </select>
                </div>
              </div>

              {(() => {
                // Mostrar botón solo si tiene permisos
                try {
                  if (user.tipo === 'votante') {
                    return (
                      <>
                        <div className="col-md-3 mb-3 mb-md-0">
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-sort-down"></i>
                            </span>
                            <select
                              className="form-select"
                              value={myVotes}
                              onChange={handleMyVotesChange}
                            >
                              <option value="todas">Todas</option>
                              <option value="mis_votadas">Mis Votadas</option>
                            </select>
                          </div>
                        </div>
                      </>
                    );
                  }
                  if (user.tipo === 'candidato') {
                    return (
                      <>
                        <div className="col-md-3 mb-3 mb-md-0">
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-sort-down"></i>
                            </span>
                            <select
                              className="form-select"
                              value={myProposals}
                              onChange={handleMyProposalsChange}
                            >
                              <option value="todas">Todas las Propuestas</option>
                              <option value="mis_propuestas">Mis Propuestas</option>
                            </select>
                          </div>
                        </div>
                      </>
                    );
                  }
                } catch (e) {
                  return null;
                }
              })()}



            </div>

            {/* Tabla de resultados */}
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Título</th>
                    {/* <th>Descripción</th> */}
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
                        style={{ cursor: "pointer" }}
                        className="hover-row"
                      >
                        <td>
                          <div className="fw-bold">
                            {propuesta.titulo.length > 45
                              ? propuesta.titulo.slice(0, 45) + "..."
                              : propuesta.titulo}
                          </div>
                        </td>
                        {/* <td>
                          <div className="text-truncate" style={{maxWidth: "300px"}}>
                            {propuesta.descripcion}
                          </div>
                        </td> */}
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
                                  {propuesta.politico.nombre}{" "}
                                  {propuesta.politico.apellido}
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
              Mostrando {filteredPropuestas.length} de {propuestas.length}{" "}
              propuestas
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
        <div
          className={`modal fade ${showModal ? "show" : ""}`}
          style={{ display: showModal ? "block" : "none" }}
        >
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
                    {selectedPropuesta.fecha_creacion && (
                      <div className="mb-3">
                        <i className="bi bi-calendar me-2"></i>
                        <span className="text-muted">
                          Creada el{" "}
                          {new Date(
                            selectedPropuesta.fecha_creacion.$date ||
                            selectedPropuesta.fecha_creacion
                          ).toLocaleDateString("es-MX", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                    <div className="mb-4">
                      {user && selectedPropuesta && (() => {
                        // Verificar si es administrador
                        const isAdmin = user.tipo === 'administrador';

                        // Verificar si es candidato y dueño de la propuesta
                        const isOwner = selectedPropuesta.politico &&
                          selectedPropuesta.politico._id === user.uid;
                        // Mostrar botón solo si tiene permisos
                        try {
                          if (isAdmin || (user.tipo === 'candidato' && isOwner)) {
                            return (
                              <>
                                <h6>Valoracion:</h6>
                                <p className="text-muted">
                                  {selectedPropuesta.valoracion[0]}-
                                  {selectedPropuesta.valoracion[1]}-
                                  {selectedPropuesta.valoracion[2]}
                                </p>
                              </>
                            );
                          }
                        } catch (e) {
                          return null;
                        }
                      })()}
                    </div>
                    <div className="mb-4">
                      <h6>Descripción:</h6>
                      <p className="text-muted">
                        {selectedPropuesta.descripcion}
                      </p>
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
                          {selectedPropuesta.politico.nombre}{" "}
                          {selectedPropuesta.politico.apellido}
                        </h5>
                        <p className="text-muted">
                          <i className="bi bi-person-badge me-2"></i>
                          {selectedPropuesta.politico.candidatura}
                        </p>
                        <p>
                          <i className="bi bi-envelope me-2"></i>
                          <a
                            href={`mailto:${selectedPropuesta.politico.correo}`}
                          >
                            {selectedPropuesta.politico.correo}
                          </a>
                        </p>
                        <p>
                          <i className="bi bi-geo-alt me-2"></i>
                          {selectedPropuesta.politico.ciudad},{" "}
                          {selectedPropuesta.politico.estado}
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
                {/* Botón de eliminar con control de acceso */}
                {user && selectedPropuesta && (() => {
                  // Verificar si es administrador
                  const isAdmin = user.tipo === 'administrador';

                  // Verificar si es candidato y dueño de la propuesta
                  const isOwner = selectedPropuesta.politico &&
                    selectedPropuesta.politico._id === user.uid;

                  // Mostrar botón solo si tiene permisos
                  if (isAdmin || (user.tipo === 'candidato' && isOwner)) {
                    return (
                      <button
                        type="button"
                        className="btn btn-danger me-auto"
                        onClick={() => handleDeletePropuesta(selectedPropuesta._id)}
                      >
                        <i className="bi bi-trash-fill me-2"></i>
                        Eliminar Propuesta
                      </button>
                    );
                  }
                  if (user.tipo === 'votante') {
  return (
    <div className="d-flex align-items-center">
      {/* Botón de Me Gusta */}
      <button
        type="button"
        className="btn btn-outline-danger me-2"
        onClick={() => handleLikePropuesta(selectedPropuesta._id)}
      >
        <i className={`bi ${selectedPropuesta.meGusta ? 'bi-heart-fill' : 'bi-heart'}`}></i>
      </button>
      
      {/* Botón de Eliminar (si es necesario) */}
      <button
        type="button"
        className="btn btn-danger me-auto"
        onClick={() => handleDeletePropuesta(selectedPropuesta._id)}
      >
        <i className="bi bi-trash-fill me-2"></i>
        Eliminar Propuesta
      </button>
    </div>
  );
}
                  return null;
                })()}

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
          {showModal && <div onClick={handleCloseModal}></div>}
        </div>
      )}
    </>
  );
};

export default PropuestasList;
