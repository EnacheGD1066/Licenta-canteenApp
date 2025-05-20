import React from "react";
import { useNavigate } from "react-router-dom";

const ManagerHome = () => {
  const navigate = useNavigate();

  const buttonStyle = {
    padding: "10px",
    fontSize: "16px",
    color: "white",
    backgroundColor: "#3366cc",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  return (
    <div className="container">
      <h2>Canteen Manager Panel</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
        <button style={buttonStyle} onClick={() => navigate("/manager/dashboard")}>
          View Dashboard
        </button>
      </div>
    </div>
  );
};

export default ManagerHome;
