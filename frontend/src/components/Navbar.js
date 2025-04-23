import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { signInWithGoogle, handleLogout } from "../api/firebase.config"; // Asegúrate de importar las funciones de autenticación
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { userL, isLoading } = useAuth();

  // Función para verificar si el usuario esta logueado
  const isLoggedIn = () => {
    return false;
  };

  const [user, setUser] = useState(null);

  // Comprobar el estado de autenticación cuando el componente se monta
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Si hay un usuario autenticado, actualizamos el estado
      } else {
        setUser(null); // Si no hay usuario, limpiamos el estado
      }
    });

    return () => unsubscribe(); // Limpiamos el listener cuando el componente se desmonte
  }, []);

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    const loggedInUser = await signInWithGoogle();
    if (loggedInUser) {
      setUser(loggedInUser); // Actualizamos el estado con el usuario logueado
    }
  };

  // Función para manejar el cierre de sesión
  const handleLogoutClick = async () => {
    await handleLogout(); // Llamamos a la función de cierre de sesión de Firebase
    setUser(null); // Limpiamos el estado de usuario
  };

  if (isLoading) return <div>Cargando...</div>;
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Votin
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Principal
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Usuario
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/newuser">
                    Registrar un Usuario
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/viewuser">
                    Ver usuario
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Candidato
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/newcandidate">
                    Registrar un candidato
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/viewcandidate">
                    Ver candidatos
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link disabled" aria-disabled="true">
                Disabled
              </Link>
            </li>
            {/* Aquí es donde mostramos el botón de login o el nombre del usuario */}
            <li className="nav-item">
              {!user ? (
                <button onClick={handleLogin} className="btn btn-primary">
                  Iniciar sesión con Google
                </button>
              ) : (
                <div className="d-flex align-items-center">
                  <span className="nav-link me-3">
                    Bienvenido, {user.displayName}
                  </span>
                  <button
                    onClick={handleLogoutClick}
                    className="btn btn-danger"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </li>
            {/* Mostrar Iniciar sesión SOLO si no hay usuario logueado */}
            {!userL && (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Iniciar sesión
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className="navbar-user">
          {userL ? (
            <>
              <span>Bienvenido, {userL.name}</span>
              <LogoutButton />
            </>
          ) : (
            <span>No has iniciado sesión</span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
