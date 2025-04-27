import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const InternalNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Función para manejar el cierre de sesión
  const handleLogoutClick = async () => {
    await logout(); // Llamamos a la función de cierre de sesión del contexto
    navigate("/"); // Redirigimos a la página de inicio después de cerrar sesión
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        {/* Logo/Marca */}
        <Link className="navbar-brand" to="/dashboard">
          AutoVote
        </Link>

        {/* Botón para dispositivos móviles */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido de la navbar */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Menú principal (izquierda) */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/busacr">
                Buscar
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/estadisticas">
                Estadísticas
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/crearpropuesta">
                Crear propuesta
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/validacion">
                Validación
              </Link>
            </li>
          </ul>

          {/* Menú de usuario (derecha) */}
          <ul className="navbar-nav ms-auto">
            {user ? (
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  to="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="me-2">
                    {(user.nombre ? user.nombre + " " : "") +
                      (user.apellido || "")}
                  </span>
                  <i className="bi bi-person-circle"></i>
                </Link>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    <Link className="dropdown-item" to="/perfil">
                      <i className="bi bi-person me-2"></i>
                      Mi Perfil
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/preferencias">
                      <i className="bi bi-gear me-2"></i>
                      Preferencias
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogoutClick}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Iniciar Sesión
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default InternalNavbar;
