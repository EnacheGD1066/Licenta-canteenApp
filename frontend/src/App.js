import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";

import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Payment from "./pages/Payment";
import AdminHome from "./pages/AdminHome"; 
import AdminOrders from "./pages/AdminOrders";
import AdminProductsPage from "./pages/AdminProductsPage";
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const role = localStorage.getItem("role");

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
    localStorage.removeItem("role"); 
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <nav>
        {isAuthenticated && role !== "admin" && (
          <>
            <Link to="/menu">Menu</Link>
            <Link to="/cart">Your cart</Link>
            <Link to="/orders">Orders</Link>
          </>
        )}
        {isAuthenticated && (
          <button onClick={handleLogout}>Logout</button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={
          !isAuthenticated ? (
            <Login onLoginSuccess={handleLoginSuccess} />
          ) : role === "admin" ? (
            <Navigate to="/admin" />
          ) : (
            <Navigate to="/menu" />
          )
        } />
        <Route path="/menu" element={isAuthenticated && role !== "admin" ? <Menu /> : <Navigate to="/" />} />
        <Route path="/cart" element={isAuthenticated && role !== "admin" ? <Cart /> : <Navigate to="/" />} />
        <Route path="/orders" element={isAuthenticated && role !== "admin" ? <Orders /> : <Navigate to="/" />} />
        <Route path="/payment" element={isAuthenticated && role !== "admin" ? <Payment /> : <Navigate to="/" />} />
        <Route path="/admin" element={isAuthenticated && role === "admin" ? <AdminHome /> : <Navigate to="/" />} />
        <Route path="/admin/orders" element={isAuthenticated && role === "admin" ? <AdminOrders /> : <Navigate to="/" />} />
        <Route path="/admin/products" element={isAuthenticated && role === "admin" ? <AdminProductsPage /> : <Navigate to="/" />}/>
      </Routes>
    </Router>
  );
}

export default App;
