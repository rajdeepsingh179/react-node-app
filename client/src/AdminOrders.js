import React, { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/orders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("ORDERS:", data);
        setOrders(data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="container">
      <h1>Orders 📦</h1>

      {orders.length === 0 ? (
        <p>No orders found ❌</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card">
            <h3>{order.customerName}</h3>
            <p><b>Address:</b> {order.address}</p>
            <p><b>Total:</b> ₹{order.total}</p>
            <p><b>Status:</b> {order.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;