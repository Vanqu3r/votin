import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//Bootstrap
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
// Componentes
import { About } from "./components/About";
import { User } from "./components/Users";
import ViewCandidates from "./components/candidate/ViewCandidates";
import { NewCandidate } from "./components/candidate/NewCandidate.js";
import ViewUser from "./components/user/ViewUser.jsx";
import { NewUser } from "./components/user/NewUser.js";

// Páginas
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import Dashboard from "./pages/Dashboard.js";
import Preferencias from "./pages/Preferencias.js";

function App() {
  return (
    <Router>
      <Routes>
        {/* Revisadas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/preferencias" element={<Preferencias />} />
        {/* Sin revisar */}
        <Route path="/about" element={<About />} />
        <Route path="/user" element={<User />} />
        <Route path="/viewcandidate" element={<ViewCandidates />} />
        <Route path="/newcandidate" element={<NewCandidate />} />
        <Route path="/viewuser" element={<ViewUser />} />
        <Route path="/newuser" element={<NewUser />} />
      </Routes>
    </Router>
  );
}

export default App;
