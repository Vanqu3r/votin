import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InternalNavbar from "../components/InternalNavbar";
import apiClient from "../api/client";

export default function Dashboard() {
  const [stats, setStats] = useState({
    voters: 0,
    politicians: 0,
    proposals: 0,
  });

  const [latestProposals, setLatestProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [dashboardRes, proposalsRes] = await Promise.all([
          apiClient.get("/estadisticas/dashboard"),
          apiClient.get("/propuesta/ultimas"),
        ]);

        if (dashboardRes.data) {
          setStats({
            voters: dashboardRes.data.votantes || 0,
            politicians: dashboardRes.data.politicos || 0,
            proposals: dashboardRes.data.propuestas || 0,
          });
        }

        if (proposalsRes.data) {
          setLatestProposals(proposalsRes.data);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          console.error("Error fetching data:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          <h4 className="mt-3">Cargando dashboard...</h4>
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
        {/* Sección de estadísticas */}
        <div className="row mb-4">
          {/* Tarjeta de votantes */}
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="card h-100 border-primary">
              <div className="card-body text-center">
                <h5 className="card-title">Votantes Registrados</h5>
                <h2 className="display-4 text-primary">
                  {stats.voters.toLocaleString()}
                </h2>
                <p className="text-muted">Total en el sistema</p>
              </div>
              <div className="card-footer bg-primary text-white">
                <i className="bi bi-people-fill me-2"></i>
                Última actualización: hoy
              </div>
            </div>
          </div>

          {/* Tarjeta de políticos */}
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="card h-100 border-success">
              <div className="card-body text-center">
                <h5 className="card-title">Políticos Activos</h5>
                <h2 className="display-4 text-success">
                  {stats.politicians.toLocaleString()}
                </h2>
                <p className="text-muted">En campaña actual</p>
              </div>
              <div className="card-footer bg-success text-white">
                <i className="bi bi-person-badge-fill me-2"></i>
                De partidos diferentes
              </div>
            </div>
          </div>

          {/* Tarjeta de propuestas */}
          <div className="col-md-4">
            <div className="card h-100 border-info">
              <div className="card-body text-center">
                <h5 className="card-title">Propuestas</h5>
                <h2 className="display-4 text-info">
                  {stats.proposals.toLocaleString()}
                </h2>
                <p className="text-muted">En votación</p>
              </div>
              <div className="card-footer bg-info text-white">
                <i className="bi bi-file-earmark-text-fill me-2"></i>
                Activas en votación
              </div>
            </div>
          </div>
        </div>

        {/* Sección de tabla de propuestas */}
        <div className="card shadow">
          <div className="card-header bg-dark text-white">
            <h4 className="mb-0">
              <i className="bi bi-table me-2"></i>
              Últimas Propuestas
            </h4>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Título</th>
                    <th>Político</th>
                    <th>Candidatura</th>
                    <th className="text-end">Votos</th>
                  </tr>
                </thead>
                <tbody>
                  {latestProposals.map((proposal) => (
                    <tr key={proposal._id}>
                      <td>
                        <strong>{proposal.titulo}</strong>
                        <small className="d-block text-muted">
                          {proposal.categoria}
                        </small>
                      </td>
                      <td>
                        {proposal.politico?.nombre}{" "}
                        {proposal.politico?.apellido}
                      </td>
                      <td>
                        <span className="badge bg-secondary text-capitalize">
                          {proposal.politico?.candidatura}
                        </span>
                      </td>
                      <td className="text-end">
                        <span className="badge bg-primary rounded-pill">
                          {proposal.votos?.length?.toLocaleString() || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer text-muted">
            Mostrando {latestProposals.length} de {stats.proposals} propuestas
            <Link className="btn btn-sm btn-outline-primary float-end" to="/buscar">
              Ver todas las propuestas
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
