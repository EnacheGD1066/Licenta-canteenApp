import React, { useEffect, useState } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";

const ProductList = ({ products, onModify, onDelete, onOutOfStock }) => (
  <ul>
    {products.map(product => (
      <li key={product._id}>
        <h4>{product.name}</h4>
        <p>Price: {product.price} RON</p>
        <p>{product.description}</p>
        <p>Available: {product.available ? "Yes" : "No"}</p>
        <p>Stock: {product.stock}</p>
        <button onClick={() => onModify(product)} style={{ marginRight: "10px" }}>Modify</button>
        {product.available && (
          <button onClick={() => onOutOfStock(product._id)} style={{ backgroundColor: "orange", color: "white", marginRight: "10px" }}>
            Mark Out of Stock
          </button>
        )}
        <button onClick={() => onDelete(product._id)} style={{ backgroundColor: "red", color: "white" }}>Delete</button>
      </li>
    ))}
  </ul>
);

const EmployeeCRUDMenu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    available: true,
    stock: 500,
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isAddModal = location.pathname === "/employee/menu/add";

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

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      alert("Name and price are required.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/employee/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      setProducts(prev => [...prev, data]);
      setNewProduct({ name: "", price: "", description: "", available: true, stock: 500 });
      navigate("/employee/menu/modify");
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    fetch(`http://localhost:5000/api/employee/menu/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => setProducts(prev => prev.filter(p => p._id !== id)))
      .catch(err => console.error("Error deleting product:", err));
  };

  const handleSetOutOfStock = async (id) => {
    if (!window.confirm("Mark this product as unavailable?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/employee/menu/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: false }),
      });
      const updated = await res.json();
      setProducts(prev => prev.map(p => (p._id === id ? updated : p)));
    } catch (err) {
      console.error("Error updating availability:", err);
    }
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct({ ...product });
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/employee/menu/${selectedProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedProduct),
      });
      const updated = await res.json();
      setProducts(prev => prev.map(p => (p._id === selectedProduct._id ? updated : p)));
      setEditModalVisible(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error("Error saving product update:", err);
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <>
      <Routes>
        <Route path="/" element={
          <div className="container">
            <h2>Products</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "25px" }}>
              <button onClick={() => navigate("/employee/orders")} style={buttonStyle}>Manage Orders</button>
              <button onClick={() => navigate("/employee/menu/add")} style={buttonStyle}>Add Product</button>
              <button onClick={() => navigate("/employee/menu/modify")} style={buttonStyle}>Modify Products</button>
            </div>
          </div>
        } />

        <Route path="/modify" element={
          <div className="container">
            <h2>Modify Products</h2>
            <ProductList
              products={products}
              onModify={handleOpenEditModal}
              onDelete={handleDelete}
              onOutOfStock={handleSetOutOfStock}
            />
          </div>
        } />
      </Routes>

      {isAddModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Add New Product</h3>
            <input placeholder="Name" value={newProduct.name} onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))} />
            <input placeholder="Price" type="number" value={newProduct.price} onChange={e => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))} />
            <input placeholder="Description" value={newProduct.description} onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))} />
            <input placeholder="Stock" type="number" value={newProduct.stock} onChange={e => setNewProduct(prev => ({ ...prev, stock: parseInt(e.target.value) }))} />
            <label>
              Available:
              <input type="checkbox" checked={newProduct.available} onChange={e => setNewProduct(prev => ({ ...prev, available: e.target.checked }))} />
            </label>
            <div style={{ marginTop: "10px" }}>
              <button onClick={handleAddProduct} style={{ marginRight: "10px", backgroundColor: "green", color: "white" }}>Add</button>
              <button onClick={() => navigate("/employee/menu")} >Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editModalVisible && selectedProduct && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3>Edit Product</h3>
            <input value={selectedProduct.name} onChange={e => setSelectedProduct(prev => ({ ...prev, name: e.target.value }))} />
            <input type="number" value={selectedProduct.price} onChange={e => setSelectedProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))} />
            <input value={selectedProduct.description} onChange={e => setSelectedProduct(prev => ({ ...prev, description: e.target.value }))} />
            <input type="number" value={selectedProduct.stock} onChange={e => setSelectedProduct(prev => ({ ...prev, stock: parseInt(e.target.value) }))} />
            <label>
              Available:
              <input type="checkbox" checked={selectedProduct.available} onChange={e => setSelectedProduct(prev => ({ ...prev, available: e.target.checked }))} />
            </label>
            <div style={{ marginTop: "10px" }}>
              <button onClick={handleSaveEdit} style={{ marginRight: "10px", backgroundColor: "green", color: "white" }}>Save</button>
              <button onClick={() => setEditModalVisible(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const buttonStyle = {
  padding: "10px",
  fontSize: "16px",
  color: "white",
  backgroundColor: "#00796b",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modalContent = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  width: "400px",
  display: "flex",
  flexDirection: "column",
  gap: "10px"
};

export default EmployeeCRUDMenu;
