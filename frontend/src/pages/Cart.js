import React, { useEffect, useState } from "react";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch cart
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

  // remove one item 
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
      .catch((error) => console.error("Error removing item:", error));
  };

 //clear the cart 
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

  if (loading) return <p>Se încarcă coșul...</p>;
  if (!cart || !cart.items || cart.items.length === 0) return <p>Coșul tău este gol.</p>;

  return (
    <div>
      <h2>Coș de cumpărături</h2>
      <ul>
        {cart.items.map((item) => (
          <li key={item.menuItem._id}>
            <h3>{item.menuItem.name}</h3>
            <p>Preț: {item.menuItem.price} RON</p>
            <p>Cantitate: {item.quantity}</p>
            <button onClick={() => handleRemoveItem(item.menuItem._id)}>Șterge produs</button>
          </li>
        ))}
      </ul>
      <button onClick={handleClearCart} style={{ marginTop: "10px", color: "red" }}>
        Golește coșul
      </button>
    </div>
  );
};

export default Cart;
