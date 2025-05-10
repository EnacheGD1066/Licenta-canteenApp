import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/orders", {
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

  if (loading) return <p>Loading orders...</p>;
  if (orders.length === 0) return <p>You don't hava any orders.</p>;

  const processingOrders = orders.filter(order => order.status === "Processing order.");
  const completedOrders = orders.filter(order => order.status !== "Order Complete.");

  const renderOrder = (order, isProcessing = false) => (
    <div key={order._id} style={{
      border: isProcessing ? "2px solid orange" : "1px solid #ccc",
      borderRadius: "8px",
      padding: "10px",
      marginBottom: "15px"
    }}>
      <h4>{isProcessing ? "Order in process" : "Order"}</h4>
      <p>Date: {new Date(order.orderDate).toLocaleString()}</p>
      <ul>
        {order.items.map(item => (
          <li key={item.menuItem._id}>
            {item.menuItem.name} x {item.quantity}
          </li>
        ))}
      </ul>
      <strong>Total: {order.totalPrice} RON</strong>
      <p style={{ fontStyle: "italic" }}>Status: {order.status}</p>
    </div>
  );

  return (
    <div>
      <h2>Your orders:</h2>

      {processingOrders.length > 0 && (
        <div>
          <h3>Processing</h3>
          {processingOrders.map(order => renderOrder(order, true))}
        </div>
      )}

      {completedOrders.length > 0 && (
        <div>
          <h3>Finished </h3>
          {completedOrders.map(order => renderOrder(order))}
        </div>
      )}
    </div>
  );
};

export default Orders;
