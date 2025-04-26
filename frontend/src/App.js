import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Importa el CSS de Bootstrap
import "bootstrap/dist/css/bootstrap.css";
// Importa el JavaScript de Bootstrap
import "bootstrap/dist/js/bootstrap.bundle.min";
import { About } from "./components/About";
import { User } from "./components/Users";
import ViewCandidates from "./components/candidate/ViewCandidates";
import { NewCandidate } from "./components/candidate/NewCandidate.js";
import ViewUser from "./components/user/ViewUser.jsx";
import { NewUser } from "./components/user/NewUser.js";
import Login from "./components/Login.js";

import { AuthProvider } from "./components/AuthContext.js";

// Páginas
import Home from "./pages/Home.js";
import Dashboard from "./pages/Dashboard.js";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Revisadas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Sin revisar */}
          <Route path="/about" element={<About />} />
          <Route path="/user" element={<User />} />
          <Route path="/viewcandidate" element={<ViewCandidates />} />
          <Route path="/newcandidate" element={<NewCandidate />} />
          <Route path="/viewuser" element={<ViewUser />} />
          <Route path="/newuser" element={<NewUser />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
