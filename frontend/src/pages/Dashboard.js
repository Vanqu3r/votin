import React from "react";
import { useAuth } from "../context/AuthContext";

import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth();
  //   const { userData, getUserData } = useUser();
  const navigate = useNavigate();

  // VALIDAR QUE EL USUARIO ESTÉ LOGUEADO
  /* useEffect(() => {
    // Solo redirige cuando la carga ha terminado Y no hay usuario
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]); */

  // Función para manejar el cierre de sesión
  const handleLogoutClick = async () => {
    await logout(); // Llamamos a la función de cierre de sesión del contexto
    navigate("/"); // Redirigimos a la página de inicio después de cerrar sesión
  };

  return (
    <div className="container mt-5">
      <h1>Dashboard</h1>
      {user?.correo ? <h3>Bienvenido, {user.correo}</h3> : <h3>Bienvenido</h3>}
      <button className="btn btn-danger" onClick={handleLogoutClick}>
        Logout
      </button>
    </div>
  );
}
