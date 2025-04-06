import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Importa el CSS de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// Importa el JavaScript de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { About } from './components/About';
import { User } from './components/Users';
import { Navbar } from './components/Navbar';
import ViewCandidates from './components/candidate/ViewCandidates';
import { NewCandidate } from './components/candidate/NewCandidate.js';
import ViewUser from './components/user/ViewUser.jsx';
import { NewUser } from './components/user/NewUser.js';
import Login from './components/Login.js';
function App() {
  return (
    <Router>
      <Navbar />
      <div >
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/user" element={<User />} />
          <Route path="/viewcandidate" element={<ViewCandidates />} />
          <Route path="/newcandidate" element={<NewCandidate />} />
          <Route path="/viewuser" element={<ViewUser />} />
          <Route path="/newuser" element={<NewUser />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
