import React, { useEffect, useState } from "react";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/menu")
      .then((response) => response.json())
      .then((data) => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching menu:", error);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (menuItemId) => {
    fetch("http://localhost:5000/api/menu/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT din localStorage
      },
      body: JSON.stringify({ menuItemId, quantity: 1 }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Produs adăugat în coș!");
      })
      .catch((error) => console.error("Error adding to cart:", error));
  };

  if (loading) return <p>Se încarcă meniul...</p>;

  return (
    <div>
      <h2>Meniu</h2>
      <ul>
        {menuItems.map((item) => (
          <li key={item._id}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Preț: {item.price} RON</p>
            <button onClick={() => handleAddToCart(item._id)}>Adaugă în coș</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
