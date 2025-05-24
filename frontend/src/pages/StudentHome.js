import React from "react";
import { useNavigate } from "react-router-dom";

const StudentHome = () => {
  const navigate = useNavigate();

  const btn = {
    padding: "10px",
    fontSize: "16px",
    color: "white",
    backgroundColor: "#6200ea",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "10px"
  };

  return (
    <div className="container">
      <h2>Welcome to Cantina ASE</h2>
      <p>Where do you want to go?</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
        <button style={btn} onClick={() => navigate("/menu")}>
          Menu
        </button>
        <button style={btn} onClick={() => navigate("/cart")}>
          Cart
        </button>
        <button style={btn} onClick={() => navigate("/orders")}>
          Orders
        </button>
      </div>
    </div>
  );
};

export default StudentHome;
