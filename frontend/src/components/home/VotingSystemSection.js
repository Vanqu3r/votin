import React from "react";

const VotingSystemSection = () => {
  return (
    <div className="container py-5 rounded-4">
      <div className="row justify-content-center">
        <div className="col-lg-10 text-center mb-5">
          <p className="lead">
            Nuestra plataforma identifica automáticamente las propuestas que
            mejor representan tus convicciones
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* Paso 1 */}
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <span className="badge bg-primary rounded-circle me-3 p-3">
                  1
                </span>
                <h3 className="h5 mb-0">Perfil Ideológico</h3>
              </div>
              <p className="text-muted">
                Completa nuestro formulario estructurado que analiza tus
                posturas en economía, educación, salud, seguridad y derechos
                sociales.
              </p>
              <ul className="list-unstyled text-muted">
                <li className="mb-2">
                  <span className="bi bi-check-circle-fill text-success me-2"></span>
                  Preguntas científicamente validadas
                </li>
                <li className="mb-2">
                  <span className="bi bi-check-circle-fill text-success me-2"></span>
                  Análisis multidimensional
                </li>
                <li>
                  <span className="bi bi-check-circle-fill text-success me-2"></span>
                  Privacidad garantizada
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Paso 2 */}
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <span className="badge bg-primary rounded-circle me-3 p-3">
                  2
                </span>
                <h3 className="h5 mb-0">Matching Automatizado</h3>
              </div>
              <p className="text-muted">
                Nuestro algoritmo compara tus respuestas con las propuestas de
                todos los candidatos registrados.
              </p>
              <ul className="list-unstyled text-muted">
                <li className="mb-2">
                  <span className="bi bi-check-circle-fill text-success me-2"></span>
                  Base de datos completa de propuestas
                </li>
                <li className="mb-2">
                  <span className="bi bi-check-circle-fill text-success me-2"></span>
                  Ponderación por temas prioritarios
                </li>
                <li>
                  <span className="bi bi-check-circle-fill text-success me-2"></span>
                  Actualización en tiempo real
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Paso 3 */}
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <span className="badge bg-primary rounded-circle me-3 p-3">
                  3
                </span>
                <h3 className="h5 mb-0">Voto Inteligente</h3>
              </div>
              <p className="text-muted">
                Generamos tu papeleta electoral optimizada que refleja fielmente
                tus convicciones políticas.
              </p>
              <ul className="list-unstyled text-muted">
                <li className="mb-2">
                  <span className="bi bi-check-circle-fill text-success me-2"></span>
                  Simulación verificable
                </li>
                <li className="mb-2">
                  <span className="bi bi-check-circle-fill text-success me-2"></span>
                  Explicación detallada
                </li>
                <li>
                  <span className="bi bi-check-circle-fill text-success me-2"></span>
                  Compatible con sistemas electorales
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingSystemSection;
