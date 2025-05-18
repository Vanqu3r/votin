import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//Bootstrap
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

// Páginas
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import Dashboard from "./pages/Dashboard.js";
import Preferencias from "./pages/Preferencias.js";
import CrearPropuesta from "./pages/CrearPropuesta.js";
import Validacion from "./pages/Validacion.js";
import MiPerfil from "./pages/MiPerfil.js";
import Buscar from "./pages/Buscar.js";
// Componentes
import ProtectedRoute from "./components/ProtectedRoute.js";
import Estadisticas from "./pages/Estadisticas.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas (requieren autenticación) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/miperfil" element={<MiPerfil />} />
          <Route path="/buscar" element={<Buscar />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
        </Route>

        {/* Rutas solo para votantes */}
        <Route element={<ProtectedRoute allowedRoles={["votante"]} />}>
          <Route path="/preferencias" element={<Preferencias />} />
        </Route>

        {/* Rutas solo para votantes */}
        <Route element={<ProtectedRoute allowedRoles={["candidato"]} />}>
          <Route path="/crearpropuesta" element={<CrearPropuesta />} />
        </Route>

        {/* Rutas solo para administradores */}
        <Route element={<ProtectedRoute allowedRoles={["administrador"]} />}>
          <Route path="/validacion" element={<Validacion />} />
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
