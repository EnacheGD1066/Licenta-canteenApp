import React, { useEffect, useState } from "react";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/menu")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Eroare la încărcarea produselor:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Sigur vrei să ștergi produsul?");
    if (!confirmDelete) return;

    fetch(`http://localhost:5000/api/admin/menu/${id}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then(() => {
        setProducts(prev => prev.filter(p => p._id !== id));
      })
      .catch(err => console.error("Eroare la ștergere:", err));
  };

  if (loading) return <p>Se încarcă produsele...</p>;

  return (
    <div className="container">
      <h2>Produse existente</h2>

      <button
        onClick={() => alert("")}
        style={{ marginBottom: "15px" }}
      >
         Adaugă produs
      </button>

      <ul>
        {products.map(product => (
          <li key={product._id}>
            <h4>{product.name}</h4>
            <p>Preț: {product.price} RON</p>
            <p>{product.description}</p>
            <p>Disponibil: {product.available ? "Da" : "Nu"}</p>

            <button onClick={() => alert("Modificare Produs")} style={{ marginRight: "10px" }}>
               Modifică
            </button>

            <button onClick={() => handleDelete(product._id)} style={{ backgroundColor: "red", color: "white" }}>
               Șterge
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProductsPage;
