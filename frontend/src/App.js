import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <nav>
        {isAuthenticated && (
          <>
            <Link to="/menu">Meniu</Link>
            <Link to="/cart">Coș</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={!isAuthenticated ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/menu" />} />
        <Route path="/menu" element={isAuthenticated ? <Menu /> : <Navigate to="/" />} />
        <Route path="/cart" element={isAuthenticated ? <Cart /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
