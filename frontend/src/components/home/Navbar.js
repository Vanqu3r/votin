import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signInWithGoogle, handleLogout } from "../../api/firebase.config"; // Asegúrate de importar las funciones de autenticación
import { getAuth, onAuthStateChanged } from "firebase/auth";
import apiClient from "../../api/client";

const Navbar = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

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
      searchUserByEmail(loggedInUser.email, loggedInUser.photoURL);
    }
  };

  async function searchUserByEmail(email, photoURL) {
    try {
      let tipo = "votante";

      let response = await apiClient.get(
        `votante/correo/${encodeURIComponent(email)}`
      );

      if (response.data.error) {
        response = await apiClient.get(
          `politico/correo/${encodeURIComponent(email)}`
        );
        tipo = "candidato";
      }

      if (response.data.error) {
        response = await apiClient.get(
          `administrador/correo/${encodeURIComponent(email)}`
        );
        tipo = "administrador";
      }

      if (response?.data?.correo) {
        const userk = {
          uid: response.data._id,
          photoURL,
          nombre: response.data.nombre,
          apellido: response.data.apellido,
          correo: response.data.correo,
          tipo,
          edad: response.data.edad,
          codigo_postal: response.data.codigo_postal,
          colonia: response.data.colonia,
          ciudad: response.data.ciudad,
          estado: response.data.estado,
        };

        login(userk);
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error completo:", error);
    }
  }

  // --- FUNCION PARA CERRAR SESION
  const handleLogoutClick = async () => {
    await handleLogout(); // Llamamos a la función de cierre de sesión de Firebase
    navigate("/"); // Redirigir a la página principal después de cerrar sesión
  };
  // --- FUNCION PARA CERRAR SESION

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          AutoVote
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
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Características
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Opiniones
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Contáctanos
              </Link>
            </li>

            {/* Aquí es donde mostramos el botón de login o el nombre del usuario */}
            <li className="nav-item">
              {!user ? (
                  <button
                  onClick={handleLogin}
                  className="btn btn-light d-flex align-items-center"
                  style={{
                    backgroundColor: "#e0e0e0",
                    border: "1px solid #ccc",
                    color: "#000",
                    fontWeight: "500",
                    gap: "10px",
                    padding: "6px 12px"
                  }}
                >
                  {/* Imagen de Google dentro del botón */}
                  <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google"
                    style={{ width: "20px", height: "20px" }}
                  />
                  Iniciar sesión con Google
                </button>
              ) : (
                <button
                  className="btn btn-primary "
                  onClick={handleLogoutClick}
                >
                  Cerrar sesión
                </button>
              )}
            </li>
            {/* Aquí es donde mostramos el botón de login o el nombre del usuario */}
            <li className="nav-item">
              {!user ? (
                <button onClick={handleLogin} className="btn btn-primary" >
                  Iniciar sesión con correo
                </button>
              ) : (
                <button
                  className="btn btn-primary "
                  onClick={handleLogoutClick}
                >
                  Cerrar sesión
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
