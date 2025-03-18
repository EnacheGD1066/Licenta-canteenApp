import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Menu from "./pages/Menu";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/menu" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/menu" element={isAuthenticated ? <Menu /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
