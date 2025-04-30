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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/preferencias" element={<Preferencias />} />
        <Route path="/crearpropuesta" element={<CrearPropuesta />} />
        <Route path="/validacion" element={<Validacion />} />
        <Route path="/miperfil" element={<MiPerfil />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
