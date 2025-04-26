import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../AuthContext";
import { signInWithGoogle } from "../../api/firebase.config"; // Asegúrate de importar las funciones de autenticación
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const api_back = process.env.REACT_APP_BACK;

const Navbar = () => {
  const navigate = useNavigate();

  // const { userL, isLoading } = useAuth();

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
      searchUserByEmail(loggedInUser.email);
    }
  };

  async function searchUserByEmail(email) {
    try {
      const cleanApiBack = api_back.replace(/([^:]\/)\/+/g, "$1");
      const endpoint = `${cleanApiBack}${
        cleanApiBack.endsWith("/") ? "" : "/"
      }`;

      const response = await axios.get(
        `${endpoint}votante/correo/${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response?.data?.correo) {
        navigate("/dashboard"); // Usuario existe
      } else {
        navigate("/login"); // Usuario no tiene correo
      }
    } catch (error) {
      console.error("Error completo:", error);
      if (error.response && error.response.status === 404) {
        navigate("/login");
      } else {
        alert("Error: " + error.message);
      }
    }
  }

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
              {!user && (
                <button onClick={handleLogin} className="btn btn-primary">
                  Iniciar sesión con Google
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
