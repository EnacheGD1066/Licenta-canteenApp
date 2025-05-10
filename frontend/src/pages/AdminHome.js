import React from "react";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const navigate = useNavigate();

  const buttonStyle = {
    padding: "10px",
    fontSize: "16px",
    color: "white",
    backgroundColor: "#6200ea",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  return (
    <div className="container">
      <h2>Canteen Admin Panel </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
        <button style={buttonStyle} onClick={() => navigate("/admin/dashboard")}>
            Dashboard
        </button>

        <button style={buttonStyle} onClick={() => navigate("/admin/orders")}>
           Orders Processing
        </button>

        <button style={buttonStyle} onClick={() => navigate("/admin/products")}>
           Modify products
        </button>
      </div>
    </div>
  );
};

export default AdminHome;
