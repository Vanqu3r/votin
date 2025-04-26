import React from "react";

import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

// import { useAuth } from "../context/authContext";

// import { useUser } from "../context/userContext";
import { handleLogout } from "../api/firebase.config"; // Asegúrate de importar las funciones de autenticación

export default function Dashboard() {
  //   const { user, logout } = useAuth();
//   const { userData, getUserData } = useUser();
  const navigate = useNavigate();

  /* useEffect(() => {
    getUserData(user.uid);
  }, [user.uid, getUserData]); */

  // Función para manejar el cierre de sesión
  const handleLogoutClick = async () => {
    await handleLogout(); // Llamamos a la función de cierre de sesión de Firebase
    navigate("/"); // Redirigir a la página principal después de cerrar sesión
  };

  return (
    <div className="container mt-5">
      <h1>Dashboard</h1>
      {/* <h2>Welcome, {user.email}</h2> */}
      <button className="btn btn-danger" onClick={handleLogoutClick}>
        Logout
      </button>
      {/* <div className="mt-5">
        <h3>User Data</h3>
        {userData && <pre>{JSON.stringify(userData, null, 2)}</pre>}
      </div> */}
    </div>
  );
}
