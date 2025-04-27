import React from "react";
import { useNavigate } from "react-router-dom";
import InternalNavbar from "../components/InternalNavbar";

export default function Dashboard() {
  // const navigate = useNavigate();

  // Datos de ejemplo
  const stats = {
    voters: 12543,
    politicians: 87,
    proposals: 215,
  };

  const proposals = [
    {
      id: 1,
      title: "Reforma educativa",
      politician: "María González",
      candidacy: "Alcaldía",
      votes: 4521,
    },
    {
      id: 2,
      title: "Nuevo hospital",
      politician: "Carlos Mendoza",
      candidacy: "Gobernación",
      votes: 3876,
    },
    {
      id: 3,
      title: "Mejora vial",
      politician: "Ana Torres",
      candidacy: "Concejo",
      votes: 2987,
    },
    {
      id: 4,
      title: "Programa juvenil",
      politician: "Luis Ramírez",
      candidacy: "Alcaldía",
      votes: 2453,
    },
    {
      id: 5,
      title: "Seguridad pública",
      politician: "Patricia Sánchez",
      candidacy: "Gobernación",
      votes: 5120,
    },
  ];

  // VALIDAR QUE EL USUARIO ESTÉ LOGUEADO
  /* useEffect(() => {
    // Solo redirige cuando la carga ha terminado Y no hay usuario
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]); */

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
                De 5 partidos diferentes
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
                15 nuevas esta semana
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
                  {proposals.map((proposal) => (
                    <tr key={proposal.id}>
                      <td>
                        <strong>{proposal.title}</strong>
                      </td>
                      <td>{proposal.politician}</td>
                      <td>
                        <span className="badge bg-secondary">
                          {proposal.candidacy}
                        </span>
                      </td>
                      <td className="text-end">
                        <span className="badge bg-primary rounded-pill">
                          {proposal.votes.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer text-muted">
            Mostrando {proposals.length} de {stats.proposals} propuestas
            <button className="btn btn-sm btn-outline-primary float-end">
              Ver todas las propuestas
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
