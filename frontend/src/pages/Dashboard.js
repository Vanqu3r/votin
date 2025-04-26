import React from "react";
import { useAuth } from "../context/AuthContext";

import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  //   const { userData, getUserData } = useUser();
  const navigate = useNavigate();

  // Función para manejar el cierre de sesión
  const handleLogoutClick = async () => {
    await logout(); // Llamamos a la función de cierre de sesión del contexto
    navigate("/"); // Redirigimos a la página de inicio después de cerrar sesión
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
