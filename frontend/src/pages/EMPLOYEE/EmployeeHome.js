import React from "react";
import { useNavigate } from "react-router-dom";

const EmployeeHome = () => {
  const navigate = useNavigate();

  const buttonStyle = {
    padding: "10px",
    fontSize: "16px",
    color: "white",
    backgroundColor: "#00796b",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  return (
    <div className="container">
      <h2>Canteen Employee Panel</h2>
      <div style={{ borderBottom: "2px solid purple", width: "100%", margin: "10px 0" }}></div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
        <button style={buttonStyle} onClick={() => navigate("/employee/orders")}>
          Manage Orders
        </button>

       <button style={buttonStyle} onClick={() => navigate("/employee/menu/add")}>
  Add Products
</button>

<button style={buttonStyle} onClick={() => navigate("/employee/menu/modify")}>
  Modify Products
</button>

      </div>
    </div>
  );
};

export default EmployeeHome;
