import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/cart", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCart(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
        setLoading(false);
      });
  }, []);

  const handleRemoveItem = (menuItemId) => {
    fetch(`http://localhost:5000/api/cart/${menuItemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        setCart((prevCart) => ({
          ...prevCart,
          items: prevCart.items.filter((item) => item.menuItem._id !== menuItemId),
        }));
      })
      .catch((error) => console.error("Error deleting item:", error));
  };

  const handleClearCart = () => {
    fetch("http://localhost:5000/api/cart", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => {
        setCart(null);
      })
      .catch((error) => console.error("Error clearing cart:", error));
  };

  if (loading) return <p>Loading cart...</p>;
  if (!cart || !cart.items || cart.items.length === 0) return <p>Coșul tău este gol.</p>;

  const total = cart.items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

  return (
    <div className="container">
      <h2>Your cart</h2>

      <ul>
        {cart.items.map((item) => (
          <li key={item.menuItem._id}>
            <h3>{item.menuItem.name}</h3>
            <p>Price: {item.menuItem.price} RON</p>
            <p>Quantity: {item.quantity}</p>
            <button onClick={() => handleRemoveItem(item.menuItem._id)}>Delete product</button>
          </li>
        ))}
      </ul>

      <p style={{ fontWeight: "bold", fontSize: "18px" }}>Total: {total} RON</p>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={handleClearCart} style={{ backgroundColor: "red", color: "white" }}>
          Emtpy cart
        </button>

        <button onClick={() => navigate("/payment")} style={{ backgroundColor: "purple", color: "white" }}>
          Go to Payment
        </button>
      </div>
    </div>
  );
};

export default Cart;
