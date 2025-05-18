import React, { useEffect, useState } from "react";

const EmployeeCRUDMenu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/employee/menu")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading products:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete the product?");
    if (!confirmDelete) return;

    fetch(`http://localhost:5000/api/employee/menu/${id}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then(() => {
        setProducts(prev => prev.filter(p => p._id !== id));
      })
      .catch(err => console.error("Error deleting product:", err));
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="container">
      <h2>Products</h2>

      <button
        onClick={() => alert("")}
        style={{ marginBottom: "15px" }}
      >
         ADD Product
      </button>

      <ul>
        {products.map(product => (
          <li key={product._id}>
            <h4>{product.name}</h4>
            <p>Price: {product.price} RON</p>
            <p>{product.description}</p>
            <p>Available: {product.available ? "Yes" : "No"}</p>

            <button onClick={() => alert("Modify Product")} style={{ marginRight: "10px" }}>
               Modify Product
            </button>

            <button onClick={() => handleDelete(product._id)} style={{ backgroundColor: "red", color: "white" }}>
               Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeCRUDMenu;
