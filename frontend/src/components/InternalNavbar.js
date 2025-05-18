import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaShieldAlt, // Administrador
  FaUserTie, // Candidato
  FaUser, // Votante
  FaSignOutAlt, // Cerrar sesión
  FaUserCog, // Preferencias
  FaUserEdit, // Perfil
  FaChartLine, // Estadísticas
  FaSearch, // Buscar
  FaHome, // Dashboard
  FaPlus, // Crear propuesta
  FaCheckCircle, // Validación
  FaPoll, // Validación
} from "react-icons/fa";

const InternalNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    await logout();
    navigate("/");
  };

  // Componente para mostrar el icono según el tipo de usuario
  const UserTypeIcon = ({ type }) => {
    const iconClass = "text-lg me-2";

    switch (type) {
      case "administrador":
        return <FaShieldAlt className={`${iconClass} text-purple-500`} />;
      case "candidato":
        return <FaUserTie className={`${iconClass} text-blue-500`} />;
      case "votante":
        return <FaUser className={`${iconClass} text-green-500`} />;
      default:
        return <FaUser className={iconClass} />;
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary py-1 shadow-sm">
      <div className="container-fluid">
        {/* Logo/Marca */}
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <FaShieldAlt className="me-2" />
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
              <Link
                className="nav-link d-flex align-items-center"
                to="/dashboard"
              >
                <FaHome className="me-1" />
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to="/buscar">
                <FaSearch className="me-1" />
                Buscar
              </Link>
            </li>
            {user?.tipo !== "votante" && (
              <li className="nav-item">
                <Link
                  className="nav-link d-flex align-items-center"
                  to="/estadisticas"
                >
                  <FaChartLine className="me-1" />
                  Estadísticas
                </Link>
              </li>
            )}
            {user?.tipo === "candidato" && (
              <li className="nav-item">
                <Link
                  className="nav-link d-flex align-items-center"
                  to="/crearpropuesta"
                >
                  <FaPlus className="me-1" />
                  Crear propuesta
                </Link>
              </li>
            )}
            {user?.tipo === "administrador" && (
              <li className="nav-item">
                <Link
                  className="nav-link d-flex align-items-center"
                  to="/validacion"
                >
                  <FaCheckCircle className="me-1" />
                  Validación
                </Link>
              </li>
            )}
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
                  <UserTypeIcon type={user.tipo} />
                  <span className="me-2">
                    {[user.nombre, user.apellido].filter(Boolean).join(" ")}
                  </span>
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      className="img-fluid rounded-circle"
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "cover",
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <span
                      className="symbol-label bg-light text-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "30px", height: "30px" }}
                    >
                      {user.nombre?.charAt(0)}
                      {user.apellido?.charAt(0)}
                    </span>
                  )}
                </Link>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center"
                      to="/miperfil"
                    >
                      <FaUserEdit className="me-2" />
                      Mi Perfil
                    </Link>
                  </li>
                  {user?.tipo === "votante" && (
                    <>
                      <li>
                        <Link
                          className="dropdown-item d-flex align-items-center"
                          to="/preferencias"
                        >
                          <FaUserCog className="me-2" />
                          Preferencias
                        </Link>
                      </li>
                      <a
                        className="dropdown-item d-flex align-items-center"
                        href="https://forms.gle/uqyLpittpqKoygNTA"
                        target="_blank"
                      >
                        <FaPoll className="me-1" />
                        Encuesta de satisfacción
                      </a>
                    </>
                  )}
                  {user?.tipo === "candidato" && (
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="https://forms.gle/5CccXPmDh3RMXJfu5"
                      target="_blank"
                    >
                      <FaPoll className="me-1" />
                      Encuesta de satisfacción
                    </a>
                  )}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center text-danger"
                      onClick={handleLogoutClick}
                    >
                      <FaSignOutAlt className="me-2" />
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link btn btn-outline-light" to="/">
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
