import React, { useEffect, useState } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/orders", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error processing orders:", err);
        setLoading(false);
      });
  }, []);

  const handleMarkAsComplete = (orderId) => {
    fetch(`http://localhost:5000/api/admin/orders/${orderId}/complete`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(updated => {
        setOrders(prev => prev.map(o => o._id === orderId ? updated : o));
      })
      .catch(err => console.error("Error updating orders:", err));
  };

  const handleCancelOrder = (orderId) => {
    fetch(`http://localhost:5000/api/admin/orders/${orderId}/cancel`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(updated => {
        setOrders(prev => prev.map(o => o._id === orderId ? updated : o));
      })
      .catch(err => console.error("Error canceling order:", err));
  };

  if (loading) return <p>Loading orders...</p>;
  if (!orders.length) return <p>No orders in Process</p>;

  return (
    <div className="container">
      <h2>Processing Orders</h2>
      {orders.map(order => (
        <div key={order._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "15px", borderRadius: "8px" }}>
          <h4>Order from: {order.userId?.email || "Unknown user."}</h4>
          <p>Date: {new Date(order.orderDate).toLocaleString()}</p>
          <ul>
            {order.items.map(item => (
              <li key={item.menuItem._id}>
                {item.menuItem.name} x {item.quantity}
              </li>
            ))}
          </ul>
          <p><strong>Total:</strong> {order.totalPrice} RON</p>
          <p style={{ fontStyle: "italic" }}>Status: {order.status}</p>

          {order.status === "în procesare" && (
            <>
              <button onClick={() => handleMarkAsComplete(order._id)} style={{ marginTop: "10px", backgroundColor: "green", color: "white" }}>
                 Mark as finished
              </button>
              <button onClick={() => handleCancelOrder(order._id)} style={{ marginTop: "10px", backgroundColor: "red", color: "white", marginLeft: "10px" }}>
                 Cancel order
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
