import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleanValue = name === "cardNumber" ? value.replace(/\s+/g, "") : value;
    setFormData(prev => ({ ...prev, [name]: cleanValue }));
  };

  const validateCard = () => {
    const { name, cardNumber, expiry, cvv } = formData;
    if (!name || !cardNumber || !expiry || !cvv) return "All fields are mandatory!";
    if (!/^\d{16}$/.test(cardNumber)) return "Card number invalid!";
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return "Card date invalid!";
    if (!/^\d{3}$/.test(cvv)) return "CVV invalid!";
  
    const [expMonth, expYear] = expiry.split("/").map(Number);
    if (expMonth < 1 || expMonth > 12) return "Invalid month!";
  
    const now = new Date();
    const currentYear = now.getFullYear() % 100; 
    const currentMonth = now.getMonth() + 1;
  
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return "Card is expired!";
    }
  
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateCard();
    if (validationError) {
      setError(validationError);
      return;
    }

    fetch("http://localhost:5000/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) return setError(data.error);
        alert(data.message);
        navigate("/orders");
      })
      .catch(err => setError("Error processing payment!"));
  };

  return (
    <div className="container">
      <h2>Plată</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cardNumber"
          placeholder="Name of card holder"
          value={formData.cardNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="expiry"
          placeholder="Expiry date (MM/YY)"
          value={formData.expiry}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cvv"
          placeholder="CVV"
          value={formData.cvv}
          onChange={handleChange}
          required
        />
        <button type="submit" style={{ backgroundColor: "green", color: "white", marginTop: "10px" }}>
          Pay now
        </button>
      </form>
    </div>
  );
};

export default Payment;
