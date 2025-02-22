import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { About } from './components/About';
import { User } from './components/Users';
import { Navbar } from './components/Navbar';
function App() {
  return (
    <Router>
      <Navbar />
      <div >
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
