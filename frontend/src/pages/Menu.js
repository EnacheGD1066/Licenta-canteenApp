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
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ menuItemId, quantity: 1 }),
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Error adding product.");
        return;
      }
      alert("Product added to cart!");
    })
    .catch((error) => console.error("Error adding to cart: Cannot add more than 2 products.", error));
  };

  if (loading) return <p>Loading Menu...</p>;

  return (
    <div>
      <h2>Menu</h2>
      <ul>
        {menuItems.map((item) => (
          <li key={item._id}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Price: {item.price} RON</p>
            <p>Stock available: {item.stock} pcs</p> 
            <button onClick={() => handleAddToCart(item._id)}>Add in cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
